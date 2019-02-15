var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test123@ds139331.mlab.com:39331/manumits');

var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	level:Number
})
userSchema.methods.checkUser=function(username,cb){
    return this.model('User').find({ username: username }, cb);
}
var User = mongoose.model('users',userSchema);
module.exports = User;