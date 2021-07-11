// 该文件专门用于发送网络请求
import myAxios from './myAxios';


export const reqUserLogin = (username,password) => myAxios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`)
export const reqMeauList = () => myAxios.get('/rights?_embed=children')
export const reqRole = () => myAxios.get('/roles')
export const reqUser = () => myAxios.get('/users?_expand=role')
export const reqRegion = () => myAxios.get('/regions')
export const reqNewscategory = () => myAxios.get('/categories')
export const reqNewsDraft = (username) => myAxios.get(`/news?author=${username}&auditState=0&_expand=category`)
export const reqNewsInfo = (id) => myAxios.get(`/news/${id}?_expand=role&_expand=category`)
export const reqNewsList = (username) => myAxios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
export const reqAllNews = () => myAxios.get(`/news?auditState=1&_expand=category`)
export const reqRightsMeau = () => myAxios.get('/rights')
export const reqChildrenMeau = () => myAxios.get('/children')
export const reqNews = (username,type) => myAxios.get(`/news?author=${username}&publishState=${type}&_expand=category`)
export const reqViewNews = () => myAxios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc')
export const reqStarNews = () => myAxios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc')
export const reqPublishNew =() => myAxios.get('/news?publishState=2&_expand=category')

export const postNewUser = (data) => myAxios.post(`/users`,data)
export const postNews = (data) => myAxios.post(`/news`,data)

export const delNews = (id) => myAxios.delete(`/news/${id}`)
export const delUser = (id) => myAxios.delete(`/users/${id}`)
export const delCategory = (id) => myAxios.delete(`/categories/${id}`)
export const delRight = (id) => myAxios.delete(`/rights/${id}`)
export const delChildren = (id) => myAxios.delete(`/children/${id}`)
export const delRole = (id) => myAxios.delete(`/roles/${id}`)

export const patchUser = (id,data) => myAxios.patch(`/users/${id}`,data)
export const patchNewsCategory = (id,data) => myAxios.patch(`categories/${id}`,data)
export const patchNews = (id,data) => myAxios.patch(`/news/${id}`,data)
export const patchRight = (id,data) => myAxios.patch(`/rights/${id}`,data)
export const patchChildren = (id,data) => myAxios.patch(`/children/${id}`,data)
export const patchRole = (id,data) => myAxios.patch(`/roles/${id}`,data)
