const {Post, Comment, Hashtag} = require("../models");

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    try {
        console.log(req.user);
        console.log(req.user.id)
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.uploadComment = async(req, res, next) => {
    try{
        console.log(req.body)
        const comment = await Comment.create( {
            content: req.body.reply,
            twitId: req.body.twitid,
            UserId: req.user.id,
        })
        console.log(comment);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}


exports.deleteTwit = async(req, res, next) => {
    try {
        const twit = await Post.findOne({where: {id: req.params.twit}});
        if (twit) {
            await twit.destroy();
            res.send('success');
        } else {
            res.status(404).send('삭제하려는 글이 존재하지 않습니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}


exports.deleteComment = async(req, res, next) => {
    try {
        const comment = await Comment.findOne({where: {id: req.params.comment}});
        if (comment) {
            await comment.destroy();
            res.send('success');
        } else {
            res.status(404).send('삭제하려는 댓글이 존재하지 않습니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}