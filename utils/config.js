/**
 * 小程序配置文件
 */
var host = "fixture.yygsoft.com/api"
var config = {
  //图片地址
    imgUrl:`https://fixture.yygsoft.com/uploads/`,
  //用code换取openId
  openIdUrl: `https://${host}/user/openid`,
  //用户登陆
  loginUrl: `https://${host}/user/login`,
  /**
   * C端
   */
  //首页
  cIndex: `https://${host}/client/dynamic-list`,
  //免费量房、快速报价
  free: `https://${host}/client/appointment`,
  //项目列表
  project: `https://${host}/client/follow-record`,
  //我的装修
  invitation: `https://${host}/client/site-invitation`,
  //活动列表
  active: `https://${host}/client/activity-inrecord`,
  //活动详情
  activeInfo: `https://${host}/client/activity-info/`,
  //点赞
  fabulous: `https://${host}/client/dynamic-fabulous`,
  //评论
  commentAdd: `https://${host}/client/dynamic-comment-add`,
  //删除评论
  commentDestroy: `https://${host}/client/dynamic-comment-destroy`,
  //问题反馈
  qaFeedback: `https://${host}/qa/feedback`, 
 
};
module.exports = config
