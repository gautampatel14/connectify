import { GLOBALTYPES } from './globalTypes'
import { getDataAPI } from '../../utils/fetchData'


export const FOLLOWERS_TYPE = {

    LOADING: 'LOADING_FOLLOWERS',
    GET_FOLLOWERS: 'GET_ALL_FOLLOWERS',
}

export const getAllfollowers = (token) => async (dispatch) => {
    try {
        
        dispatch({ type: FOLLOWERS_TYPE.LOADING, payload: true })
        
        const res = await getDataAPI('getAllfollowers', token)
        dispatch({ type: FOLLOWERS_TYPE.GET_FOLLOWERS, payload: res.data })

        dispatch({ type: FOLLOWERS_TYPE.LOADING, payload: false })
        
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}