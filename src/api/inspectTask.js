import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function inspectTask_AddOrUpdate(data) { return request({ url: '/sys/inspectTask/AddOrUpdate', method: 'post', data, }) }

//删除任务
export function inspectTask_Del(params) { return request({ url: '/sys/inspectTask/Del', method: 'get', params, }) }

//修改任务状态
export function inspectTask_UpdateState(params) { return request({ url: '/sys/inspectTask/UpdateState', method: 'get', params, }) }

//获取列表
export function inspectTask_QueryList(data) { return request({ url: '/sys/inspectTask/QueryList', method: 'post', data, }) }

//巡检任务列表
export function inspectTask_List(data) { return request({ url: '/sys/inspectTask/List', method: 'post', data, }) }

//获取一条任务详情
export function inspectTask_QueryOne(params) { return request({ url: '/sys/inspectTask/QueryOne', method: 'get', params, }) }

//任务添加计划
export function inspectTask_TaskBindPlan(data) { return request({ url: '/sys/inspectTask/TaskBindPlan', method: 'post', data, }) }

//根据任务id获取任务计划详情
export function inspectTask_GetTaskPlan(params) { return request({ url: '/sys/inspectTask/GetTaskPlan', method: 'get', params, }) }
 