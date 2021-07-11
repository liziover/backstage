import axios from 'axios'
import { message } from 'antd';
import store from '../redux/store'
import {changLoading} from '../redux/actions/loadingAction'

const instance = axios.create({
    timeout: 4000,
    baseURL: 'http://localhost:5000'
});



// 请求拦截器
instance.interceptors.request.use((config) => {
    // 显示loading加载效果
    store.dispatch(changLoading())
    return config;
},  (error) => {
    message.error(error.message,1)
    return new Promise(()=> {})
});

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 请求成功走这里
        // 隐藏loading加载效果
        store.dispatch(changLoading())
        return response.data;
    }, (error) => {
        // 如果请求失败，走这里 
        message.error(error.message,1)
        return new Promise(()=> {})
    });

export default instance