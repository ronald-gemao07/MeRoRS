
var path = require('path')
  , rootPath = path.normalize(__dirname + '/')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  production: {
    db: 'mongodb://merors_admin:gznet123@dharma.mongohq.com:10013/app19603913',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Global Zeal Meeting Reservation System'
    }
  },
  development: {
    db: 'mongodb://localhost/merors',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Global Zeal Meeting Reservation System'
    }
  },
  test: {
    db: 'mongodb://localhost/merors_test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Global Zeal Meeting Reservation System'
    }
  }
}
