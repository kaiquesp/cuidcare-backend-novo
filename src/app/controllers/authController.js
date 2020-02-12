const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const nodemailer = require("nodemailer");

const User = require('../models/user');

const mail = require('../service/mail.service')

const configEmail = require('../../config/mail.json')

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req, res) => {
  const { email, cpf } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'E-mail já cadastrado' });

    if (await User.findOne({ cpf }))
      return res.status(400).send({ error: 'CPF já cadastrado' });

    const user = await User.create(req.body);

    user.password = undefined;

    // mail.sendMail

    const transporter = nodemailer.createTransport({
      host: configEmail.host,
      port: configEmail.port,
      secure: configEmail.secure, // true for 465, false for other ports
      auth: {
        user: configEmail.user,
        pass: configEmail.pass
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: configEmail.user,
      to: email,
      subject: 'Novo cadastro',
      html : { path: './src/resources/mail/auth/forgot_password.html' }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
        return res.status(200).send({
          message: 'E-mail enviado com sucesso',
          user: user
        })
      }
    });

  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res.status(400).send({ error: 'User not found' });

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password' });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });

    const transporter = nodemailer.createTransport({
      host: "email-ssl.com.br",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "contato@kaique.provisorio.ws",
        pass: "Tecno1101943.."
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: 'contato@kaique.provisorio.ws',
      to: 'kaiqueexp@gmail.com',
      subject: 'E-mail enviado usando Node!',
      html : { path: './src/resources/mail/auth/forgot_password.html' }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
        return res.status(200).send({
          message: 'Mensagem enviada com sucesso'
        })
      }
    });

  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password, try again' });
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if (!user)
      return res.status(400).send({ error: 'User not found' });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid' });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, generate a new one' });

    user.password = password;

    await user.save();

    res.send();
  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password, try again' });
  }
});

module.exports = app => app.use('/auth', router);
