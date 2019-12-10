import request from '@/util/request'

//角色绑定用户
export function Public_AddRoleUser(data) { return request({ url: '/sys/Public/AddRoleUser', method: 'post', data, }) }

//删除角色下的用户
export function Public_DelRoleUser(data) { return request({ url: '/sys/Public/DelRoleUser', method: 'post', data, }) }

//上传文件
export function Public_UpFile(data) { return request({ url: '/sys/Public/UpFile', method: 'post', data, }) }

//删除文件
export function Public_DelFile(params) { return request({ url: '/sys/Public/DelFile', method: 'get', params, }) }

//获取所有分类，
export function Public_GetAllCate(params) { return request({ url: '/sys/Public/GetAllCate', method: 'get', params, }) }

//获取还可绑定的用户列表
export function Public_CanBindUsers(params) { return request({ url: '/sys/Public/CanBindUsers', method: 'get', params, }) }

//获取所有枚举
export function Public_AllEnums(params) { return request({ url: '/sys/Public/AllEnums', method: 'get', params, }) }
