const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser');
    //methodOverride = require('method-overide');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

app.get('/arbitrary', (req, res) => {
    res.send('This is a test page');
});

app.get('/movies', (req, res) => {
    res.json([{title: 'Movie1'}, {title: 'Movie2'}])
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Oops, something broke! No worries, our team of highly trained orangutans are on the job!");
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
})