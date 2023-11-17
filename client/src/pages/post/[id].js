import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPost } from '../../redux/actions/postAction'
import PostCard from '../../components/PostCard'


import MyLoader from '../../components/MyLoader'
import Menu from '../../components/header/Menu'
import '../../styles/posts.css'

const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState([])

    const { auth, detailPost } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPost, id, auth}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
        }
    },[detailPost, dispatch, id, auth])

    return (

        <div className='home row mx-0'>

            <div className="col-md-2 left-side">
                <Menu />
            </div>


        <div className='middle-part '>


                <div className='control-div'>

                    <div className="posts post-controller ">
                        {
                            post.length === 0 &&
                            <MyLoader />
                        }
                        
                        {
                            post.map(item => (
                                <PostCard key={item._id} post={item} />
                            ))
                        }
                    </div>

            </div>
            </div>

            <div></div>

        </div>
    )
}

export default Post
