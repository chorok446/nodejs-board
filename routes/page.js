const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { Post, User, Hashtag, Comment } = require('../models');
const {renderMain,renderMypage,renderJoin,renderProfileEdit,renderEditUser, renderHashtag } = require('../controllers/page');
const router = express.Router();



router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});


/* 마이페이지 */
router.get('/mypage', isLoggedIn, renderMypage);

/* 회원가입 페이지 */
router.get('/join', isNotLoggedIn, renderJoin);

/* 닉네임, 비밀번호 변경페이지 */
router.get('/edit', isLoggedIn, renderEditUser);

/* 프로필 이미지 수정 */
router.get('/avata', isLoggedIn, renderProfileEdit);

/* 메인 페이지*/
router.get('/', renderMain);

/* 해쉬태그 검색기능 */
router.get('/hashtag', renderHashtag);



module.exports = router;