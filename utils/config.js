/**
 * 小程序配置文件
 */
//var host = "https://fixture.yygsoft.com/api"
var host = "http://z.com/api"
var config = {
  /**
   * 公用
   */
  //图片地址
  //imgUrl: `http://z.com/uploads/`,
  imgUrl: `https://fixture.yygsoft.com/uploads/`,
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
  //地图周边
  mapAddress: `${host}/map/address`,
  //搜索地址
  mapSeachAddress: `${host}/map/seach-address`,
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
  //新建工地
  siteStore:`${host}/site/store`,
  //门店列表
  storeList:`${host}/store/store-list`,
  //新建工地默认模板
  defaultTemplate:`${host}/template/default-template`,
  //模板列表
  templateList: `${host}/template/template-list`,
  //设置默认
  templateSet:`${host}/template/template-set`,
  //删除工地
  siteDestroy: `${host}/site/site-destroy`,
  //工地公开
  siteIsOpen:`${host}/site/is-open`,
  //工地完工
  siteIsFinish:`${host}/site/is-finish`,
  //工地编辑数据
  siteEdit: `${host}/site/edit`,
  //工地修改保存
  siteUpdate: `${host}/site/update`,
  //工地检索列表
  searchSiteList: `${host}/site/search-site-list`,
  //修改动态
  dynamicUp: `${host}/client/dynamic-up`,
  //客户列表
  clientList: `${host}/client/client-list`,
  //成员管理
  participantList: `${host}/participant/participant-list`,
  //职位列表
  positionList:`${host}/participant/position-list`,
  //邀请微码
  positionCode:`${host}/participant/position-code`,
  //添加成员
  participantSave: `${host}/participant/participant-save`,
  //删除成员
  participantDel: `${host}/participant/participant-del`,
  //参与者店铺列表
  storeInvitation: `${host}/store/invitation-list`,
  //参与者切换门店
  storeInvitationstoreup: `${host}/dd store/invitation-storeup`,
 

  /**
   * 极光
   */
  jmessageInit:`${host}/jmessage/init`,
  //注册
  jmessageRegister: `${host}/jmessage/register`,
  //好友列表
  jmessageFriendList: `${host}/jmessage/friend-list`,
  //添加好友
  jmessageFriendAdd: `${host}/jmessage/friend-add`,  
  jmessageUseInfo: `${host}/jmessage/user-info`, 
  jmessageFace:`${host}/jmessage/user-face`, 
};
module.exports = config
