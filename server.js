const express = require('express');
const path = require('path');
const fs = require('fs');

// Dependencies
let jdb = require("./db/db.json");
 

const PORT = process.env.PORT || 3001;
const app = express();

const rawData = fs.readFileSync ('./db/db.json');
const dbName = JSON.parse(rawData);
 
app.use(express.json());
// tell express to use the public directory 
app.use(express.static('public'));

// routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html' ))
})

// create notes
const addNewJSON = (item, res) => {
    let temp = dbName; 
    let newNote = {};
    newNote.id = Date.now();
    newNote.title = item.title;
    newNote.text = item.text;
    temp.push (newNote);
    temp = JSON.stringify(temp);
    res.json(fs.writeFile('./db/db.json', temp, err => console.log(err)))
}

// add a delete function, 
// app.delete('/api/assets/notes/:id', (req, res) => {
    app.delete('/api/notes/:id', (req, res) => {
    const sql = `DELETE FROM notes WHERE id = ?`;
    const params = [req.params.id];
  
    dbName.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Note not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });


// API route to get notes from database
app.get('/api/notes', (req, res) => res.json (dbName) )

app.post('/api/notes', (req, res) => addNewJSON(req.body,res));

// add a delete api route, app.delete deleteJSON  function is name of the delete function 

app.delete('/api/notes/:id', (req, res) => deleteJSON(req,res));


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});