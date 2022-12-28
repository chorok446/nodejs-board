const express = require("express");

const { isLoggedIn, isNotLoggedIn} = require('../middlewares');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const {addFollowing, deleteFollowing, userEdit, AfterUploadProfile, profileEdit, AfterEditedProfile} = require("../controllers/user");
const multer = require("multer");
const path = require("path");
const {uploadPost} = require("../controllers/post");
const upload2 = multer();

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'profiles/');
        },
        filename(req, file, cb) {
            // const ext = path.extname(file.originalname);
            cb(null,new Date().valueOf() + path.extname(file.originalname));
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일사이즈 5mb 해상도 및  제한
});




/* 팔로잉 기능 */
router.post('/:id/follow', isLoggedIn, addFollowing );

/* 팔로잉 끊기 기능 */
router.post('/:id/unfollow', isLoggedIn, deleteFollowing);

/* 닉네임, 비밀번호 수정*/
router.post('/edit', isLoggedIn, upload2.none(),userEdit);

/* 아바타 업로드 */
router.post('/upload/profile', isNotLoggedIn, upload.single('avata'), AfterUploadProfile);


/* 프로필 수정*/
router.post('/edit/profile', isLoggedIn, upload.single('avata-edit'), AfterEditedProfile);




module.exports = router;