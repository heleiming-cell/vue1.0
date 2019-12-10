import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function Standard_AddOrUpdate(data) { return request({ url: '/sys/Standard/AddOrUpdate', method: 'post', data, }) }

//删除
export function Standard_Del(params) { return request({ url: '/sys/Standard/Del', method: 'get', params, }) }

//获取标准列表
export function Standard_PageList(data) { return request({ url: '/sys/Standard/PageList', method: 'post', data, }) }
