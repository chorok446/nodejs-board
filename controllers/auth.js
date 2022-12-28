const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");





exports.withDraw = async(req, res, next) => {
    const id = req.user.id;
    try {
        const exUser = await User.findOne({ where: { id } });
        if (!exUser){
            return res.redirect('/')
        }
        await User.destroy({where: {id}});
        return res.redirect('/');
    } catch (error){
        console.error(error);
        return next(error);
    }
}

exports.Login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
}

exports.Logout = (req, res, next) => {
    req.logout(() => {
        try {
            res.redirect('/');
            req.session.destroy();
        } catch (error) {
            console.error(error);
            next(error);
        }
    })
}

exports.Join = async (req, res, next) => {
    console.log(req.body)
    const { email, nick, password, } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
            profile: req.body.url,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}