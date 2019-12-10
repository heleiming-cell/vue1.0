import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function Templet_AddOrUpdate(data) { return request({ url: '/sys/Templet/AddOrUpdate', method: 'post', data, }) }

//删除
export function Templet_Del(params) { return request({ url: '/sys/Templet/Del', method: 'get', params, }) }

//获取列表
export function Templet_QueryList(data) { return request({ url: '/sys/Templet/QueryList', method: 'post', data, }) }
