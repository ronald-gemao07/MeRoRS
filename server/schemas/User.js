var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var _ = require('underscore')
var crypto = require('crypto');

var UserSchema = new Schema( {
      email: { type: String, default: '' },
  	  hashed_password: { type: String, default: '' },
  	  firstName: { type: String, default: '' },
  	  lastName: { type: String, default: '' },
  	  salt: { type: String, default: '' }
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password });


 /**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// Hashed password
UserSchema.path('hashed_password').validate(function (hashed_password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return hashed_password.length
}, 'Password cannot be blank')

// Check email
UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  
  var User = mongoose.model('User')
  
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) fn(true)

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.hashed_password)
    && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid hashed_password'))
  else
    next()
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the hashed_passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt hashed_password
   *
   * @param {String} hashed_password
   * @return {String}
   * @api public
   */

  encryptPassword: function (hashed_password) {
    if (!hashed_password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(hashed_password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}

module.exports = mongoose.model( 'User', UserSchema );
