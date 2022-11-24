const passport = require('passport');
const { Strategy: NaverStrategy , Profile: NaverProfile } = require('passport-naver-v2');

const User = require('../models/user');

module.exports = () => {
    passport.use(new NaverStrategy({
        clientID : process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_Secret,
        callbackURL: `/auth/naver/callback`,
    }, async(acessToken, refreshToken, profile, done) =>{
        console.log('naver profile : ', profile);
        try {
            const exUser = await User.findOne({
                where : { snsId : profile.id, provider: 'naver' },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile.email,
                    nick: profile.name,
                    snsId: profile.id,
                    provider : 'naver',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};