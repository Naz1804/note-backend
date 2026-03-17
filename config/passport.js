const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const pool = require('./db')


passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
            let user = result.rows[0];

            if (user) {
                return done(null, user);
            }

            const email = profile.emails[0].value;
            result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            user = result.rows[0];

            if (user) {
                result = await pool.query('UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *', [profile.id, user.id]);
                user = result.rows[0];
                return done(null, user);
            }

            result = await pool.query('INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *', [profile.id, email]);
            user = result.rows[0];

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport;
