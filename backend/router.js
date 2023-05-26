const express = require('express');
const Task = require('./Schema');
const router = express.Router();
const User= require("./userschema")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.get('/get', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/add', async (req, res) => {
  const obj1 = new Task(req.body);
  try {
    await obj1.save();
    res.send(obj1);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/delete/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/update/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.send(updatedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

//////////////



router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ email }, 'shhh');

    // Return the registration success message and token
    res.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


///////////////
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user is not found, return an error message
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return an error message
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, 'shhh');

    // Return the login success message and token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
