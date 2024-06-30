const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const PORT = 3000;
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour expiration time
}));
app.use(express.static(path.join(__dirname, 'public')));

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String // Note: In production, use bcrypt to hash passwords
});

const User = mongoose.model('User', userSchema);

// Middleware

// Route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/finddoc2.html', (req, res) => {
  res.sendFile(path.join(__dirname + '/finddoc2.html'));
});
app.get('/mentalhealth2.html',(req,res)=>{
  res.sendFile(path.join(__dirname + '/mentalhealth2.html'))
});
app.get('/stories.html',(req,res)=>{
  res.sendFile(path.join(__dirname + '/stories.html'))
});
// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      // Set session data
      req.session.username = username;
      res.send('Login successful');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
