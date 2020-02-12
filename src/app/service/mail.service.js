const nodemailer = require("nodemailer");

class MailService {
    async sendEmail(email, subject) {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: process.env.SECURE, // true for 465, false for other ports
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            },
            tls: { rejectUnauthorized: false }
          });
      
          const mailOptions = {
            from: process.env.FROM,
            to: email,
            subject: subject,
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
    }
}

module.exports = new MailService()