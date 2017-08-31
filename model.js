let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
let url = require('./config').url;
mongoose.connect(url);
//定义模型骨架
let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String
}, {collection: 'user'});
//定义模型
exports.User = mongoose.model('User', UserSchema);

let ArticleSchema = new mongoose.Schema({
    title: String,
    content: String,
    createAt: {type: Date, default: Date.now},
    user: {type: ObjectId, ref: 'User'}//ref 引用,表示自己是一个外键, 引用的是User集合的主键
});
exports.Article = mongoose.model('Article', ArticleSchema);