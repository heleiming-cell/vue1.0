import request from '@/util/request'

//新增项目，Id为空字符串时新增，其余则为修改
export function Project_AddOrUodate(data) { return request({ url: '/sys/Project/AddOrUodate', method: 'post', data, }) }

//删除
export function Project_DelProject(params) { return request({ url: '/sys/Project/DelProject', method: 'get', params, }) }

//新增项目组下的用户
export function Project_AddProjectUser(data) { return request({ url: '/sys/Project/AddProjectUser', method: 'post', data, }) }

//删除项目组下的用户
export function Project_DelProjectUser(data) { return request({ url: '/sys/Project/DelProjectUser', method: 'post', data, }) }

//获取列表
export function Project_QueryList(params) { return request({ url: '/sys/Project/QueryList', method: 'get', params, }) }
