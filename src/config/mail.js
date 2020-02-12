/**
 * @description: Configurações do noemailer
 * - Foi sendo utilizado o mailtrap para envio de e-mail
 */
module.exports = {
  host: process.env.MAIL_HOST || 'email-ssl.com.br',
  port: process.env.MAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER || 'contato@kaique.provisorio.ws',
    pass: process.env.MAIL_PASS || 'Tecno1101943..'
  }
}
