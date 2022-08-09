const express = require('express');
const { notes } = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

// This part is used to get the user input and put it in the correct spot for notes
function noteParts(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(notes => notes.title === query.title);
    }
    if (query.body) {
        filteredResults = filteredResults.filter(notes => notes.body === query.body);
    }
    if (query.id) {
        filteredResults = filteredResults.filter(notes => notes.id === query.id);
    }
    return filteredResults;
}

// This api route pulls the information from the noteParts function. 
app.get('/api/notes', (req, res) => {
    let results = notes;
    if(req.query) {
        results = noteParts(req.query, results);
    }
    
    res.json(results);
});
// const PORT = process.env.PORT || 3000;

app.listen(3001, () => {
    console.log(`API server now on port ${PORT}!`);
});

// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');
