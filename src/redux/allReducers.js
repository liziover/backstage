// 该文件用于整合所有的reducer
import { combineReducers } from 'redux'
import {changLoading} from './reducers/loadingReducer'


export default combineReducers({
    changLoading,
})