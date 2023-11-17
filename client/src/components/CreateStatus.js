import React from 'react'
// import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'


const CreateStatus = () => {
    // const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    return (

        <>
            <div className="nopost">
                    
                <div>
                    <h4 style={{fontWeight:"500",textAlign:"center"}}>
                        No posts yet. Start sharing your creations & follow other people to see their amazing posts!!
                    </h4>

                    <div className="exp-div">
                        <div
                        // to="./discover"
                        className="discover-link text-lg rounded-lg text-white py-1 px-4 m-4"
                        style={{display:"flex"}}
                        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
                    > 
                        <span style={{fontSize:"1.3rem"}}>Create</span>
                        </div>
                    </div>
                </div>
            </div>

        </>


    )
}

export default CreateStatus
