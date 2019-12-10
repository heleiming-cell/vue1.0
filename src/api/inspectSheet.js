import request from '@/util/request'

//删除
export function inspectSheet_Del(data) { return request({ url: '/sys/inspectSheet/Del', method: 'post', data, }) }

//获取任务列表 State传 0:未派发,1:未接收,2:未完成,3:未审核,4:已完成
export function inspectSheet_List(data) { return request({ url: '/sys/inspectSheet/List', method: 'post', data, }) }

//获取待派发的任务列表
export function inspectSheet_NotPayTaskList(data) { return request({ url: '/sys/inspectSheet/NotPayTaskList', method: 'post', data, }) }

//获取待接受的任务列表
export function inspectSheet_NotAskList(data) { return request({ url: '/sys/inspectSheet/NotAskList', method: 'post', data, }) }

//获取任务详情
export function inspectSheet_TaskDetail(params) { return request({ url: '/sys/inspectSheet/TaskDetail', method: 'get', params, }) }

//创建巡检任务
export function inspectSheet_CreateSheet(data) { return request({ url: '/sys/inspectSheet/CreateSheet', method: 'post', data, }) }

//派发任务
export function inspectSheet_SendPayTask(data) { return request({ url: '/sys/inspectSheet/SendPayTask', method: 'post', data, }) }

//接收任务
export function inspectSheet_ReceiveTask(params) { return request({ url: '/sys/inspectSheet/ReceiveTask', method: 'get', params, }) }

//提交巡检结果
export function inspectSheet_SubmitTask(data) { return request({ url: '/sys/inspectSheet/SubmitTask', method: 'post', data, }) }

//根据任务id和扫描的二维码获取二维码详情和巡检标准
export function inspectSheet_GetInspectAsk(params) { return request({ url: '/sys/inspectSheet/GetInspectAsk', method: 'get', params, }) }

//审核已巡检完成的巡检任务
export function inspectSheet_CheckSheet(data) { return request({ url: '/sys/inspectSheet/CheckSheet', method: 'post', data, }) }

//获取巡检流程详情
export function inspectSheet_GetTaskFlowDetail(params) { return request({ url: '/sys/inspectSheet/GetTaskFlowDetail', method: 'get', params, }) }

//巡检统计
export function inspectSheet_InspectCount(params) { return request({ url: '/sys/inspectSheet/InspectCount', method: 'get', params, }) }

//获取巡检点巡检记录
export function inspectSheet_GetPointResult(params) { return request({ url: '/sys/inspectSheet/GetPointResult', method: 'get', params, }) }

//获取设备巡检记录
export function inspectSheet_GetDeviceResult(params) { return request({ url: '/sys/inspectSheet/GetDeviceResult', method: 'get', params, }) }


//资产统计
export function DeviceStatistics(params) { return request({ url: '/sys/device/GetDeviceStatistics', method: 'get', params, }) }
