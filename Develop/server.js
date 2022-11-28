const express = require('express');
const path = require('path');

const PORT = 3001; 

const app = express();

// middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// returns the index.html file
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// returns the notes.html file
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));