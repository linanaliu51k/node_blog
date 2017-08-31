let express = require('express');
let router = express.Router();
let {checkLogin} = require('../ware');
let Article = require('../model').Article;
router.get('/add', checkLogin, function (req, res) {
    res.render('article/add', {title: '发表文章', article: {}});
});
router.post('/add', checkLogin, function (req, res) {
    let article = req.body;
    article.user = req.session.user._id;
    Article.create(article, function (err, doc) {
        if (err) {
            req.flash('error', '文章发表失败');
            res.redirect('back');
        } else {
            req.flash('success', '文章发表成功');
            res.redirect('/');
        }
    });
});
router.get('/detail/:_id', function (req, res) {
    let _id = req.params._id;
    Article.findById(_id, function (err, article) {
        res.render('article/detail', {title: '文章详情', article});
    });
});
router.get('/delete/:_id', function (req, res) {
    let _id = req.params._id;
    Article.remove({_id}, function (err) {
        if (err) {
            req.flash('error', '删除文章失败');
            res.redirect('back');
        } else {
            req.flash('success', '删除文章成功');
            res.redirect('/');
        }
    });
});
router.get('/update/:_id', function (req, res) {
    let _id = req.params._id;
    Article.findById(_id, function (err, article) {
        res.render('article/add', {title: '修改文章', article});
    });
});
router.post('/update/:_id', function (req, res) {
    let _id = req.params._id;
    let article = req.body;
    Article.update({_id}, article, function (err, doc) {
        if (err) {
            req.flash('error', '更新文章失败');
            res.redirect('back');
        } else {
            req.flash('success', '更新文章成功');
            res.redirect(`/article/detail/${_id}`);
        }
    });
});
module.exports = router;