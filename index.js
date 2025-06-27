const express = require("express"),
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

console.log(
  "[DEBUG] Movie model is using collection: ",
  Movies.collection.name
);

const CONNECTION_URI = process.env.CONNECTION_URI;

mongoose
  .connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the MongoDB Database."))
  .catch((err) => console.error("Connection Error", err));

mongoose.connection.on("connected", () => {
  console.log(
    "[DEBUG] Connected to MongoDB Database: ",
    mongoose.connection.name
  );
});

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
);

require("./passport");

let auth = require("./auth")(app);

const { check, validationResult } = require("express-validator");

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
    check("Username", "Username is too short").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    //Checking for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
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
                _id: user._id,
                Name: user.Name,
                Username: user.Username,
                Email: user.Email,
                Birthday: user.Birthday,
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
  }
);

//GET ALL USERS
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
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
  }
);

//GET A USER BY USERNAME
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
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
  }
);

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
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send("You don't have permission for this.");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) },
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
  }
);

//REMOVE FAVORITE MOVIE
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send("You don't have permission for this.");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) },
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
  }
);

//DELETE USER
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
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
  }
);

//READ ALL MOVIES
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const ghibliMovies = await Movies.find();
      console.log("[MOVIES] Found: ", ghibliMovies.length, "movies");
      res.status(200).json(ghibliMovies);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

//READ MOVIE BY TITLE
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .then((ghibliMovies) => {
        res.status(200).json(ghibliMovies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//READ GENRE BY NAME
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "genre.name": req.params.genreName })
      .then((ghibliMovies) => {
        res.status(200).json(ghibliMovies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//READ DIRECTOR BY NAME
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Director.Name": req.params.directorName })
  .then((ghibliMovies) => {
    res.status(200).json(ghibliMovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
  }
);

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
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port " + port);
});
