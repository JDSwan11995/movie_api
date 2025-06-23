const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User;
(JWTStrategy = passportJWT.Strategy), 
(ExtractJWT = passportJWT.ExtractJwt);

console.log("Loading passport config...");

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
        console.log('[PASSPORT] LocalStrategy started:', {username});
      try {
        const user = Users.findOne({ Username: username });
        if (!user) {
          console.warn("[PASSPORT] No user with the username: ",username);
          return callback(null, false, {
            message:
              "Hey, we don't recognize that Username, pleace check your spelling and try again.",
          });
        }
        if (!user.validatePassword(password)) {
          console.warn("{PASSPORT] Incorrect password for:", username);
          return callback(null, false, {
            message: "Check the spelling, something is incorrect.",
          });
        }
        console.log("[PASSPORT] User validated: ", username);
        return callback(null, user);
      } catch (error) {
        console.error("[PASSPORT] Error during authentication:", error);
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, callback) => {
      try {
        const user = await Users.findById(jwtPayload._id);
        if (!user) {
          return callback(null, false, { message: "User not found" });
        }
        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);