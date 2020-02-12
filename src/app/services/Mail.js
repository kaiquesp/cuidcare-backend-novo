/**
 * @description: Configurações de transoporte do nodemailer
 * - Em ambiente de DEV foi utilizado o nodemail, pois todos os e-mail enviados devem ser direcionados a uma única caixa de entrada independente do destinatário
 * - Em prod deve ser configurado um servidor de e-mail externo como o g-mail, mandril, Amazon Sas, ParkPost dentre outros
 */
const nodemailer = require('nodemailer')
const mailConfig = require('../../config/mail')

// Configura o template do e-mail
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')

const transport = nodemailer.createTransport(mailConfig)

// Configurações do template
// transport.use(
//   'compile',
//   hbs({
//     viewEngine: exphbs(),
//     viewPath: path.resolve(__dirname, '..', 'views', 'emails'),
//     extName: '.hbs',
//     defaultLayout: 'purchase.hbs'
//   })
// )

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: 'src/app/views/emails',
    layoutsDir: 'src/app/views/emails',
    defaultLayout: 'register.hbs',
  },
  viewPath: 'src/app/views/emails',
  extName: '.hbs',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport
