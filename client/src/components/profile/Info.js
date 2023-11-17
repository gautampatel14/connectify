import React, { useState, useEffect } from 'react'
import Avatar from '../Avatar'
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { BsPencilSquare } from 'react-icons/bs';
import verified from '../../assets/verified2.jpg'
import {make_Payment } from '../../redux/actions/profileAction'
import { useSelector } from 'react-redux';
import { deleteAccount, logout } from '../../redux/actions/authAction'
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import ConfirmationDialog from '../ConfirmationDialog'
import { toast } from 'react-toastify';


const Info = ({id, auth, profile, dispatch}) => {



    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)

    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)


    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }else{
            const newData = profile.users.filter(user => user._id === id)
            setUserData(newData)
        }
    }, [id, auth, dispatch, profile.users])


    useEffect(() => {
        if(showFollowers || showFollowing || onEdit){
            dispatch({ type: GLOBALTYPES.MODAL, payload: true})
        }else{
            dispatch({ type: GLOBALTYPES.MODAL, payload: false})
        }
    },[showFollowers, showFollowing, onEdit, dispatch])
    
    

    const product = {

        name:"Get Verification",
        price:999,
        description:"Verification"
    }

    // const session = useSelector(state => state.profile.sessionId);

    // console.log(session);

    const [showDialog, setShowDialog] = useState(false);

    const handleMenuClick = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleOptionClick = (option) => {

        setShowDialog(false);
        if (option === 'getVerify') {
            makePayment();
        } else if (option === 'logout') {

            dispatch(logout())
        
        } else if (option === 'deleteAccount') {

            setIsConfirmationOpen(true);
        
        }
    };


    const makePayment = async()=>
    {
        dispatch(make_Payment({ id: auth.user._id, product, auth }));
    }

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


    const confirmDeleteAccount = () => {
    try {
        dispatch(deleteAccount(auth.user._id));
        toast.success('Your account has been deleted.');
        // dispatch(logout());
    } catch (err) {
        console.error(err);
    }
        setIsConfirmationOpen(false);
    };

    const cancelDeleteAccount = () => {
        setIsConfirmationOpen(false);
    };

    
    return (
        <div className="info">
            {
                userData.map(user => (
                    <div className="" key={user._id}>
                        
                    <div className='info_container'>
                        <Avatar src={user.avatar} size="supper-avatar" />
                    </div>
                
                        <div className='name-container'>

                            <span>

                                {user.fullname}

                                {
                                    
                                    user._id === auth.user._id ?

                                    (<>
                                    

                                        {user.verified ?  (

                                            <span className="verified-icon" style={{marginLeft:"2px"}}><img style={{height:"20px"}} src={verified} alt='verified' />
                                            </span>

                                            ) : (
                                            <></>
                                        )}
                                        <span className='three-dots' onClick={handleMenuClick}>
                                            <span className='dot'> •••</span>
                                        </span>

                                    </>):(<>

                                        {user.verified ?  (

                                            <span className="verified-icon" style={{marginLeft:"2px"}}><img style={{height:"20px"}} src={verified} alt='verified' /></span>
                                            ) : (
                                            <></>
                                        )}
                                    
                                    </>)
                                    
                                }

                                {
                                    user._id === auth.user._id
                                    ?  <span className="btn "
                                    onClick={() => setOnEdit(true)}>
                                    <span style={{fontWeight:"560"}}><BsPencilSquare /></span>
                                    </span>
                                    
                                    : <span className='btn-fn'><FollowBtn user={user} /></span>
                                }
                            
                            </span>
                            
                        </div>

                        <div className='name-container'>
                            <span className='username-cont'>@{user.username}</span>
                        </div>

                        <div className='personal-details'>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>

                        </div>

                        <div className='other-info'>

                            <div className='inner-details'>
                                
                                <div onClick={() => setShowFollowers(true)} className='show-span'>

                                        <span>{user.followers.length}</span>
                                </div>

                                <div>
                                    Followers
                                </div>

                            </div>


                            <div className='inner-details'>
                                
                                <div className='show-span' onClick={() => setShowFollowing(true)}>

                                    <span>{user.following.length}</span>
                                </div>
                                <div >
                                    Following
                                </div>
                            
                            </div>
                            
                        </div>

                        <div>

                        
                            
                        </div>
                        
                        {
                            onEdit && <EditProfile setOnEdit={setOnEdit} />
                        }

                        {
                            showFollowers &&
                            <Followers 
                            users={user.followers} 
                            setShowFollowers={setShowFollowers} 
                            />
                        }
                        {
                            showFollowing &&
                            <Following 
                            users={user.following} 
                            setShowFollowing={setShowFollowing} 
                            />
                        }
                        
                        <Dialog open={showDialog} onClose={handleCloseDialog}>
                            <DialogTitle >Settings</DialogTitle>
                            <DialogContent className="dialog-content">
                                {!user.verified && (
                                    <Button onClick={() => handleOptionClick('getVerify')}>
                                        <span> Get Verify </span>
                                    </Button>
                                )}
                                <Button onClick={() => handleOptionClick('logout')}> <span> Logout </span></Button>
                                <Button onClick={() => handleOptionClick('deleteAccount')} className='del-btn' style={{color:"red"}}>
                                    Delete Account 
                                </Button>
                            </DialogContent>
                        </Dialog>

                        <ConfirmationDialog
                            isOpen={isConfirmationOpen}
                            onRequestClose={cancelDeleteAccount}
                            onConfirm={confirmDeleteAccount}
                        />
                        
                    </div>

                ))
            }
        </div>
    )
}

export default Info