// const baseUrl = "https://yanqiao2018.cn/bjyqwx";//云服务器Url
// const getFileUrl = "https://yanqiao2018.cn/bjyqfiles";//从服务器获取文件
// const getImageUrl = "https://yanqiao2018.cn/bjyqfiles";//从服务器获取图片
    // const baseUrl = "https://yanqiao2018.cn/bjyqwxtest";//云服务器Url
// const baseUrl = "http://localhost:33079/";
// const baseUrl = "http://k17154485y.imwork.net:23530/bjyqwx";//本地服务器Url
// const getImageUrl = "http://k17154485y.imwork.net:23530/bjyqImage";//从服务器获取图片
// const getFileUrl = "http://k17154485y.imwork.net:23530/bjyqwx/Files/GetFiles";//从服务器获取文件
const baseUrl = "http://k17154485y.imwork.net:23530/bjyqwx";//本地服务器Url
const getImageUrl = "http://k17154485y.imwork.net:23530/bjyqFile";//从服务器获取图片
const getFileUrl = "http://k17154485y.imwork.net:23530/bjyqwx/Files/";//从服务器获取文件
const setImageUrl = "http://k17154485y.imwork.net:23530/bjyqwx/Files";//从服务器获取文件
// const baseUrl = "http://192.168.1.106:8080/bjyqwx";//本地服务器Url
// const getImageUrl = "http://192.168.1.106:8080/bjyqImage";//从服务器获取图片
// const getFileUrl = "http://192.168.1.106:8080/bjyqFile";//从服务器获取文件

const workOrderUrl = baseUrl + "/WorkOrder";//工单相关功能Url
const complainUrl = baseUrl + "/Complain";//投诉相关功能Url
const equipmentUrl = baseUrl + "/Equipment";//设备相关功能Url
const decorationUrl = baseUrl + "/Decoration";//装修相关功能Url
const chargeUrl = baseUrl + "/Charge";//费用相关功能Urly
const userUrl = baseUrl + "/WxOpen";//用户相关功能Url
const proprietorUrl = baseUrl + "/Proprietor";//占用者相关功能Url
const statisticsUrl = baseUrl + "/Statistics";//统计信息相关Url
const reportUrl = baseUrl + "/Report";//上报信息相关Url
const lookOverUrl = baseUrl + "/LookOver"//巡检管理相关Url
const requestPaymentUrl = baseUrl + "/RequestPaymentFlow";//请款流程相关Url
const processUrl = baseUrl + "/Process";//流程业务相关Url


const urls = {
  // cloudUrl: "https://yqwy-hd.com/wxics/SendData/OnSendData",//云服务器向本地服务器发送数据的Url
  // cloudUrl: "http://localhost:8080/wxics/SendData/OnSendData",//云服务器向本地服务器发送数据的Url
  // cloudImageUrl: "https://yqwy-hd.com/wxics/SetImage/OnSetImage",//云服务器向本地服务器发送图片的Url
  // getImageUrl: "http://k17154485y.imwork.net:23530/bjyqImage",//从云服务器获取图片
  getFileUrl: getFileUrl,
  getWorkOrderUrl: workOrderUrl + "/OnGetRepairList",//获取工单列表
  setWorkOrderUrl: workOrderUrl + "/OnSetRepairOrder",//设置工单完成情况
  setWorkOrderIsReadUrl : workOrderUrl + "/OnSetOrderIsRead",//设置工单已阅读
  setRepairImageUrl: setImageUrl + "/OnSetRepairImages",//提交工单图片信息
  getRepairImageUrl: getImageUrl + "/jczl_fwrwgl/",//获取工单图片
  setPatrolUrl: workOrderUrl + "/OnSetPatrol",//提交报事信息
  setPatrolImageUrl: workOrderUrl + "/OnSetPatrolImage",//提交报事图片信息
  getPatrolUrl: workOrderUrl + "/OnGetPatrol",//获取报事历史

  getComplainUrl: complainUrl + "/OnGetComplainList",//获取投诉列表
  setComplainUrl: complainUrl + "/OnSetComplain",//设置投诉处理完成情况
  setComplainImageUrl: complainUrl + "/OnSetcomplainImage",//提交投诉处理照片


  getEquipmentListUrl: equipmentUrl + "/OnGetEquipment",//获取设备保养信息列表
  setEquipmentUrl: equipmentUrl + "/OnSetEquipment",//提交设备保养情况
  setEquipmentImageUrl: equipmentUrl + "/OnSetEquipmentImage",//提交设备保养照片信息
  getEquipmentTroubleListUrl: equipmentUrl + "/OnGetEquipmentTrouble",//获取设备故障列表
  setEquipmentTroubleUrl: equipmentUrl + "/OnSetEquipmentTrouble",//提交设备维修信息
  equipmentSearchUrl: equipmentUrl + "/OnSearchEquipment",//通过设备运行编号查询设备信息
  equipmentMaintainSearchUrl: equipmentUrl + "/OnSearchEquipmentMaintain",//通过设备运行编号查询设备保养记录

  getDecorationListUrl: decorationUrl + "/OnGetDecorationList",//获取装修信息列表
  setDecorationResultUrl: decorationUrl + "/OnSetDecorationResult",//提交装修信息
  getDecorationPatrolListUrl: decorationUrl + "/OnGetDecorationPatrolList",//获取装修巡检信息
  setDecorationPatrolResultUrl: decorationUrl + "/OnSetDecorationPatrolResult",//提交装修巡检信息
  setDecorationPatrolImageUrl: decorationUrl + "/OnSetDecorationPatrolImage",//提交装修巡检不合格情况照片

  getChargeListUrl: chargeUrl + "/OnGetChargeList",//获取应收款列表
  getChargedListUrl: chargeUrl + "/OnGetChargedList",//获取已收费列表
  getChargedDetailUrl: chargeUrl + "/OnGetChargedDetail",//获取已收费详情
  getChargeDetailUrl: chargeUrl + "/OnGetChargeDetail",//获取未收费详情
  unifiedOrderUrl: chargeUrl + "/OnUnifiedOrder",//微信统一下单
  setChargesUrl: chargeUrl + "/OnSetCharges",//微信支付成功后，设备系统应收款信息

  getProprietorListUrl: proprietorUrl + "/OnGetProprietorList",//获取现场查询的占用者列表
  
  getLookOverListUrl: lookOverUrl + "/OnGetLookOverInfo",//获取巡检信息
  setLookOverResultUrl: lookOverUrl + "/OnSetLookOverResult",//设置巡检结果
  setLookOverImageUrl: lookOverUrl + "/OnSetLookOverImage",//提交巡检照片
  
  loginUrl: userUrl + "/OnLogin",//用户登陆
  getUserInfoUrl: userUrl + "/OnGetUserInfo",//获取用户信息
  getUserInfoTestUrl: userUrl + "/OnGetUserTestInfo",//获取用户信息
  bindUserUrl: userUrl + "/OnBindUser",//绑定用户的用户ID和openid
  checkPasswordUrl: userUrl + "/OnCheckPassword",//检查用户密码是否正确

  getMonthChargeStatisticsUrl: statisticsUrl + "/OnGetMonthChargeStatistics",//报表_财务_月收费统计_管理处
  getArrearageStatisticsUrl: statisticsUrl + "/OnGetArrearageStatistics",//报表_财务_未收_欠款情况汇总
  getChargeStatisticsUrl: statisticsUrl + "/OnGetChargeStatistics",//报表_考核_物业管理费绩效考核

  getReportUrl: reportUrl + "/OnGetReport",//获取上报信息

  // getRequestPaymentSheetUrl: requestPaymentUrl + "/OnGetRequestPaymentSheet",//获取请款列表
  // setRequestPaymentFlowUrl: requestPaymentUrl + "/OnSetRequestPaymentFlow"//设置请款流程

  getProcessListUrl: processUrl + "/GetProcessList",//获取流程列表
  getProcessDetailUrl: processUrl + "/BussinessHandler_TableData",//获取流程详请
  endProcessUrl: processUrl + "/BussinessHandler_End",//结束流程
  setNotifyUrl: processUrl + "/BussinessHandler_Save_Notify",//提交留言信息
  getNextLinkUrl: processUrl + "/BussinessHandler_NextLink",//获取下一环节信息
  getNextStaffUrl: processUrl + "/BussinessHandler_NextLink_ReceiveStaffs",//获取下一环节实际接收者信息
  saveProcessUrl: processUrl + "/BussinessHandler_Save"//保存流程信息
}



module.exports = {
  urls: urls
}