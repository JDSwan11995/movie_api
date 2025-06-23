const jwtSecret =  process.env.JWT_SECRET;

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/*POST login*/
module.exports = (router) => {
    router.post('/login', (req, res) => {
        console.log('[LOGIN] Login request received: ', req.body);
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                console.error("[LOGIN] Passport error: ", error);
                return res.status(400).json({
                    message: "Something's not right, check the entry and try again.",
                    user: user,
                });
            }

            console.log("[LOGIN] User authenticated: ", user.Username);

            req.login(user, {session: false}, (error) =>{
                if (error) {
                    console.error("[LOGIN] req.login() error:", error)
                    return res.status(500).json({message: "Login error", error});
                }
                const token = generateJWTToken(user.toJSON());
                console.log("[LOGIN] JWT Token Generated");
                return res.json({user, token});
            });
        })(req, res);
    });
};