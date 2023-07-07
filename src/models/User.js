const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  civility: Number,
  firstName: {type: String, required: true},
  lastName: String,
  avatar: String,
  email: {type: String, required: true},
  password: {type: String, required: true},
  favorites: [{type: mongoose.Types.ObjectId, ref: 'Sport'}],
  company: {type: mongoose.Types.ObjectId, ref: 'Company', default: null},
  partner: {type: mongoose.Types.ObjectId, ref: 'Partner', default: null},
  programs: [{type: mongoose.Types.ObjectId, ref: 'Program'}],
  programsToDeliver: [{type: mongoose.Types.ObjectId, ref: 'Program'}],
  contacts: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  notifications: [{type: mongoose.Types.ObjectId, ref: 'Notification'}],
  createdAt: {type: Date, default: Date.now},
  comments: {type: [{type: mongoose.Types.ObjectId, ref: 'Comment'}], default: undefined},
  history: [{title: String, createdAt: {type: Date, default: Date.now}}],
  sports: [{type: mongoose.Types.ObjectId, ref: 'Sport'}],
  role: {type: Number, default: 3} // rôle 1: Administrateur, rôle 2: Coach, rôle 3: Utilisateur
});

UserSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 8);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    "secret"
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  };
};

module.exports = mongoose.model('User', UserSchema);
