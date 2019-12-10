import request from '@/util/request'

//维保计划列表
export function GetPagePlanList(params) {
  return request({
    url: '/sys/AssetMaintenance/GetPagePlanList',
    method: 'get',
    params,
  })
}

//删除
export function DeletePlan(params) {
  return request({
    url: '/sys/AssetMaintenance/DeletePlan',
    method: 'get',
    params,
  })
}

//获取资产类型列表
export function DeviceCategory_QueryList(data) {
  return request({
    url: '/sys/DeviceCategory/QueryList',
    method: 'post',
    data,
  })
}
//获取资产类型列表
export function Device_QueryList(data) {
  return request({
    url: '/sys/Device/QueryList',
    method: 'post',
    data,
  })
}
//新增维保计划
export function AddPlan(data) {
  return request({
    url: '/sys/AssetMaintenance/AddPlan',
    method: 'post',
    data,
  })
}
//获取一条维保计划
export function GetPlan(params) {
  return request({
    url: '/sys/AssetMaintenance/GetPlan',
    method: 'get',
    params,
  })
}
//修改维保计划
export function UpdatePlan(data) {
  return request({
    url: '/sys/AssetMaintenance/UpdatePlan',
    method: 'post',
    data,
  })
}
//修改维保计划
export function PageList(data) {
  return request({
    url: '/sys/Standard/PageList',
    method: 'post',
    data,
  })
}
