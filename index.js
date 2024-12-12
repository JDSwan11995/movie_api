const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    app = express(),
   accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

app.get('/arbitrary', (req, res) => {
    res.send('This is a test page');
});

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies:[],
    },
    {
        id: 2,
        name: "Jess",
        favoriteMovies:["My Neighbor Totoro"],
    },
]

let ghibliMovies = [
    {
        'Title': 'My Neighbor Totoro', 
        'Description': 'Young sisters, Satsuki and Mei, move to the countryside with their father to be near their ailing mother, they soon meet the friendly and curious spirits of the forest.',
        'Genres': {
            'Name': 'Fantasy',
            'Description': 'In film, the fantasy genre transports audiences to worlds where magic, mythical creatures and epic adventures intertwine with universal themes of heroism, discovery, and wonder.'
        },
        'Year': '1988', 
        'Director': {
            'Name': 'Hayao Miyazaki',
            'Bio': '',
            'Birth': 'January 5, 1941',
        }, 
        'RottenTomatoesRating': '94%'
    },
    {
        'Title': 'Grave of the Fireflies', 
        'Description':'',
        'Genres': {
            'Name': '',
            'Description': '',
        },
        'Year': '1988', 
        'Director': {
            'Name': 'Isao Takahata',
            'Bio': '',
            'Birth': 'October 29, 1935',
            'Death': 'April 5, 2018',
        }, 
        'RottenTomatoesRating': '100%'
    },
    {
        'Title': 'Ocean Waves', 
        'Description':'',
        'Genres': {
            'Name': 'Fantasy',
            'Description': '',
        },
        'Year': '1993', 
        'Director': {
            'Name': 'Tomomi Mochizuki',
            'Bio': '',
            'Birth': 'Defcember 31, 1958',
        },
        'RottenTomatoesRating': '89%'
    },
    {
        'Title': 'Spirited Away', 
        'Description':'',
        'Genres': {
            'Name': '',
            'Description': '',
        },
        'Year':'2001', 
        'Director': {
            'Name': 'Hayao Miyazaki',
            'Bio': '',
            'Birth': 'January 5, 1941',
        }, 
        'RottenTomatoesRating': '96%'
    },
    {
        'Title': 'Tales from Earthsea', 
        'Description':'',
        'Genres': {
            'Name': '',
            'Description': '',
        },
        'Year': '2006', 
        'Director': {
            'Name': 'Goro Miyazaki',
            'Bio': '',
            'Birth': 'January 21, 1967',
        },
        'RottenTomatoesRating': '38%'
    },
    {
        'Title': 'Arrietty', 
        'Description':'',
        'Genres': {
            'Name': '',
            'Description': '',
        },
        'Year': '2010', 
        'Director': {
            'Name': 'Hiromasa Yonebayashi',
            'Bio': '',
            'Birth': 'July 10, 1973',
        }, 
        'RottenTomatoesRating': '94%'
    },
    {
        'Title': 'The Red Turtle', 
        'Description':'',
        'Genres': {
            'Name': '',
            'Description': '',
        },
        'Year': '2016', 
        'Director': {
            'Name': 'Michaël Dudok de Wit',
            'Bio': '',
            'Birth': 'July 15, 1953',
        }, 
        'RottenTomatoesRating': '93%'
    },
]

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('You seem to have forgotten the name, we kind of need those')
    }
});

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find (user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400). send("Couldn't find you, is your ID spelled correctly?")
    }
});

//POST
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find (user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s favorite movie array`);
    } else {
        res.status(400). send("Couldn't find you, is your ID spelled correctly?")
    }
});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find (user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s favorite movie array`);
    } else {
        res.status(400). send("Couldn't find you, is your ID spelled correctly?")
    }
});

//DELETE
app.delete('/users/:id', (req, res) => {
    const { id} = req.params;

    let user = users.find (user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User ${user.name} has been deleted`);
    } else {
        res.status(400). send("Couldn't find you, is your ID spelled correctly?")
    }
});

//READ
app.get('/movies', (req, res) => {
    res.status(200).json(ghibliMovies)
});

//READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = ghibliMovies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie)
    } else {
        res.status(400).send("Sorry, couldn't find that movie!")
    }
});

//READ
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = ghibliMovies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre)
    } else {
        res.status(400).send("Sorry, couldn't find that genre!")
    }
});

//READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = ghibliMovies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director)
    } else {
        res.status(400).send("Sorry, couldn't find that one!")
    }
});

app.use(express.static('public'));

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Oops, something broke on our end! No worries, our team of highly trained orangutans are on the job!");
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
})