const express = require("express");
const Router = express.Router();
const Task = require("../models/task");
const auth = require("../routes/auth");

//GET TASKS
Router.get("/", auth, (req, res) => {
  Task.find({ user: req.user._id })
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(500).send(err.message));
});

// GET ONE TASK
Router.get("/:id", auth, (req, res) => {
  Task.findOne({ _id: req.params.id, user: req.user._id })
    .then((task) => {
      if (!task) return res.status(404).send("Task not found");
      res.json(task);
    })
    .catch((err) => res.status(400).send("Invalid ID"));
});

// CREATE NEW TASKS
Router.post("/", auth, (req, res) => {
  if (!req.body.title || req.body.title.length < 3) {
    return res
      .status(400)
      .send("Title is required and should be minimum 3 characters");
  }

  const task = new Task({
    todo: req.body.title,
    user: req.user._id, 
  });

  task
    .save()
    .then((saved) => res.status(201).json(saved))
    .catch((err) => res.status(400).send(err.message));
});

// UPDATE TASKS
Router.put("/:id", auth, (req, res) => {
  if (!req.body.title || req.body.title.length < 3) {
    return res
      .status(400)
      .send("Title is required and should be minimum 3 characters");
  }

  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { todo: req.body.title },
    { new: true }
  )
    .then((task) => {
      if (!task) return res.status(404).send("Task not found");
      res.json(task);
    })
    .catch((err) => res.status(400).send(err.message));
});

// DELETE TASKS
Router.delete("/:id", auth, (req, res) => {
  Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    .then((task) => {
      if (!task) return res.status(404).send("Task not found");
      res.json({ message: "Task deleted" });
    })
    .catch((err) => res.status(400).send(err.message));
});

module.exports = Router;
