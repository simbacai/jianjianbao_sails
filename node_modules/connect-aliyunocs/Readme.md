# Connect Aliyun OCS 

connect-aliyunocs is a Aliyun OCS(http://ocs.aliyun.com) session store backed by [aliyun-sdk-js](https://github.com/aliyun-UED/aliyun-sdk-js.git)

## Installation

	  $ npm install connect-aliyunocs

## Options
  
  - `client` An existing Aliyun OCS client object you normally get from `ALY.memcached.createClient()`
  - `host` Aliyun OCS server internal network IP
  - `ocsKey` Aliyun OCS server account
  - `ocsSecret` Aliyun OCS server passwd
  - `prefix` Key prefix defaulting to "sess:"
  - `ttl` Aliyun OCS session TTL in seconds

## Usage

    var session = require('express-session');
    var aliyunocsStore= require('connect-aliyunocs')(connect);

    app.use(session({ store: new aliyunocsStore(options), secret: 'keyboard cat' }))
 
# License

  MIT
