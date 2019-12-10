import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function SpareOut_Add(data) { return request({ url: '/sys/SpareOut/Add', method: 'post', data, }) }

//获取出库单列表
export function SpareOut_QueryList(data) { return request({ url: '/sys/SpareOut/QueryList', method: 'post', data, }) }

//查询出库单详情
export function SpareOut_QueryDetail(params) { return request({ url: '/sys/SpareOut/QueryDetail', method: 'get', params, }) }


//仓库管理
export function SpareOut_Query(params) { return request({ url: '/sys/SpareOut/QueryDetailByWareHouseId', method: 'get', params, }) }
