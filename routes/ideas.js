const express = require('express');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const router = express.Router();

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', ensureAuthenticated, async (req, res) => {
  const ideas = await Idea.find({ user: req.user.id }).sort({ date: 'desc' });
  res.render('ideas/index', { ideas: ideas });
})

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id });
  if (idea.user !== req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/ideas');
  } else {
    res.render('ideas/edit', { idea: idea });
  }
});

// Process Form
router.post('/', ensureAuthenticated, async (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }
  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    await new Idea(newUser).save();
    req.flash('success_msg', 'Videa added');
    res.redirect('/ideas');
  }

});

// Edit Form process
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id });
  idea.title = req.body.title;
  idea.details = req.body.details;
  await idea.save();
  req.flash('success_msg', 'Videa Idea Edited');
  res.redirect('/ideas');
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  await Idea.remove({ _id: req.params.id });
  req.flash('success_msg', 'Videa Idea Removed');
  res.redirect('/ideas');
});

module.exports = router;
