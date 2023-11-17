import React , {useState} from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMessages } from '../../redux/actions/messageAction'
import Times from './Times'

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button';



const MsgDisplay = ({user, msg, theme, data}) => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    // const handleDeleteMessages = () => {
    //     if(!data) return;
        
    //     if(window.confirm('Do you want to delete?')){
    //         dispatch(deleteMessages({msg, data, auth}))
    //     }
    // }

    const [showDialog, setShowDialog] = useState(false);

    const handleDeleteMessages = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleConfirmDelete = () => {

        if(!data) return;
        
        dispatch(deleteMessages({msg, data, auth}))
        setShowDialog(false);

        
    };


    return (
        <>
            <div className="chat_title">
                <Avatar src={user.avatar} size="small-avatar" />
                <span>{user.username}</span>
            </div>

            <div className="you_content">
                { 
                    user._id === auth.user._id && 
                    <i className="fas fa-trash text-danger"
                    onClick={handleDeleteMessages} />
                }

                <div>
                    {
                        msg.text && 
                        <div className="chat_text"
                        style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                            {msg.text}
                        </div>
                    }
                    {
                        msg.media.map((item, index) => (
                            <div key={index}>
                                {
                                    item.url.match(/video/i)
                                    ? videoShow(item.url, theme)
                                    : imageShow(item.url, theme)
                                }
                            </div>
                        ))
                    }
                </div>
            
                {
                    msg.call &&
                    <button className="btn d-flex align-items-center py-3"
                    style={{background: '#eee', borderRadius: '10px'}}>

                        <span className="material-icons font-weight-bold mr-1"
                        style={{ 
                            fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                            filter: theme ? 'invert(1)' : 'invert(0)'
                        }}>
                            {
                                msg.call.times === 0
                                ? msg.call.video ? 'videocam_off' : 'phone_disabled'
                                : msg.call.video ? 'video_camera_front' : 'call'
                            }
                        </span>

                        <div className="text-left">
                            <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                            <small>
                                {
                                    msg.call.times > 0 
                                    ? <Times total={msg.call.times} />
                                    : new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>

                    </button>
                }
            
            </div>

            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>

            {
                
                <Dialog open={showDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent className="dialog-content">
                    <p>Are you sure you want to delete this message ?</p>
                    <div className="dialog-buttons">
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button style={{color:"red"}} onClick={handleConfirmDelete} className="del-btn">
                        Delete
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>

            }
        </>
    )
}

export default MsgDisplay
