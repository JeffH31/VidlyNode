const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());

app.use(logger);

app.use(function(req, res, next) {
    console.log('Authenticating...');
    next();
});

const genres = [
    { id:1, name: 'Action' },
    { id:2, name: 'Horror' },
    { id:3, name: 'Comedy' },
    { id:4, name: 'Drama' },
    { id:5, name: 'SciFi' }
];

//get all genre
app.get('/api/courses/', (req, res) => {
    res.send(genres);
});

//get single genre
app.get('/api/courses/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The course with that ID was not found.');

    res.send(genre);
});

//create genre
app.post('/api/genres/', (req, res) => { 
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

//update genre
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with that ID was not found.');

    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error);

    genre.name = req.body.name;
    res.send(genre);
});

//delete genre
app.delete('/api/genre/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with that ID was not found.');

    const index = genres.indexOf(genre);
    genre.splice(index, 1);

    res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required();
    };
    return Joi.validate(genre, schema);
}