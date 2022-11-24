const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();


try {
    fs.readdirSync('profiles');
} catch (error) {
    console.error('profiles 폴더가 없어 profiles 폴더를 생성합니다.');
    fs.mkdirSync('profiles');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'profiles/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});


router.post('/avata', isNotLoggedIn, upload.single('avata'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/avata/${req.file.filename}` });
});

router.post('/avata-edit', isLoggedIn, upload.single('avata-edit'), (req, res) => {
    res.json({ url: `/avata/${req.file.filename}` });
});

const upload2 = multer();
router.post('/join', isNotLoggedIn, upload2.none(), async (req, res, next) => {
    const { email, nick, password, } = req.body;
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
            profile: req.body.url,
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
                nick: nick,
                password: hash,
            }, {where: {id}});
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/editavata', isLoggedIn, async(req, res, next) => {
    const id = req.user.id
    try {
        await User.update({
            profile: req.body.url,
        }, {where: { id }});
        return res.redirect('/')
    } catch (error) {
        console.error(error);
        next(error);
    }
})

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




const logout = router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(() => {
        try {
            res.redirect('/');
            req.session.destroy();
        } catch (error) {
            console.error(error);
            next(error);
        }
    })
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // 프로파일과 이메일 정보를 받는다.

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
    res.redirect('/');
});

module.exports = router;