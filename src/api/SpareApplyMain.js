import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function SpareApplyMain_Add(data) { return request({ url: '/sys/SpareApplyMain/Add', method: 'post', data, }) }

//删除
export function SpareApplyMain_Del(data) { return request({ url: '/sys/SpareApplyMain/Del', method: 'post', data, }) }

//获取列表
export function SpareApplyMain_QueryList(data) { return request({ url: '/sys/SpareApplyMain/QueryList', method: 'post', data, }) }

// 查看详情
export function SpareApplyMain_QueryDetail(params) { return request({ url: '/sys/SpareApplyMain/QueryDetail', method: 'get', params, }) }


//仓库管理
export function SpareApplyMain_Query(params) { return request({ url: '/sys/SpareApplyMain/QueryDetailByWareHouseId', method: 'get', params, }) }