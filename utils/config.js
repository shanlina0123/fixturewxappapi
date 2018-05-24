/**
 * 小程序配置文件
 */
var host = "fixture.yygsoft.com/api"
var config = {
  //图片地址
  imgUrl:`https://${host}/upload/`,
  //用code换取openId
  openIdUrl: `https://${host}/user/openid`,
  //用户登陆
  loginUrl: `https://${host}/user/login`,
  /**
   * C端
   */
  //首页
  cIndex: `https://${host}/client/dynamic-list`,
   

};
module.exports = config
