import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import '.././styles/righsidebar.css'
import verified from '../assets/verified2.jpg'



const UserCard = ({children, user, border, handleClose, setShowFollowers, setShowFollowing, msg}) => {

    const { theme } = useSelector(state => state)

    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }

    const showMsg = (user) => {
        return(
            <>
                <div style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                    {user.text}
                </div>
                {
                    user.media.length > 0 && 
                    <div className='' >
                        {user.media.length} <i className="fas fa-image" />
                    </div>
                }

                {
                    user.call &&
                    <span className="material-icons">
                        {
                            user.call.times === 0
                            ? user.call.video ? 'videocam_off' : 'phone_disabled'
                            : user.call.video ? 'video_camera_front' : 'call'
                        }
                    </span>
                }
            </>
        )
    }


    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 suggestion-div ${border}`} style={{}}>
            <div className=''>
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                className="d-flex align-items-center righ-sidebar-usercard">
                    
                    <Avatar src={user.avatar} size="big-avatar" />

                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>

                        <span className="d-block">{user.username}
                        
                            {user.verified ? (
                                <span className="verified-icon" style={{marginLeft:"2px"}}><img style={{height:"12px"}} src={verified} alt='verified' /></span>):(<></>)}
                                
                        </span>

                        
                        <small style={{opacity: 0.7}}>
                            {
                                msg 
                                ? showMsg(user)
                                : user.fullname
                            }
                        </small>
                    </div>
                </Link>
            </div>
            
            {children}
        </div>
    )
}

export default UserCard
