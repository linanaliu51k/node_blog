let express = require('express');
let path = require('path');
let index = require('./routes/index');
let user = require('./routes/user');
let article = require('./routes/article');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash');
let app = express();
//设置public为静态文件服务器
app.use(express.static(path.resolve('public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
let url = require('./config').url;
app.use(session({
    resave: true,
    saveUninitialized: true,
    // cookie: {maxAge: 1000*10},
    secret: 'zfpx',
    store: new MongoStore({
        url: url
    })
}));
//会有req.flash.可以读写消息
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    res.locals.user = req.session.user;
    res.locals.keyword = '';
    next();
});
//引入模板
app.set('views',path.resolve('views'));
app.set('view engine','html');
app.engine('html',require('ejs').__express);
app.use('/', index);
app.use('/user', user);
app.use('/article', article);
app.listen(8888);
