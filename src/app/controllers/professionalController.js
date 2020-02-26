const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Professional = require('../models/professional');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const professionals = await Professional.find().populate('user');

    return res.send({ professionals });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading professionals' });
  }
});

router.get('/:professionalId', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.professionalId).populate('user');

    return res.send({ professional });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading professional' });
  }
});

router.post('/', async (req, res) => {
  try {
    let professional;
    if (req.files && req.files.foto) {
      let avatar
      if(req.files.foto){
        avatar = req.files.foto;
        avatar.mv('./uploads/professionals/' + req.body.cpf + '/foto/' + avatar.name);
      }
      req.body.foto = avatar.name
    }else{
      req.body.foto = ''
    }

    if(req.files && req.files.curriculoAnexo){
      let curriculo
      if(req.files.curriculoAnexo){
        curriculo = req.files.curriculoAnexo
        avatar.mv('./uploads/professionals/' + req.body.cpf + '/curriculo' + curriculo.name);
      }
      req.body.curriculoAnexo = curriculo.name
    }else{
      req.body.curriculoAnexo = ''
    }

    if(req.files && req.files.certificadoAnexo){
      let certificado
      if(req.files.certificadoAnexo){
        certificado = req.files.certificadoAnexo
        avatar.mv('./uploads/professionals/' + req.body.cpf + '/certificado/' + certificado.name);
      }
      req.body.certificadoAnexo = certificado.name
    }else{
      req.body.certificadoAnexo = ''
    }

    if(req.files && req.files.cartaRecomendacaoAnexo){
      let cartaRecomendacao
      if(req.files.cartaRecomendacaoAnexo){
        cartaRecomendacao = req.files.cartaRecomendacaoAnexo
        avatar.mv('./uploads/professionals/' + req.body.cpf + '/carta-recomendacao/' + cartaRecomendacao.name);
      }
      req.body.cartaRecomendacaoAnexo = cartaRecomendacao.name
    }else{
      req.body.cartaRecomendacaoAnexo = ''
    }

    professional = await Professional.create({ ...req.body, user: req.userId });
    await professional.save();

    return res.send({ professional });
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new professional' });
  }

}); 

router.put('/:professionalId', async (req, res) => {
  try {
    if (req.files && req.files.foto) {
      let avatar
      if(req.files.foto){
        avatar = req.files.foto;
        avatar.mv('./uploads/professionals/' + req.body.cpf + '/foto/' + avatar.name);
      }
      req.body.foto = avatar.name
    }

    if(req.files && req.files.curriculoAnexo){
      let curriculo
      if(req.files.curriculoAnexo){
        curriculo = req.files.curriculoAnexo
        curriculo.mv('./uploads/professionals/' + req.body.cpf + '/curriculo/' + curriculo.name);
      }
      req.body.curriculoAnexo = curriculo.name
    }

    if(req.files && req.files.certificadoAnexo){
      let certificado
      if(req.files.certificadoAnexo){
        certificado = req.files.certificadoAnexo
        certificado.mv('./uploads/professionals/' + req.body.cpf + '/certificado/' + certificado.name);
      }
      req.body.certificadoAnexo = certificado.name
    }

    if(req.files && req.files.cartaRecomendacaoAnexo){
      let cartaRecomendacao
      if(req.files.cartaRecomendacaoAnexo){
        cartaRecomendacao = req.files.cartaRecomendacaoAnexo
        cartaRecomendacao.mv('./uploads/professionals/' + req.body.cpf + '/carta-recomendacao/' + cartaRecomendacao.name);
      }
      req.body.cartaRecomendacaoAnexo = cartaRecomendacao.name
    }
    
    const professional = await Professional.findByIdAndUpdate(req.params.professionalId, req.body, { new: true });

    await professional.save();

    return res.send({ professional });
  } catch (err) {
    return res.status(400).send({ error: 'Error updating professional' });
  }
});

router.delete('/:professionalId', async (req, res) => {
  try {
    await Professional.findByIdAndRemove(req.params.professionalId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting professional' });
  }
});

module.exports = app => app.use('/professional', router);
