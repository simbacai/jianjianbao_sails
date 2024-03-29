/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
   connection: 'test',
   migrate: 'alter'
  },

  port:1337,

  log: {
   level: "silly"
  },

  session: {
  adapter: 'memory',
  },

  wxpay: {
    wxpayconfig: {
      appid: '',
      mch_id: '',
      partner_key: '', 
      pfx: '', 
    },
    unifiedOrderConfig: {
      notify_url: '',
      spbill_create_ip: ''
    }
  },

  redpack: {
    mch_id: '',
    partner_key: '',
    pfx: '',
    wxappid: '',
    send_name: '',
    nick_name: '',
    client_ip: '',
    total_num: null,
    remark: '',
    wishing: ''
  }
};
