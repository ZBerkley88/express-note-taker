const express = require('express');
const path = require('path');
const database = require('./db/db.json');
const fs = require('fs');
// helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;
var cors = require('cors');

const app = express();

// middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));

// returns the index.html file
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// returns the notes.html file
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// returns all saved notes as JSON
app.get('/api/notes', (req, res) => {

    fs.readFile("./db/db.json", function (err, text) {
        const dbData = JSON.parse(text);
        res.json(dbData);

    // log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
    });
});

app.get("/notes/:id", (req, res) => {
    console.log('log req params', req.params.id);
    res.json(database[req.params.id]);
});



// POST request
app.post('/api/notes', (req, res) => {
    // let the client know that their POST request was received
    console.info(`${req.method} request received to add a note`);

    // destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // if all the required properties are present
    if (title && text) {
        // variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // convert string into JSON object
                const parsedNotes = JSON.parse(data);
  
                // add a new note
                parsedNotes.push(newNote);

                // write updated notes back to the file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes!')
                );
            }
        });


        const response = {
            status: 'success',
            body: newNote,
        };
      
        console.log(response);
        res.status(201).json(response);

    } else {
    res.status(500).json('Error in posting note');
    }
});




// delete notes
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const dbData = JSON.parse(data);

        const newData = dbData.filter((database) => database.id !== req.params.id);
        fs.writeFile('./db/db.json', JSON.stringify(newData), (err) => {
            if (err) console.error(err);
            res.json(newData);

        })
    })
});     




app.listen(PORT, () => console.log(`App listening on port ${PORT}`));