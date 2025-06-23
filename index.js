const 
  express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  cors = require("cors"),
  passport = require("passport"),
  app = express(),
  accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
  });

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

const CONNECTION_URI = process.env.CONNECTION_URI

mongoose
  .connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology:true})
  .then(() => console.log("Connected to the MongoDB Database."))
  .catch((err) => console.error("Connection Error", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to the MongoDB database.");
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));


//let allowedOrigins = ["http://localhost:8080", "http://testsite.com", "https://ghibliheroku-f28bf5d9329a.herokuapp.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
)


require("./passport");

let auth = require("./auth")(app);

const {check, validationResult} = require('express-validator');

//ENTRY PAGE
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

//DOCUMENTATION PAGE
app.get("/docs", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//TEST PAGES
app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});
app.get("/arbitrary", (req, res) => {
  res.send("This is a test page");
});

//ASSETS
let users = [
  {
    _id: "678aee6449361c6d08cb0cf5",
    Name: "Gytha Ogg",
    Username: "NannyDearest",
    Birthday: "1968-10-05",
    Email: "motherknowsbest@clacksmail.gnu",
    Password: "Hedgeh0gsNeverBuggered!",
  }, //Gytha Ogg
  {
    _id: "678aee6749361c6d08cb0cf6",
    Name: "Esmerelda Weatherwax",
    Username: "dont-call-me-crone",
    Birthday: "1948-04-28",
    Email: "goodbycircumstance@clacksmail.gnu",
    Password: "Good8ntNice",
  }, //Esmerelda Weatherwax
  {
    _id: "678aee6a49361c6d08cb0cf7",
    Name: "Magrat Garlick",
    Username: "QueenofLancre",
    Birthday: "1988-11-10",
    Email: "queenoflancre@clacksmail.gnu",
    Password: "M@idenNoMore",
  }, //Magrat Garlick
  {
    _id: "678aee6e49361c6d08cb0cf8",
    Name: "Agnes Nitt",
    Username: "PerditaXDream",
    Birthday: "1992-01-01",
    Email: "OperaWitch@clacksmail.gnu",
    Password: "moonlit-nitt",
  }, //Agnes Nitt
  {
    _id: "678aee7149361c6d08cb0cf9",
    Name: "Tiffany Aching",
    Username: "Tir-far-thoinn",
    Birthday: "2003-05-01",
    Email: "land-under-wave@clacksmail.gnu",
    Password: "TheChalkWitch!",
  }, //Tiffany Aching
  {
    _id: "678aee7449361c6d08cb0cfa",
    Name: "Gwinifer Blackcap",
    Username: "Old-M0ther",
    Birthday: "1967-09-30",
    Email: "pig-borer-of-sidling@clacksmail.gnu",
    Password: "Cow-shouting-4-dummies",
  }, //Gwinifer Blackcap
  {
    _id: "67ddedcefac61d7b3dac2c68",
    Name: "Eskarina Smith",
    Username: "Esk-The_Female_Wizard",
    Birthday: "1979-08-03",
    Password: "I'll-do-both!",
    Email: "dualmagic@clacksmail.gnu",
  }, //Eskarina Smith
  {
    _id:"68488126e38af59e02fc274c",
    Name: "Adora Belle Dearheart",
    Username: "A.B.Dearheart",
    Birthday: "1982-11-05",
    Password: "Moist-Is-An-Idiot",
    Email: "GolumTrustAdmin@clacksmail.gnu",
  },//Adora Belle Dearheart
  {
    _id:"6848843b7936719cdcfec33d",
    Name:"Moist Von Lipwig",
    Username:"Golden_Suit",
    Password: "Trust-Me!",
    Birthday: "1980-06-15",
    Email: "MoistVonLipwig@clacksmail.gnu",
  },//Moist Von Lipwig
];
let directors = [
  {
    _id: "678aeb2b49361c6d08cb0ce2",
    Name: "Hayao Miyazaki",
    Bio: "A legendary Japanese animator, director, and co-founder of Studio Ghibli, known for creating imaginative and heartfelt films.",
    Birthday: "1941-01-05",
  }, //Hayao Miyazaki
  {
    _id: "678aeb3549361c6d08cb0ce3",
    Name: "Isao Takahata",
    Bio: "A visionary animator, director and co-founder of Studio Ghibli, known for his emotionally profound and visually unique films.",
    Birthday: "1935-10-29",
    Deathday: "2018-04-05",
  }, //Isao Takahata
  {
    _id: "678aeb3849361c6d08cb0ce4",
    Name: "Tomomi Mochizuki",
    Bio: "An anime director and storyteller known for his nuanced storytelling and ability to explore the subtleties of human relationships.",
    Birthday: "1958-12-31",
  }, //Tomomi Mochizuki
  {
    _id: "678aeb3f49361c6d08cb0ce5",
    Name: "Goro Miyazaki",
    Bio: "A director who has carved his own path in storytelling, blending imaginative worlds with thoughtful character development while carrying forward a legacy of artistic creativity.",
    Birthday: "1967-01-21",
  }, //Goro Miyazaki
  {
    _id: "678aeb4749361c6d08cb0ce6",
    Name: "Hiromasa Yonebayashi",
    Bio: "An animator and director known for his evocative storytelling, intricate visual style, and ability to capture the wonder of childhood and imagination.",
    Birthday: "1973-07-10",
  }, //Hiromasa Yonebayashi
  {
    _id: "678aeb4b49361c6d08cb0ce7",
    Name: "Michaël Dudok de Wit",
    Bio: "An animator, director, and artist celebrated for his distinctive, emotionally resonant animation style that blends simplicity with profound storytelling.",
    Birth: "1953-07-15",
  }, //Michaël Dudok de Wit
  {
    _id: "678aeb4e49361c6d08cb0ce8",
    Name: "Hiroyuki Morita",
    Bio: "An animator and director known for his meticulous craftsmanship ans ability to infuse hearfelt emotion into his storytelling.",
    Birth: "1964-06-26",
  }, //Hiroyuki Morita
  {
    _id: "678aeb5249361c6d08cb0ce9",
    Name: "Yoshifumi Kondō",
    Bio: "A talented animator and director celebrated for his exceptional attention to detail and his vital contributions to the art of animation.",
    Birth: "1950-03-31",
    Death: "1998-01-21",
  }, //Yoshifumi Kondō
];
let ghibliMovies = [
  {
    _id: "678aed2249361c6d08cb0cea",
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
    _id: "678aed2749361c6d08cb0ceb",
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
    _id: "678aed2b49361c6d08cb0cec",
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
    _id: "678aed2e49361c6d08cb0ced",
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
    _id: "678aed3149361c6d08cb0cee",
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
    _id: "678aed3649361c6d08cb0cef",
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
    _id: "678aed3c49361c6d08cb0cf0",
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
    _id: "678aed4049361c6d08cb0cf1",
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
    _id: "678aed4249361c6d08cb0cf2",
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
    _id: "678aed4649361c6d08cb0cf3",
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
    _id: "678aed4a49361c6d08cb0cf4",
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
    _id: "678aefbb49361c6d08cb0d02",
    Title: "Coming-of-Age",
    Description:
      "The coming-of-age subgenre features personal growth, maturation, and self-discovery of a young protagonist as they navigate the challenges and transitions of adolescence into adulthood.",
  }, //Coming-of-Age
  {
    _id: "678aefb849361c6d08cb0d01",
    Title: "Adventure",
    Description:
      "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal.",
  }, //Adventure
  {
    _id: "678aefb549361c6d08cb0d00",
    Title: "Fairy Tale",
    Description:
      "The fairy tale subgenre features narratives featuring magical and fantastical elements, often focusing on themes of morality, wonder, and the triumph of good over evil.",
  }, //Fairy Tale
  {
    _id: "678aefb349361c6d08cb0cff",
    Title: "Drama",
    Description:
      "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way.",
  }, //Drama
  {
    _id: "678aefaf49361c6d08cb0cfe",
    Title: "Family",
    Description:
      "The family genre features stories specifically created to be suitable for a wide range of age groups within a family.",
  }, //Family
  {
    _id: "678aefad49361c6d08cb0cfd",
    Title: "Romance",
    Description:
      "The romance genre features the theme of romantic relationships and emotional connections between characters.",
  }, //Romance
  {
    _id: "678aefaa49361c6d08cb0cfc",
    Title: "Period Drama",
    Description:
      "The period drama transports audiences to the past, immersing them in insights and offering insight into the lives of characters from different time periods.",
  }, //Period Drama
  {
    _id: "678aefa349361c6d08cb0cfb",
    Title: "Fantasy",
    Description:
      "The fantasy genre features imaginative and often magical worlds, characters, and events.",
  }, //Fantasy
];

//CREATE USER
/* Expected in JSON Format
{
 Name: String,
 Username: String,
 Email: String,
 Birthday: Date (yyyy-dd-mm)
}*/
app.post(
  "/users",
  //Validation logic here for request
  [
    check('Username', 'Username is too short').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ], 
  async (req, res) => {
    //Checking for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()});
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res
          .status(404)
          .send(
            req.body.Username +
              " Hey, there's someone that has that Username, please try something else."
          );
      } else {
        Users.create({
          Name: req.body.Name,
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json({
              _id:user._id,
              Name:user.Name,
              Username:user.Username,
              Email:user.Email,
              Birthday: user.Birthday
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//GET ALL USERS
app.get(
  "/users", 
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("You don't have permission for this");
    }
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET A USER BY USERNAME
app.get(
  "/users/:Username",
  passport.authenticate("jwt", {session: false}),
   async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("You do not have permission for this.");
    }
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//UPDATE USER
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    let hashedPassword = User.hashPassword(req.body.Password);
    // CONDITION ENDS
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Name: req.body.Name,
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//ADD FAVORITE MOVIE
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", {session:false}),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("You don't have permission for this.")
    }
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { favoriteMovies: req.params.MovieID },
    },
    { new: true }
  ) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//REMOVE FAVORITE MOVIE
app.delete(
  "/users/:Username/:MovieID",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("You don't have permission for this.");
    }
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { favoriteMovies: req.params.MovieID },
    },
    { new: true }
  ) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//DELETE USER
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", {session: false}),
   async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("You don't have permission for this.");
    }
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .send("That user, " + req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ ALL MOVIES
app.get(
  "/movies",
  async (req, res) => {
    await Movies.find()
      .then((ghibliMovies) => {
        res.status(201).json(ghibliMovies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//READ MOVIE BY TITLE
app.get(
  "/movies/:title", 
  passport.authenticate("jwt",{session:false}),
  async (req, res) => {
  await Movie.findOne({title: req.params.title})
  .then((ghibliMovies) => {
    res.status(200).json(ghibliMovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ GENRE BY NAME
app.get("/movies/genres/:genreName", 
  passport.authenticate("jwt", {session:false}),
  async (req, res) => {
    await Movie.find({"genre.name": req.params.genreName})
    .then((ghibliMovies) => {
      res.status(200).json(ghibliMovies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " +err);
    });
  });

//READ DIRECTOR BY NAME
app.get(
  "/movies/directors/:directorName", 
passport.authenticate("jwt", {session:false}),
async (req, res) => {
  await Models.Movie.find({"director.name": req.params.directorName})
  .then((ghibliMovies) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log("Your app is listening on port " + port);
});

