const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'Username',
                passwordField: 'Password',
            },
            async (username, password, callback) => {
                console.log(`${username} ${password}`);
                await Users.findOne({ Username: username})
                .then((user) =>{
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: "Hey, we don't recognize that Username, pleace check your spelling and try again.",
                        });
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                })
            }
        )
    );

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Truth-Justice-Freedom-ReasonablyPricedLove-HardBoiledEgg'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));