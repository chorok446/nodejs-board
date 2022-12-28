const { Post, User, Hashtag, Comment } = require('../models');

exports.renderMypage = (req, res) => {
    res.render('mypage', { title: '내 정보 - NodeBird' });
}

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
}

exports.renderProfileEdit = async(req, res, next) => {
    res.render('avata', {title: '프로필사진 변경 - NodeBird'})
}

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({where: {title: query}});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({include: [{model: User}]});
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}


exports.renderEditUser = async(req, res, next) => {
    try {
       const exUser = await User.findOne({where: req.user.id});
        //if(exUser.provider === "local"){
        res.render('edit', { title : '프로필수정 - NodeBird'});
        //} else {
        //res.redirect('/avata');
        //}
    } catch (error) {
        console.error(error);
        next(error)
    }
}

exports.renderMain =  async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick', 'profile'],
            },
            order: [['createdAt', 'DESC']],
        });
        const comments = await Comment.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick', 'profile'],
            },
            order: [['createdAt', 'ASC']],
        });
        if(req.user){
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                replys: comments,
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
}

