const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authConfig = require('../../config/auth');
const nodemailer = require("nodemailer");
const User = require('../models/user');
const Mail = require('../services/Mail')
const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req, res) => {
  const { email, cpf } = req.body;

  try {
    if (await User.findOne({ email })){ 
      return res.status(400).send({ error: 'E-mail já cadastrado' });
    }else if(email.length === 0){
      return res.status(400).send({
        error: 'E-mail não pode estar vazio'
      })
      return;
    }

    if (req.body.nome.length === 0){
      return res.status(400).send({
        error: 'Nome não pode estar vazio'
      })
      return;
    }

    if (await User.findOne({ cpf })){ 
      return res.status(400).send({ error: 'CPF já cadastrado' });
    }else if(cpf.length === 0) {
      return res.status(400).send({
        error: 'CPF não pode estar vazio'
      })
      return;
    }

    if (req.body.celular.length === 0){
      return res.status(400).send({
        error: 'Celular não pode estar vazio'
      })

      return;
    }

    if (req.body.password.length === 0){
      return res.status(400).send({
        error: 'Senha não pode estar vazio'
      })

      return;
    }

    const user = await User.create(req.body);

    user.password = undefined;

    const mailOptions = {
      from: '"Kaique" <contato@kaique.provisorio.ws>',
      to: email,
      subject: `Confirmação de cadastro`,
      template: 'register',
      context: { email: email, code: confirmationCode }
    };
  
    Mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
      }
    });

  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/activate-account', async (req, res) => {
  const { email, confirmationCode } = req.body;

  const user = await User.findOne({email, confirmationCode})
  console.log(user)

  if (user){
    user.confirmationCode = '';
    user.status = true
    const userUpdate = await User.findByIdAndUpdate(user.id, user, { new: true });
    return res.status(200).send({
      user: userUpdate
    })
  }else{
    return res.status(404).send({
      error: 'Falha ao ativar conta, verifique se digitou o código e email corretos'
    })
  }
})

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
      html: { path: './src/resources/mail/auth/forgot_password.html' }
    };

    transporter.sendMail(mailOptions, function (error, info) {
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
