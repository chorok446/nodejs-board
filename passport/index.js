const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const google = require('./googleStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('serialize');
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('serialize');
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
    naver();
    google();
};