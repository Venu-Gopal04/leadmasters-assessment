const router = require('express').Router();
const Task = require('../models/Task');
const verify = require('./verifyToken');

// 1. GET ALL TASKS
router.get('/', verify, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id || req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE TASK (Debug Version)
router.post('/', verify, async (req, res) => {
    // DEBUG: Print the User info we got from the token
    console.log("Token Data (req.user):", req.user);

    // Try to find the ID in two different places
    const userId = req.user._id || req.user.id;

    if (!userId) {
        console.log("ERROR: User ID is missing!");
        return res.status(400).json({ message: "User ID missing. Please Logout and Login again." });
    }

    const taskData = {
        userId: userId, // Use the ID we found
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority || 'Medium',
        status: 'Todo'
    };

    if (req.body.dueDate && req.body.dueDate !== "") {
        taskData.dueDate = req.body.dueDate;
    }

    const task = new Task(taskData);

    try {
        const savedTask = await task.save();
        console.log("SUCCESS: Task Saved!", savedTask);
        res.json(savedTask);
    } catch (err) {
        console.error("SAVE FAILED:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// 3. UPDATE TASK
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. DELETE TASK
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedTask = await Task.findByIdAndDelete(req.params.id);
        res.json(removedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;