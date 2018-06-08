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
   //修改用户图像
  setUserInfo: `https://${host}/user/set-user`,
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
  //公司介绍
  companyInfo: `https://${host}/client/company-info`, 
  //中将记录
  luckyRecord: `https://${host}/client/lucky-record`, 
  //项目详情
  siteInfo: `https://${host}/site/info`, 
  //项目详情动态
  siteDynamic: `https://${host}/site/dynamic`, 
  //消息
  logNotice:`https://${host}/log/notice`,
  //读取消息
  readNotice:`https://${host}/log/read-notice`,
  //关注工地
  recordSite:`https://${host}/client/record-site`,
  //抽奖
  luckyInfo: `https://${host}/lucky/info`,
  //中奖记录
  myLuck: `https://${host}/lucky/my-luck`,
  //去抽奖
  luckyDraw:`https://${host}/lucky/draw`,
};
module.exports = config
