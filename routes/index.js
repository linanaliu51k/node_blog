let express = require('express');
let Article = require('../model').Article;
let router = express.Router();
router.get('/', function (req, res) {
    let pageNum = isNaN(req.query.pageNum) ? 1 : parseInt(req.query.pageNum);
    let pageSize = isNaN(req.query.pageSize) ? 1 : parseInt(req.query.pageSize);
    let query = {};
    let keyword = req.query.keyword;
    if (keyword) {
        query.title = new RegExp(keyword);
    }
    Article.count(query, function (err, count) {//统计记录数
        Article.find(query).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function (err, articles) {
            res.render('index/index', {
                title: '首页',
                articles,
                keyword,
                pageNum,
                pageSize,
                totalPages: Math.ceil(count/pageSize)
            });
        });
    });
});
module.exports = router;