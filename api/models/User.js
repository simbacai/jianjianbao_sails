// api/models/User.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * For example:
   *
   * foo: function (bar) {
   *   bar.x = 1;
   *   bar.y = 2;
   *   return _super.foo(bar);
   * }
   */
  
  attributes: {
    openid: {
      type: 'string',
      unique: true,
      index: true,
      notNull: true
    },
    nickname: {
      type: 'string',
    },
    sex: {
      type: 'string',
    },
    province: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    headimgurl: {
      type: 'string',
    },
    privilege: {
      type: 'string',
    },
    unionid: {
      type: 'string',
    },

    toJSON: function () {
      var user = this.toObject();
      delete user.password;
      delete user.gravatarUrl;
      return user;
    }
  },


  beforeCreate: function (user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.openid;
    }
    next();
  },

  afterCreate: [
    function attachLocalPassPort(user, next) {
      //For non-admin user, add 1 more local passport to the user for testing convenience
      if (user.username != "admin") {
        sails.models.passport.create({
          protocol : 'local'
        , password : 'testjj123'
        , user     : user.id
        }, function (err, passport) {
          if (err) {
            if (err.code === 'E_VALIDATION') {
              err = new Error('Error.Passport.Password.Invalid');
            }
            
            return user.destroy(function (destroyErr) {
              next(destroyErr || err);
            });
          }

          next();
        });
      } else {
        next();
      }
    },
    function setOwner (user, next) {
      sails.log('User.afterCreate.setOwner', user);
      User
        .update({ id: user.id }, { owner: user.id })
        .then(function (user) {
          next();
        })
        .catch(next);
    },
    function attachDefaultRole (user, next) {
      Promise.bind({ }, User.findOne(user.id)
        .populate('roles')
        .then(function (user) {
          this.user = user;
          return Role.findOne({ name: 'registered' });
        })
        .then(function (role) {
          this.user.roles.add(role.id);
          return this.user.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registered" attached to user', this.user.username);
          next();
        })
        .catch(next)
      );
    }
  ]
});
