import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function SpareIn_Add(data) { return request({ url: '/sys/SpareIn/Add', method: 'post', data, }) }

//获取入库单列表
export function SpareIn_QueryList(data) { return request({ url: '/sys/SpareIn/QueryList', method: 'post', data, }) }

//查询入库单详情
export function SpareIn_QueryDetail(params) { return request({ url: '/sys/SpareIn/QueryDetail', method: 'get', params, }) }

//仓库管理整改
export function SpareIn_Query(params) { return request({ url: '/sys/SpareIn/QueryDetailByWareHouseId', method: 'get', params, }) }
