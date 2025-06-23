const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = new mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birthday: Date,
        Deathday: Date,
    },
    RottenTomatoesRating: String,
    ImagePath: String,
    Featured: Boolean,
    Actors: [String],
}, {collection: "movies"});

let userSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
}, {collection: "users"});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

userSchema.methods.toJSON = function() {
    const obj =this.toObject();
    delete obj.Password;
    return obj;
};

let Movie = mongoose.model('Movie', movieSchema, 'movies');
let User = mongoose.model('User', userSchema, 'users');

module.exports.Movie = Movie;
module.exports.User = User;