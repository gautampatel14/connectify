import { FOLLOWERS_TYPE } from '../actions/followersAction'

const initialState = {
    loading: false,
    users: []
}


const followersReducer = (state = initialState, action) => {
    
    switch (action.type){
        case FOLLOWERS_TYPE.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case FOLLOWERS_TYPE.GET_FOLLOWERS:
            return {
                ...state,
                users: action.payload.users
            };
        default:
            return state;
    }
}

export default followersReducer
