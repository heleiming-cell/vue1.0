import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function inspectPoint_AddOrUpdate(data) { return request({ url: '/sys/inspectPoint/AddOrUpdate', method: 'post', data, }) }

//删除
export function inspectPoint_Del(params) { return request({ url: '/sys/inspectPoint/Del', method: 'get', params, }) }

//获取列表
export function inspectPoint_QueryList(data) { return request({ url: '/sys/inspectPoint/QueryList', method: 'post', data, }) }
