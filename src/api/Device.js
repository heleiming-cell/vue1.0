import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function Device_AddOrUpdate(data) { return request({ url: '/sys/Device/AddOrUpdate', method: 'post', data, }) }

//删除
export function Device_Del(params) { return request({ url: '/sys/Device/Del', method: 'get', params, }) }

//获取列表
export function Device_QueryList(data) { return request({ url: '/sys/Device/QueryList', method: 'post', data, }) }

//获取列表
export function Device_DeviceList(data) { return request({ url: '/sys/Device/DeviceList', method: 'post', data, }) }

//获取设备详情
export function Device_QueryDeviceDetail(params) { return request({ url: '/sys/Device/QueryDeviceDetail', method: 'get', params, }) }