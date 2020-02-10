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
    // const { title, description, tasks } = req.body;

    const professional = await Professional.create({ ...req.body, user: req.userId });

    // await Promise.all(tasks.map(async task => {
    //   const projectTask = new Task({ ...task, project: project._id });

    //   await projectTask.save();

    //   project.tasks.push(projectTask);
    // }));

    await professional.save();

    return res.send({ professional });
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new professional' });
  }
});

router.put('/:professionalId', async (req, res) => {
  try {
    // const { title, description, tasks } = req.body;

    const professional = await Professional.findByIdAndUpdate(req.params.professionalId, req.body, { new: true });

    // project.tasks = [];
    // await Task.remove({ project: project._id });

    // await Promise.all(tasks.map(async task => {
    //   const projectTask = new Task({ ...task, project: project._id });

    //   await projectTask.save();

    //   project.tasks.push(projectTask);
    // }));

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
