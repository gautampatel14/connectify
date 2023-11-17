import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Avatar from '../../Avatar'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import { BASE_URL } from '../../../utils/config'

const CardHeader = ({post}) => {
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const history = useHistory()

    const handleEditPost = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: {...post, onEdit: true}})
    }

    // const handleDeletePost = () => {
    //     if(window.confirm("Are you sure want to delete this post?")){
    //         dispatch(deletePost({post, auth, socket}))
    //         return history.push("/")
    //     }
    // }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleDeletePost = () => {
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        dispatch(deletePost({ post, auth, socket }));
        history.push('/');
        setOpenDialog(false);
    };

    const cancelDelete = () => {
        setOpenDialog(false);
    };

    return (
        <div className="card_header">
            <div className="d-flex">
                <Avatar src={post.user.avatar} size="big-avatar" />

                <div className="card_name">
                    <h6 className="m-0">
                        <Link to={`/profile/${post.user._id}`} className="text-dark">
                            {post.user.username}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>
            </div>

            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    more_horiz
                </span>

                <div className="dropdown-menu">
                    {
                        auth.user._id === post.user._id &&
                        <>
                            <div className="dropdown-item" onClick={handleEditPost}>
                                <span className="material-icons">create</span> Edit Post
                            </div>
                            <div className="dropdown-item" onClick={handleDeletePost} >
                                <span className="material-icons">delete_outline</span> Remove Post
                            </div>
                        </>
                    }

                    <div className="dropdown-item" onClick={handleCopyLink}>
                        <span className="material-icons">content_copy</span> Copy Link
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this post?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>No</Button>
                    <Button onClick={confirmDelete} variant="contained" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CardHeader
