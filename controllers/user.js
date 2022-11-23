const User = require("../models/user");

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