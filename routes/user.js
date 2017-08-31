let express = require('express');
let router = express.Router();
let User = require('../model').User;
let multer = require('multer');
let {checkLogin, checkNotLogin} = require('../ware');
let upload = multer({dest: './public/uploads'});
router.get('/signup', checkNotLogin, function (req, res) {
    res.render('user/signup', {title: '用户注册'});
});
router.post('/signup', upload.single('avatar'), function (req, res) {
    let user = req.body;
    user.avatar = `/uploads/${req.file.filename}`;
    User.findOne({username: user.username}, function (err, oldUser){
        if (oldUser) {
            req.flash('error', '用户已经存在, 请换个用户名');
            res.redirect('back');
        } else {
            User.create(user, function (err, doc) {
                if (err) {
                    req.flash('error', err.toString());
                    res.redirect('back');
                } else {
                    req.flash('success', '恭喜你注册成功, 请登录');
                    res.redirect('/user/signin');
                }
            });
        }
    });
});
router.get('/signin', checkNotLogin, function (req, res) {
    // if (req.session.user) {
    //     res.redirect('/');
    // } else {
        res.render('user/signin', {title: '登录'});
    // }
});
router.post('/signin', function (req, res) {
    let user = req.body;
    User.findOne(user, function (err, doc) {
        if (err) {
            req.flash('error', err.toString());
            res.redirect('back');
        } else {
            if (doc) {
                req.flash('success', '恭喜你登录成功');
                req.session.user = doc;
                res.redirect('/');
            } else {
                req.flash('error', '很遗憾你登录失败');
                res.redirect('back');
            }
        }
    });
});
router.get('/signout', checkLogin, function (req, res) {
    req.session.user = null;
    res.redirect('/user/signin');
});
module.exports = router;