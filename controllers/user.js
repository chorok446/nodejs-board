const User = require("../models/user");
const fs = require("fs");
const bcrypt = require("bcrypt");

try {
    fs.readdirSync('profiles');
} catch (error) {
    console.error('profiles 폴더가 없어 profiles 폴더를 생성합니다.');
    fs.mkdirSync('profiles');
}


exports.addFollowing = async(req, res, next ) => {
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('팔로우 성공');
        } else {
            res.status(404).send('유저가 없습니다.');
        }
    }catch (error){
        console.error(error);
        next(error);
    }
}

exports.deleteFollowing =  async (req, res, next) => {
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
}

exports.userEdit = async (req, res, next) => {
    const { nick, password } = req.body;
    const id = req.user.id
    try {
        if (req.user.provider === 'local') {
            const hash = await bcrypt.hash(password, 12);
            await User.update({
                nick: nick,
                password: hash,
                profile: req.body.url,
            }, {where: {id}});
        } else {
            res.locals.message = '로컬계정이 아니면 비밀번호 변경이 불가능합니다.';
            await User.update({
                nick: nick,
            }, {where: {id}});
        }
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.AfterUploadProfile = (req, res, next) => {
    console.log(req.file);
    res.json({url: `/profiles/${req.file.filename}`});
    global.edit = `/profiles/${req.file.filename}`;
}

exports.AfterEditedProfile = (req, res, next) => {
    console.log(req.file);
    res.json({url: `/profiles/${req.file.filename}`});
    global.edit = `/profiles/${req.file.filename}`;
}

exports.profileEdit = async(req, res, next) => {
        try {
            console.log(`userid: ${req.user.id}`);
            console.log(`edit, type : ${typeof(edit)}, value: ${edit}`);
            const id = req.user.id
            await User.update({
                profile: edit,
            }, {where: { id }});
            return res.redirect('/')
        } catch (error) {
            console.error(error);
            next(error);
        }
}