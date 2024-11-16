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
    res.json([
        {title: 'Nausicaä of the Valley of the Wind', year: '1984', director: 'Hayao Miyazaki'}, 
        {title: 'Castle in the Sky', year:'1986', director: 'Hayao Miyazaki'},
        {title: 'My Neighbor Totoro', year: '1988', director: 'Hayao Miyazaki'},
        {title: 'Grave of the Fireflies', year: '1988', director: 'Isao Takahata'},
        {title: "Kiki's Delivery Service", year: '1989', director: 'Hayao Miyazaki'},
        {title: 'Only Yesterday', year: '1991', director: 'Isao Takahata'},
        {title: 'Porco Rosso', year: '1992', director: 'Hayao Miyazaki'},
        {title: 'Ocean Waves', year: '1993', director: 'Tomomi Mochizuki'},
        {title: 'Pom Poko', year: '1994', director: 'Isao Takahata'},
        {title: 'Whisper of the Heart', year: '1995', director: 'Yoshifumi Kondō'},
        {title: 'Princess Mononoke', year: '1997', director: 'Hayao Miyazaki'},
        {title: 'My Neighbors the Yamadas', year:'1999', director:'Isao Takahta'},
        {title: 'Spirited Away', year:'2001', director:'Hayao Miyazaki'},
        {title: 'The Cat Returns', year: '2002', director: 'Hiroyuki Morita'},
        {title: "Howl's Moving Castle", year:'2004', director:'Hayao Miyazaki'},
        {title: 'Tales from Earthsea', year: '2006', director: 'Goro Miyazaki'},
        {title: 'Ponyo', year: '2008', director:'Hayao Miyazaki'},
        {title: 'Arrietty', year: '2010', director:'Hiromasa Yonebayashi'},
        {title: 'From Up on Poppy Hill', year:'2011', director:'Goro Miyazaki'},
        {title: 'The Wind Rises', year: '2013', director: 'Hayao Miyazaki'},
        {title: 'The Tale of Princess Kaguya', year: '2013', director: ' Isao Takahata'},
        {title: 'When Marnie Was There', year:'2014', director: 'Hiromasa Yonebayashi'},
        {title: 'The Red Turtle', year: '2016', director: 'Michaël Dudok de Wit'},
        {title: ' Earwig and the Witch', year: '2020', director: 'Goro Miyazaki'},
        {title: 'The Boy and the Heron', year:'2023', director:'Hayao Miyazaki'}
    ])
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