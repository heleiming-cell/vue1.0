import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function DeviceCategory_AddOrUpdate(data) { return request({ url: '/sys/DeviceCategory/AddOrUpdate', method: 'post', data, }) }

//删除
export function DeviceCategory_Del(params) { return request({ url: '/sys/DeviceCategory/Del', method: 'get', params, }) }

//获取列表
export function DeviceCategory_QueryList(data) { return request({ url: '/sys/DeviceCategory/QueryList', method: 'post', data, }) }
