const express = require('express');
const { notes } = require('./db/db');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

//parse icnoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

// This part is used to get the user input and put it in the correct spot for notes
function noteParts(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(notes => notes.title === query.title);
    }
    return filteredResults;
}

// This will create a new note when the user starts typing in something. 
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return body;
}

function deleteNote(index, notesArray) {
    notesArray.splice(index, 1);
}

function validateNotes(query) {
    if(!query.title || typeof query.title !== 'string') {
        return false;
    }
    if(!query.text || typeof query.text !== 'string') {
        return false;
    }
    return true;
}

// This api route pulls the information from the noteParts function. 
app.get('/api/notes', (req, res) => {
    let results = notes;
    if(req.query) {
        results = noteParts(req.query, results);
    }
    res.json(results);
});

// This will redirect the user to the home page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/js/index.js'));
});

app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/css/styles.css'));
});

// This will redirect the user to the notes page.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    if (!validateNotes(req.body)) {
        res.status(400).send('This note is not properly formatted.');
    } else {
        let noteArray = notes;
        noteArray = createNewNote(req.body, noteArray);
        res.json(noteArray);
    }
});

app.delete(`/api/notes/:id`, (req, res) => {
   deleteNote(req.params.id, notes);
   res.send();
});




app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

