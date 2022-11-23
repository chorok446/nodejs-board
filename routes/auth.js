const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const {Posts, User} = require('../models/');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});







router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});


router.post('/edit', isLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    const id = req.user.id
    try {
        const hash = await bcrypt.hash(password, 12);
        await User.update({
            email: email,
            nick: nick,
            password: hash,
        }, {where : {id} });
        return res.redirect('/auth/logout');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/withdraw', isLoggedIn, async(req, res, next) => {
    const id = req.user.id;
    try {
        const exUser = await User.findOne({ where: { id } });
        if (!exUser){
            return res.redirect('/')
        }
        await User.destroy({where: {id}});
        return res.redirect('/');
    } catch (error){
        console.error(error);
        return next(error);
    }
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(req.user, error => {
        if(error) return next(error);
        req.session.destroy();
        res.redirect('/auth/logout');
    });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;