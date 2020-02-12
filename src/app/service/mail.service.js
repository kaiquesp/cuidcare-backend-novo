const nodemailer = require("nodemailer");

function sendEmail() {
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
}