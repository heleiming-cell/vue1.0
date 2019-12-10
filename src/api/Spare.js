import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function Spare_AddOrUpdate(data) { return request({ url: '/sys/Spare/AddOrUpdate', method: 'post', data, }) }

//删除
export function Spare_Del(params) { return request({ url: '/sys/Spare/Del', method: 'get', params, }) }

//获取指定仓库下的备件列表,必须传仓库ID
export function Spare_QueryList(data) { return request({ url: '/sys/Spare/QueryList', method: 'post', data, }) }

//获取指定仓库下的备件列表,必须传仓库ID(工单中人员领用备件列表)
export function Spare_QueryListByApply(data) { return request({ url: '/sys/Spare/QueryListByApply', method: 'post', data, }) }
