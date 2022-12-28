const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { isLoggedIn } = require('../middlewares');
const {deleteTwit, uploadComment, uploadPost, deleteComment, afterUploadImage} = require("../controllers/post");
const router = express.Router();


try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');}


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const upload2 = multer();


/* 이미지 업로드*/
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

/* 글 작성 */
router.post('/', isLoggedIn, upload2.none(), uploadPost);

/* 댓글 작성 */
router.post('/comment', isLoggedIn, uploadComment)

/* 글 삭제 */
router.post(`/twit/:twit/delete`, isLoggedIn, deleteTwit )

/* 댓글 삭제*/
router.post(`/comment/:comment/delete`, isLoggedIn, deleteComment)





module.exports = router;