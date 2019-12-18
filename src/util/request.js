import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui';
import $QS from 'qs'
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
  //baseURL: location.protocol + "//" + "117.184.65.46:1142", // api 的 base_url

  baseURL: "https://ipm.pgjn.com.cn:1142",
  // baseURL: "http://localhost:5000",
  headers: {
    'Content-Type': 'application/json',
  }
})
let loadingInstance = null
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    //绕过get请求设置content-type
    if (config.method == 'get') {
      config.data = true
    }
    // config.headers['H-TOKEN'] = '111'

    loadingInstance = Loading.service({
      lock: true,
      text: '',
      spinner: 'ddd',
      background: 'rgba(245, 245, 245, 0)'
    })
    let token = Cookies.get('token')

    if (token) {
      config.headers.Authorization = 'bearer ' + token.slice(0, token.length - 3);
    }
    if (config.headers['Content-Type'] == 'multipart/form-data' || config.headers['Content-Type'] == 'application/json') {
      return config
    }
    config.data = $QS.stringify(config.data)
    return config
  },
  error => {
    // Do something with request error
    loadingInstance.close()
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    loadingInstance.close()
    if (res.Success) {
      return res
    } else {
      Message({
        message: res.Message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(response)
    }
  },
  error => {
    console.log('err' + error) // for debug
    loadingInstance.close()

    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
