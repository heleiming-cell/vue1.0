import request from '@/util/request'

//新增
export function WorkFlow_Add(data) { return request({ url: '/sys/WorkFlow/Add', method: 'post', data, }) }

//工单操作
export function WorkFlow_Action(data) { return request({ url: '/sys/WorkFlow/Action', method: 'post', data, }) }

//查询工单列表
export function WorkFlow_QueryList(data) { return request({ url: '/sys/WorkFlow/QueryList', method: 'post', data, }) }

//获取工单详情
export function WorkFlow_QueryDetail(params) { return request({ url: '/sys/WorkFlow/QueryDetail', method: 'get', params, }) }

//资产管理，根据资产ID查询维修单列表
export function WorkFlow_GetWXListByDeviceId(data) { return request({ url: '/sys/WorkFlow/GetWXListByDeviceId', method: 'post', data, }) }

//资产管理，根据资产ID查询维保单列表
export function WorkFlow_GetWBListByDeviceId(data) { return request({ url: '/sys/WorkFlow/GetWBListByDeviceId', method: 'post', data, }) }

//工单总数统计
export function WorkFlow_IndexTotalData(data) { return request({ url: '/sys/WorkFlow/IndexTotalData', method: 'post', data, }) }

//维护组统计
export function WorkFlow_IndexTeamData(data) { return request({ url: '/sys/WorkFlow/IndexTeamData', method: 'post', data, }) }

//首页列表数据
export function WorkFlow_IndexListData(params) { return request({ url: '/sys/WorkFlow/IndexListData', method: 'get', params, }) }

//项目管理列表
export function Project_GetAllCate(data) {
  return request({
    url: '/sys/Public/GetAllCate',
    method: 'get',
    params: data,
  })
}
