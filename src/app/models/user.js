const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: false,
  },
  celular: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  isProfessional: {
    type: Boolean,
    required: false,
    select: false,
  },
  status: {
    type: Boolean,
    required: false,
    select: false,
  },
  confirmationCode: {
    type: String,
    require: false
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  const hashGerada = makeid();
  const hashCriptograda = await bcrypt.hash(hashGerada, 10);

  this.confirmationCode = hashCriptograda;

  next();
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 30; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
