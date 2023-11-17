import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import  {ToastContainer , toast} from 'react-toastify';

import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {
    const { alert } = useSelector(state => state)
    const dispatch = useDispatch()


    return (
        <div>
            {alert.loading && <Loading />}

            {
                alert.error && 
                <ToastContainer msg={{title: 'Error', body: alert.error}}
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT, payload: {}})} 
                bgColor="bg-danger" />
            }

            {
                alert.success && 
                <Toast msg={{title: 'Success', body: alert.success}} 
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT, payload: {}})}
                bgColor="bg-success" />
            }
        </div>
    )
}

export default Notify
