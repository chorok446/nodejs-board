const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');
const {where} = require("sequelize");

const router = express.Router();



router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});


router.get('/mypage', isLoggedIn, (req, res) => {
    res.render('mypage', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/edit', isLoggedIn, async(req, res, next) => {
    try {
        exUser = await User.findOne({where: req.user.id});
        if(exUser.provider === "local"){
            res.render('edit', { title : ' 프로필수정'});
        } else {
            return res.redirect(`/?loginError=소셜계정은 정보변경이 불가능합니다.`);
        }
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.get('/avata', isLoggedIn, async(req, res, next) => {
    res.render('avata', {title: '프로필사진 변경 - NodeBird'})
})


router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick', 'profile'],
            },
            order: [['createdAt', 'DESC']],
        });
        if(req.user){
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
            });
        } else {
            res.render('main', {
                title: 'NodeBird',
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});



module.exports = router;