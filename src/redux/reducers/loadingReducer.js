import {CHANGE_LOADING} from '../action_type'

let initState = false
export function changLoading (preState = initState,action) {
    const {type} = action 
    let newState;
    switch (type) {
        case CHANGE_LOADING:
            newState = !preState
            return newState;
        default:
            return preState;
    }
}