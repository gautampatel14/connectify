import { GLOBALTYPES, DeleteData } from './globalTypes'
import { getDataAPI, patchDataAPI,postDataAPI} from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { createNotify, removeNotify } from '../actions/notifyAction'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import {loadStripe} from '@stripe/stripe-js';



export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST',
    VERIFY_USER: 'VERIFY_USER',
}


export const getProfileUsers = ({id, auth}) => async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id})

    try {
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})
        const res = getDataAPI(`/user/${id}`, auth.token)
        const res1 = getDataAPI(`/user_posts/${id}`, auth.token)
        
        const users = await res;
        const posts = await res1;

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        })

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: {...posts.data, _id: id, page: 2}
        })

        dispatch({type: PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
    
}


export const updateProfileUser = ({userData, avatar, auth}) => async (dispatch) => {
    if(!userData.fullname)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Please add your full name."}})

    if(userData.fullname.length > 25)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your full name too long."}})

    if(userData.story.length > 200)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your story too long."}})

    try {
        let media;
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        if(avatar) media = await imageUpload([avatar])

        const res = await patchDataAPI("user", {
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user, ...userData,
                    avatar: avatar ? media[0].url : auth.user.avatar,
                }
            }
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})
    } catch (err) {
        
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
            
        })
    }
}

export const follow = ({users, user, auth, socket}) => async (dispatch) => {
    let newUser;
    
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: [...user.followers, auth.user]}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: [...item.followers, auth.user]}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: {...auth.user, following: [...auth.user.following, newUser]}
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        socket.emit('follow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const unfollow = ({users, user, auth, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: DeleteData(user.followers, auth.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: DeleteData(item.followers, auth.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: { 
                ...auth.user, 
                following: DeleteData(auth.user.following, newUser._id) 
            }
        }
    })
    
    try {
        const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        socket.emit('unFollow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

// export const verifyUser = ({ id, paymentMethodId, auth }) => async (dispatch) => {
//     try {

//         dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

//         const res = await postDataAPI(`user/${id}/verified`, { paymentMethodId}, auth.token);


//         const { msg, paymentId, verified } = res.data;

    
//         dispatch({
//         type: PROFILE_TYPES.VERIFY_USER,
//         payload: { _id: id, verified },
//         });

        
//         dispatch({
//         type: GLOBALTYPES.ALERT,
//         payload: { success: msg },
//         });

//         console.log('Payment ID:', paymentId);

//         dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
//     } catch (error) {
//         dispatch({
//         type: GLOBALTYPES.ALERT,
//         payload: { error: error.response.data.msg },
//         });
//     }
// };



// export const Verification = ({ id,token,product, auth }) => async (dispatch) => {

//     try {
//         dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

//         const res = await postDataAPI(`user/${id}/verification`,{token,product}, auth.token);

//         const { msg, verified , clientSecret} = res.data;


//         dispatch({
//         type: PROFILE_TYPES.VERIFY_USER,
//         payload: { _id: id, verified,clientSecret },
//         });

        
//         dispatch({
//         type: GLOBALTYPES.ALERT,
//         payload: { success: msg },
//         });


//         dispatch({ type: PROFILE_TYPES.LOADING, payload: false });

//     } catch (error) {
//         dispatch({
//         type: GLOBALTYPES.ALERT,
//         payload: { error: error.response.data.msg },
//         });
//     }
// };


export const make_Payment = ({id, product, auth }) => async (dispatch) => {

    try {

        dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

        const res = await postDataAPI(`user/${id}/create-checkout-session`,{product}, auth.token);

    
        const session = res.data;


        // to make paymentIntent.
        
        const stripe = await loadStripe("pk_test_51Ns4h8SAkofUcsoWGLiwRy2LLBVSLDSyT95eEjAsqDsdklJIcnLm1iIJBMjkiB4PJXdDT6tX5edZn55x5wJfLFZs00S1mWZx36");

            const result = stripe.redirectToCheckout({
                    // sessionId:session.id
                    sessionId:session.id
                });
                
            if(result.error){
                    console.log(result.error);
            }else {
                
            // Dispatch a new action on success
            // dispatch(onPaymentSuccess({id,sessionId:session.id,auth}));

            // dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        }

            dispatch({

            type: PROFILE_TYPES.VERIFY_USER,
            payload:session.id,

        });



    } catch (error) {
        dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: error.response.data.msg },
        });
    }
};


// const onPaymentSuccess = ({id,sessionId,auth}) => async (dispatch) => {
//     try {
//         // Perform another API call or dispatch an action as needed
//         const res = await postDataAPI(`user/${id}/verify`,{sessionId},auth.token);

//         // Handle the response or dispatch additional actions if necessary

//         const { msg, verified } = res.data;

//         console.log("Additional API call success:", res.data);

//         // You can dispatch additional actions based on the API response
//         // Example: dispatch({ type: SOME_ACTION, payload: res.data });
        
//         dispatch({

//             type: PROFILE_TYPES.VERIFIED_USER,
//             payload: { _id: id, verified},
        
//         });

        
//         dispatch({
//         type: GLOBALTYPES.ALERT,
//         payload: { success: msg },
//         });


//         dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
//     } catch (error) {
//         console.error("Additional API call error:", error);
//         // Handle error if needed
//     }
// };