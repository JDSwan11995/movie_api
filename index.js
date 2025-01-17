const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  app = express(),
  accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
  });

app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(express.static("public"));

//ENTRY PAGE
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

//TEST PAGES
app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});
app.get("/arbitrary", (req, res) => {
  res.send("This is a test page");
});

let users = [
  {
    _id: ObjectId("6781ac2c2e224354ef4eeb86"),
    Name: "Gytha Ogg",
    Username: "NannyDearest",
    Birthday: "1968-10-05",
    Email: "motherknowsbest@clacksmail.gnu",
    Password: "Hedgeh0gsNeverBuggered!",
  }, //Gytha Ogg
  {
    _id: ObjectId("6781ac712e224354ef4eeb87"),
    Name: "Esmerelda Weatherwax",
    Username: "dont-call-me-crone",
    Birthday: "1948-04-28",
    Email: "goodbycircumstance@clacksmail.gnu",
    Password: "Good8ntNice",
  }, //Esmerelda Weatherwax
  {
    _id: ObjectId("6781acaa2e224354ef4eeb88"),
    Name: "Magrat Garlick",
    Username: "QueenofLancre",
    Birthday: "1988-11-10",
    Email: "queenoflancre@clacksmail.gnu",
    Password: "M@idenNoMore",
  }, //Magrat Garlick
  {
    _id: ObjectId("6781acd22e224354ef4eeb89"),
    Name: "Agnes Nitt",
    Username: "PerditaXDream",
    Birthday: "1992-01-01",
    Email: "OperaWitch@clacksmail.gnu",
    Password: "moonlit-nitt",
  }, //Agnes Nitt
  {
    _id: ObjectId("6781acfd2e224354ef4eeb8a"),
    Name: "Tiffany Aching",
    Username: "Tir-far-thoinn",
    Birthday: "2003-05-01",
    Email: "land-under-wave@clacksmail.gnu",
    Password: "TheChalkWitch!",
  }, //Tiffany Aching
  {
    _id: ObjectId("6781b82e2e224354ef4eeb8b"),
    Name: "Gwinifer Blackcap",
    Username: "Old-M0ther",
    Birthday: "1967-09-30",
    Email: "pig-borer-of-sidling@clacksmail.gnu",
    Password: "Cow-shouting-4-dummies",
  }, //Gwinifer Blackcap
];

let directors = [
  {
    _id: ObjectId("6781bca42e224354ef4eeb8e"),
    Name: "Hayao Miyazaki",
    Bio: "A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.",
    Birthday: "1941-01-05",
  }, //Hayao Miyazaki
  {
    _id: ObjectId("6781bbc12e224354ef4eeb8d"),
    Name: "Isao Takahata",
    Bio: "A visionary animator, director and co-founder of Studio Ghibli, known for his emotionally profound and visually unique films.",
    Birthday: "1935-10-29",
    Deathday: "2018-04-05",
  }, //Isao Takahata
  {
    _id: ObjectId("678ab7448bc250d8044eeb86"),
    Name: "Tomomi Mochizuki",
    Bio: "An anime director and storyteller known for his nuanced storytelling and ability to explore the subtleties of human relationships.",
    Birthday: "1958-12-31",
  }, //Tomomi Mochizuki
  {
    _id: ObjectId("678ab7a38bc250d8044eeb87"),
    Name: "Goro Miyazaki",
    Bio: "A director who has carved his own path in storytelling, blending imaginative worlds with thoughtful character development while carrying forward a legacy of artistic creativity.",
    Birthday: "1967-01-21",
  }, //Goro Miyazaki
  {
    _id: ObjectId("678ab7e78bc250d8044eeb88"),
    Name: "Hiromasa Yonebayashi",
    Bio: "An animator and director known for his evocative storytelling, intricate visual style, and ability to capture the wonder of childhood and imagination.",
    Birthday: "1973-07-10",
  }, //Hiromasa Yonebayashi
  {
    _id: ObjectId("678ab8688bc250d8044eeb89"),
    Name: "Michaël Dudok de Wit",
    Bio: "An animator, director, and artist celebrated for his distinctive, emotionally resonant animation style that blends simplicity with profound storytelling.",
    Birth: "1953-07-15",
  }, //Michaël Dudok de Wit
  {
    _id: ObjectId("678ab8788bc250d8044eeb8a"),
    Name: "Hiroyuki Morita",
    Bio: "An animator and director known for his meticulous craftsmanship ans ability to infuse hearfelt emotion into his storytelling.",
    Birth: "1964-06-26",
  }, //Hiroyuki Morita
  {
    _id: ObjectId("678ab88c8bc250d8044eeb8b"),
    Name: "Yoshifumi Kondō",
    Bio: "A talented animator and director celebrated for his exceptional attention to detail and his vital contributions to the art of animation.",
    Birth: "1950-03-31",
    Death: "1998-01-21",
  }, //Yoshifumi Kondō
];

let ghibliMovies = [
  {
    _id: ObjectId("678008608cad0cb2374eeb86"),
    Title: "My Neighbor Totoro",
    Description:
      "Young sisters, Satsuki and Mei, move to the countryside with their father to be near their ailing mother, they soon meet the friendly and curious spirits of the forest.",
    Genre: {
      Name: "Fantasy",
      Description:
        "The fantasy genre features imaginative and often magical worlds, characters, and events.",
    }, //Fantasy
    ReleaseDate: "April 16, 1988",
    Director: {
      Name: "Hayao Miyazaki",
      Bio: "A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.",
      Birth: "January 5, 1941",
    }, //Hayao Miyazaki
    RottenTomatoesRating: "94%",
    ImagePath: "totoro.png",
    Featured: true,
    Actors: ["Chika Sakamoto", "Noriko Hidaka", "Hitoshi Takagi"],
  }, //My Neighbor Totoro
  {
    _id: ObjectId("678abf30b2f9ef89bc4eeb86"),
    Title: "Grave of the Fireflies",
    Description:
      "A poignant animated film about two siblings struggling to survive in wartime Japan.",
    Genre: {
      Name: "Period Drama",
      Description:
        "The period drama transports audiences to the past, immersing them in insights and offering insight into the lives of characters from different time periods.",
    }, //Period Drama
    ReleaseDate: "April 16, 1988",
    Director: {
      Name: "Isao Takahata",
      Bio: "A visionary animator, director and co-founder of Studio Ghibli, known for his emotionally profound and visually unique films.",
      Birthday: "1935-10-29",
      Deathday: "2018-04-05",
    }, //Isao Takahata
    RottenTomatoesRating: "100%",
    ImagePath: "fireflies.png",
    Featured: false,
    Actors: [],
  }, //Grave of the Fireflies
  {
    _id: ObjectId("678abf91b2f9ef89bc4eeb87"),
    Title: "Ocean Waves",
    Description:
      "A reflective coming-of-age story about friendship, love, and the complexities of adolecent emotions in a small coastal town.",
    Genre: {
      Name: "Romance",
      Description:
        "The romance genre features the theme of romantic relationships and emotional connections between characters.",
    }, //Romance
    ReleaseDate: "May 5, 1993",
    Director: {
      Name: "Tomomi Mochizuki",
      Bio: "An anime director and storyteller known for his nuanced storytelling and ability to explore the subtleties of human relationships.",
      Birth: "December 31, 1958",
    }, //Tomomi Mochizuki
    RottenTomatoesRating: "89%",
    ImagePath: "oceanwaves.png",
    Featured: false,
    Actors: [],
  }, //Ocean Waves
  {
    _id: ObjectId("678abfc1b2f9ef89bc4eeb88"),
    Title: "Spirited Away",
    Description:
      "A mesmerizing tale of a young girl who finds herself in a mysterious world of spirits and must navigate its wonders and challenges to find her way home.",
    Genre: {
      Name: "Fairy Tale",
      Description:
        "The fairy tale subgenre features narratives featuring magical and fantastical elements, often focusing on themes of morality, wonder, and the triumph of good over evil.",
    }, //Fairy Tale
    ReleaseDate: "July 20, 2001",
    Director: {
      Name: "Hayao Miyazaki",
      Bio: "A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.",
      Birth: "January 5, 1941",
    }, //Hayao Miyazaki
    RottenTomatoesRating: "96%",
    ImagePath: "spiritedaway.png",
    Featured: false,
    Actors: [],
  }, //Spirited Away
  {
    _id: ObjectId("678abff0b2f9ef89bc4eeb89"),
    Title: "Tales from Earthsea",
    Description:
      "Based on the tales from Ursala K LeGuin, Tales from Earthsea is a mystical journey through a world of dragons and wizards, where a young prince and a wandering mage must confront a looming imbalance threatening their land.",
    Genre: {
      Name: "Adventure",
      Description:
        "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal.",
    }, //Adventure
    ReleaseDate: "July 29, 2006",
    Director: {
      Name: "Goro Miyazaki",
      Bio: "A director who has carved his own path in storytelling, blending imaginative worlds with thoughtful character development while carrying forward a legacy of artistic creativity.",
      Birth: "January 21, 1967",
    }, //Goro Miyazaki
    RottenTomatoesRating: "38%",
    ImagePath: "earthsea.png",
    Featured: false,
    Actors: [],
  }, //Tales from Earthsea
  {
    _id: ObjectId("678ac00cb2f9ef89bc4eeb8a"),
    Title: "Arrietty",
    Description:
      "Based on The Borrowers by Mary Norton, Arrietty is a gentle story apout a tiny, resourceful girl from a family of 'borrowers' who forges an unlikely friendship with a human boy, changing both of their worlds.",
    Genre: {
      Name: "Family",
      Description:
        "The family genre features stories specifically created to be suitable for a wide range of age groups within a family.",
    }, //Family
    ReleaseDate: "July 17, 2010",
    Director: {
      Name: "Hiromasa Yonebayashi",
      Bio: "An animator and director known for his evocative storytelling, intricate visual style, and ability to capture the wonder of childhood and imagination.",
      Birth: "July 10, 1973",
    }, //Hiromasa Yonebayashi
    RottenTomatoesRating: "",
    ImagePath: "arrietty.png",
    Featured: false,
    Actors: [],
  }, //Arrietty
  {
    _id: ObjectId("678ac02bb2f9ef89bc4eeb8b"),
    Title: "The Red Turtle",
    Description:
      "A wordless meditative tale about a man's life on a deserted island and the profound connection he forms with nature.",
    Genre: {
      Name: "Drama",
      Description:
        "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way.",
    }, //Drama
    ReleaseDate: "May 18, 2016",
    Director: {
      Name: "Michaël Dudok de Wit",
      Bio: "An animator, director, and artist celebrated for his distinctive, emotionally resonant animation style that blends simplicity with profound storytelling.",
      Birth: "July 15, 1953",
    }, //Michaël Dudok de Wit
    RottenTomatoesRating: "93%",
    ImagePath: "redturtle.png",
    Featured: false,
    Actors: [],
  }, //The Red Turtle
  {
    _id: ObjectId("678ac04cb2f9ef89bc4eeb8c"),
    Title: "The Cat Returns",
    Description:
      "A whimsical tale about a girl who finds herself drawn into a fantastical world where she must navigate twists to rediscover her true self.",
    Genre: {
      Name: "Fairy Tale",
      Description:
        "The fairy tale subgenre features narratives featuring magical and fantastical elements, often focusing on themes of morality, wonder, and the triumph of good over evil.",
    }, //Fairy Tale
    ReleaseDate: "July 20, 2002",
    Director: {
      Name: "Hiroyuki Morita",
      Bio: "An animator and director known for his meticulous craftsmanship ans ability to infuse hearfelt emotion into his storytelling.",
      Birth: "June 26, 1964",
    }, //Hiroyuki Morita
    RottenTomatoesRating: "88%",
    ImagePath: "catreturns.png",
    Featured: false,
    Actors: [],
  }, //The Cat Returns
  {
    _id: ObjectId("678ac084b2f9ef89bc4eeb8d"),
    Title: "Howl's Moving Castle",
    Description:
      "Based on the story by Diana Wynne Jones, Howl's Moving Castle is a magical tale of self-discovery and resilience, set in a world of shifting landscapes, mysterious magic users, and unexpected transformations.",
    Genre: {
      Name: "Adventure",
      Description:
        "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal.",
    }, //Adventure
    ReleaseDate: "September 5, 2004",
    Director: {
      Name: "Hayao Miyazaki",
      Bio: "A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.",
      Birth: "January 5, 1941",
    }, //Hayao Miyazaki
    RottenTomatoesRating: "88%",
    ImagePath: "castle.png",
    Featured: false,
    Actors: [],
  }, //Howl's Moving Castle
  {
    _id: ObjectId("6781bafe2e224354ef4eeb8c"),
    Title: "Only Yesterday",
    Description:
      "A reflective tale about a woman revisiting her childhood memories during a trip to the countryside.",
    Genre: {
      Name: "Coming-of-Age",
      Description:
        "The coming-of-age subgenre features personal growth, maturation, and self-discovery of a young protagonist as they navigate the challenges and transitions of adolescence into adulthood.",
    }, //Coming-of-Age
    ReleaseDate: "July 20, 1991",
    Director: {
      Name: "Isao Takahata",
      Bio: "A visionary animator, director and co-founder of Studio Ghibli, known for his emotionally profound and visually unique films.",
      Birthday: "1935-10-29",
      Deathday: "2018-04-05",
    }, //Isao Takahata
    RottenTomatoesRating: "95%",
    ImagePath: "yesterday.png",
    Featured: false,
    Actors: [],
  }, //Only Yesterday
  {
    _id: ObjectId("678ac2a3b2f9ef89bc4eeb8e"),
    Title: "Whisper of the Heart",
    Description:
      "A heartfelt coming-of-age story about a young girl discovering her creativity and the courage to pursue her dreams.",
    Genre: {
      Name: "Coming-of-Age",
      Description:
        "The coming-of-age subgenre features personal growth, maturation, and self-discovery of a young protagonist as they navigate the challenges and transitions of adolescence into adulthood.",
    }, //Coming-of-Age
    ReleaseDate: "July 15, 1995",
    Director: {
      Name: "Yoshifumi Kondō",
      Bio: "A talented animator and director celebrated for his exceptional attention to detail and his vital contributions to the art of animation.",
      Birth: "March 31, 1950",
      Death: "January 21, 1998",
    }, //Yoshifumi Kondō
    RottenTomatoesRating: "100%",
    ImagePath: "yesterday.png",
    Featured: false,
    Actors: [],
  }, //Whisper of the Heart
];

let genres = [
  {
    _id: ObjectId("678ac6c5b2f9ef89bc4eeb8f"),
    Name: "Coming-of-Age",
    Description:
      "The coming-of-age subgenre features personal growth, maturation, and self-discovery of a young protagonist as they navigate the challenges and transitions of adolescence into adulthood.",
  }, //Coming-of-Age
  {
    _id: ObjectId("678ac6d6b2f9ef89bc4eeb90"),
    Name: "Adventure",
    Description:
      "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal.",
  }, //Adventure
  {
    _id: ObjectId("678ac6e4b2f9ef89bc4eeb91"),
    Name: "Fairy Tale",
    Description:
      "The fairy tale subgenre features narratives featuring magical and fantastical elements, often focusing on themes of morality, wonder, and the triumph of good over evil.",
  }, //Fairy Tale
  {
    _id: ObjectId("678ac6f2b2f9ef89bc4eeb92"),
    Name: "Drama",
    Description:
      "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way.",
  }, //Drama
  {
    _id: ObjectId("678ac70cb2f9ef89bc4eeb94"),
    Name: "Family",
    Description:
      "The family genre features stories specifically created to be suitable for a wide range of age groups within a family.",
  }, //Family
  {
    _id: ObjectId("678ac6fdb2f9ef89bc4eeb93"),
    Name: "Romance",
    Description:
      "The romance genre features the theme of romantic relationships and emotional connections between characters.",
  }, //Romance
  {
    _id: ObjectId("678ac731b2f9ef89bc4eeb95"),
    Name: "Period Drama",
    Description:
      "The period drama transports audiences to the past, immersing them in insights and offering insight into the lives of characters from different time periods.",
  }, //Period Drama
  {
    _id: ObjectId("678ac741b2f9ef89bc4eeb96"),
    Name: "Fantasy",
    Description:
      "The fantasy genre features imaginative and often magical worlds, characters, and events.",
  }, //Fantasy
];

//CREATE USER
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res
      .status(400)
      .send("You seem to have forgotten the name, we kind of need those");
  }
});

//UPDATE USERNAME
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("Couldn't find you, is your ID spelled correctly?");
  }
});

//POST-ADD FAVORITE MOVIE
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(
        `${movieTitle} has been added to ${user.name}'s favorite movie array`
      );
  } else {
    res.status(400).send("Couldn't find you, is your ID spelled correctly?");
  }
});

//DELETE-REMOVE FAVORITE MOVIE
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(
        `${movieTitle} has been removed from ${user.name}'s favorite movie array`
      );
  } else {
    res.status(400).send("Couldn't find you, is your ID spelled correctly?");
  }
});

//DELETE USER
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${user.name} has been deleted`);
  } else {
    res.status(400).send("Couldn't find you, is your ID spelled correctly?");
  }
});

//READ ALL MOVIES
app.get("/movies", (req, res) => {
  res.status(200).json(ghibliMovies);
});

//READ MOVIE BY TITLE
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = ghibliMovies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Sorry, couldn't find that movie!");
  }
});

//READ GENRE BY NAME
app.get("/movies/genres/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = ghibliMovies.find(
    (movie) => movie.Genre.Name === genreName
  ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Sorry, couldn't find that genre!");
  }
});

//READ DIRECTOR BY NAME
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = ghibliMovies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Sorry, couldn't find that one!");
  }
});

//ERROR 500 MESSAGE
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "Oops, something broke on our end! No worries, our team of highly trained orangutans are on the job!"
    );
});

//PORT OF CALL
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
