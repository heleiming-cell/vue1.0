import request from '@/util/request'

//Id为空字符串时新增，其余则为修改
export function Warehouse_AddOrUpdate(data) { return request({ url: '/sys/Warehouse/AddOrUpdate', method: 'post', data, }) }

//删除
export function Warehouse_Del(params) {
  return request({
    url: '/sys/Warehouse/Del',
    method: 'get',
    params,
  })
}

//获取列表
export function Warehouse_QueryList(data) { return request({ url: '/sys/Warehouse/QueryList', method: 'post', data, }) }
