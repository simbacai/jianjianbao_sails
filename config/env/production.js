/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var fs = require('fs');

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

   models: {
     connection: 'aliyunRDSMysqlServer',
     migrate: 'safe'
   },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  log: {
   level: "info"
  },

  session: {
  adapter: 'connect-aliyunocs',
  host:'10.159.72.1',
  ocsKey: 'eb6c04f97e4a4dab',
  ocsSecret: 'JianJian123'
  },

  wxpay: {
    wxpayconfig: {
      appid: 'wxcd3e2f8024ba7f49',
      mch_id: '1247772901',
      partner_key: 'JianJian35398841JianJian35398841', 
      pfx: fs.readFileSync('./apiclient_cert.p12'), 
    },
    unifiedOrderConfig: {
      notify_url: 'http://www.jianjianbao.cn/pay/wxpaynotify',
      spbill_create_ip: '121.41.75.11'
    }
  }
};
