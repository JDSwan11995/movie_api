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
        name: "Esmerelda Weatherwax",
        favoriteMovies:["Grave of the Fireflies"],
    },
    {
        id: 2,
        name: "Gytha Ogg",
        favoriteMovies:["My Neighbor Totoro",],
    },
    {
        id: 3,
        name: "Magrat Garlick",
        favoriteMovies: ["Spirited Away",],
    }
]

let ghibliMovies = [
    {
        'Title': 'My Neighbor Totoro', 
        'Description': 'Young sisters, Satsuki and Mei, move to the countryside with their father to be near their ailing mother, they soon meet the friendly and curious spirits of the forest.',
        'Genre': {
            'Name': 'Fantasy',
            'Description': 'The fantasy genre features imaginative and often magical worlds, characters, and events'
        },
        'Year': '1988', 
        'Director': {
            'Name': 'Hayao Miyazaki',
            'Bio': 'A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.',
            'Birth': 'January 5, 1941',
        }, 
        'RottenTomatoesRating': '94%'
    },
    {
        'Title': 'Grave of the Fireflies', 
        'Description':'A poignant animated film about two siblings struggling to survive in wartime Japan.',
        'Genre': {
            'Name': 'Period Drama',
            'Description': 'The period drama transports audiences to the past, immersing them in insights and offering insight into the lives of characters from different time periods.'},
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
        'Description':'A reflective coming-of-age story about friendship, love, and the complexities of adolecent emotions in a small coastal town.',
        'Genre': {
            'Name': 'Romance',
            'Description': 'The romance genre features the theme of romantic relationships and emotional connections between characters.'},
        'Year': '1993', 
        'Director': {
            'Name': 'Tomomi Mochizuki',
            'Bio': '',
            'Birth': 'December 31, 1958',
        },
        'RottenTomatoesRating': '89%'
    },
    {
        'Title': 'Spirited Away', 
        'Description':'A mesmerizing tale of a young girl who finds herself in a mysterious world of spirits and must navigate its wonders and challenges to find her way home.',
        'Genre': {
            'Name': 'Fairy Tale',
            'Description': 'The fairy tale subgenre features narratives featuring magical and fantastical elements, often focusing on themes of morality, wonder, and the triumph of good over evil.'
            },
        'Year':'2001', 
        'Director': {
            'Name': 'Hayao Miyazaki',
            'Bio': 'A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.',
            'Birth': 'January 5, 1941',
        }, 
        'RottenTomatoesRating': '96%'
    },
    {
        'Title': 'Tales from Earthsea', 
        'Description':'Based on the tales from Ursala K LeGuin, Tales from Earthsea is a mystical journey through a world of dragons and wizards, where a young prince and a wandering mage must confront a looming imbalance threatening their land.',
        'Genre': {
            'Name': 'Adventure',
            'Description': 'The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal.'
            },
        'Year': '2006', 
        'Director': {
            'Name': 'Goro Miyazaki',
            'Bio': 'A director who has carved his own path in storytelling, blending imaginative worlds with thoughtful character development while carrying forward a legacy of artistic creativity.',
            'Birth': 'January 21, 1967',
        },
        'RottenTomatoesRating': '38%'
    },
    {
        'Title': 'Arrietty', 
        'Description':'Based on The Borrowers by Mary Norton, Arrietty is a gentle story apout a tiny, resourceful girl from a family of "borrowers" who forges an unlikely friendship with a human boy, changing both of their worlds.',
        'Genre': {
            'Name': 'Family',
            'Description': 'The family genre features stories specifically created to be suitable for a wide range of age groups within a family.'
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
        'Description':'Based on The Borrowers by Mary Norton, Arrietty is a gentle story apout a tiny, resourceful girl from a family of "borrowers" who forges an unlikely friendship with a human boy, changing both of their worlds.',
        'Genre': {
            'Name': 'Drama',
            'Description': 'The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way.'
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