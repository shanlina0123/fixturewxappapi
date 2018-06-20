/**
 * 小程序配置文件
 */
//var host = "fixture.yygsoft.com/api"
var host = "http://z.com/api"
var config = {
  /**
   * 公用
   */
  //图片地址
  imgUrl: `http://z.com/uploads/`,
  //临时图片地址
  tempUrl: `http://z.com/temp/`,
  //用code换取openId
  openIdUrl: `${host}/user/openid`,
  //用户登陆
  loginUrl: `${host}/user/login`,
  //修改用户图像
  setUserInfo: `${host}/user/set-user`,
  //首页动态数据
  Index: `${host}/client/dynamic-list`,
  //动态删除
  dynamicDestroy: `${host}/client/dynamic-destroy`,
  //图片上传
  imgUpload:`${host}/img/upload`,
  //删除临时图片
  imgDel: `${host}/img/del`,
  /**
   * C端
   */
  //免费量房、快速报价
  free: `${host}/client/appointment`,
  //项目列表
  project: `${host}/client/follow-record`,
  //我的装修
  invitation: `${host}/client/site-invitation`,
  //活动列表
  active: `${host}/client/activity-inrecord`,
  //活动详情
  activeInfo: `${host}/client/activity-info/`,
  //点赞
  fabulous: `${host}/client/dynamic-fabulous`,
  //评论
  commentAdd: `${host}/client/dynamic-comment-add`,
  //删除评论
  commentDestroy: `${host}/client/dynamic-comment-destroy`,
  //问题反馈
  qaFeedback: `${host}/qa/feedback`, 
  //公司介绍
  companyInfo: `${host}/client/company-info`, 
  //中将记录
  luckyRecord: `${host}/client/lucky-record`, 
  //项目详情
  siteInfo: `${host}/site/info`, 
  //项目详情动态
  siteDynamic: `${host}/site/dynamic`, 
  //消息
  logNotice:`${host}/log/notice`,
  //读取消息
  readNotice:`${host}/log/read-notice`,
  //关注工地
  recordSite:`${host}/client/record-site`,
  //抽奖
  luckyInfo: `${host}/lucky/info`,
  //中奖记录
  myLuck: `${host}/lucky/my-luck`,
  //去抽奖
  luckyDraw:`${host}/lucky/draw`,
  luckyCient: `${host}/lucky/client`,
  /**
   * B端
   */
  //工地列表
  siteList: `${host}/site/site-list`,
  //更新进度
  siteRenew: `${host}/site/renew`,
  //更新进度信息
  siteRenewInfo: `${host}/site/renew-info`,
};
module.exports = config
