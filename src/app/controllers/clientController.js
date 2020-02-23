const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Client = require('../models/client');
const multipart = require('connect-multiparty');

const router = express.Router();

router.use(authMiddleware);

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().populate('user');

    return res.send({ clients });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading clients' });
  }
});

router.get('/:clientId', async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId).populate('user');

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading client' });
  }
});

router.post('/', async (req, res) => {
  try {
    // const { title, description, tasks } = req.body;

    let avatar = req.files.foto;

    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    avatar.mv('./uploads/client/' + avatar.name);

    req.body.foto = avatar.name

    const client = await Client.create({ ...req.body, user: req.userId });

    // await Promise.all(tasks.map(async task => {
    //   const projectTask = new Task({ ...task, project: project._id });

    //   await projectTask.save();

    //   project.tasks.push(projectTask);
    // }));

    await client.save();

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new client' });
  }
});

const multipartMiddleware = multipart({ uploadDir: './uploads' });
router.post('/upload', multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});

router.put('/:clientId', async (req, res) => {
  try {
    // const { title, description, tasks } = req.body;

    const client = await Client.findByIdAndUpdate(req.params.clientId, req.body, { new: true });

    // project.tasks = [];
    // await Task.remove({ project: project._id });

    // await Promise.all(tasks.map(async task => {
    //   const projectTask = new Task({ ...task, project: project._id });

    //   await projectTask.save();

    //   project.tasks.push(projectTask);
    // }));

    await client.save();

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ error: 'Error updating client' });
  }
});

router.delete('/:clientId', async (req, res) => {
  try {
    await Client.findByIdAndRemove(req.params.clientId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting client' });
  }
});

module.exports = app => app.use('/client', router);
