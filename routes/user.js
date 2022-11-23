const express = require("express");

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const {addFollowing} = require("../controllers/user");

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing );


/* 팔로잉 끊기 기능 */
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where: {id: req.params.id}});
        if (user) { //데이터베이스에서 찾은 사용자가 있다면
            await user.removeFollower(parseInt(req.user.id)); //팔로잉 끊기
            res.send('언팔로우 성공');
        } else {
            res.status(404).send('언팔로우 할려는 유저가 존재하지 않습니다');
        }
    }catch (error) {
            console.error(error);
            next(error);
    }
});





module.exports = router;