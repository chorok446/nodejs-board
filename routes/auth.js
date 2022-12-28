const express = require('express');
const passport = require('passport');
const multer = require('multer');
const upload = multer();


const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {Join, Login, withDraw, Logout} = require('../controllers/auth')
const User = require('../models/user');
const router = express.Router();




/* 회원가입 */
router.post('/join',  isNotLoggedIn,upload.none(), Join);

/* 로그인 */
router.post('/login', isNotLoggedIn, Login);


/* 회원 탈퇴*/
router.post('/withdraw', isLoggedIn, withDraw)

/* 로그아웃  */
router.get('/logout', isLoggedIn, Logout);


/* 소셜 로그인 */

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