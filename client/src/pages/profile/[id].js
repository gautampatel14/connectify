import React, { useEffect, useState } from 'react'
import {BsBox,BsBookmarkPlus} from 'react-icons/bs'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'

import { useSelector, useDispatch } from 'react-redux'
import MyLoader from '../../components/MyLoader'
import { getProfileUsers } from '../../redux/actions/profileAction'
import { useParams } from 'react-router-dom'

import Menu from '../../components/header/Menu'
import RightSideBar from '../../components/home/RightSideBar'

import '../../styles/home.css'


const Profile = () => {

    const { profile, auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, auth}))
        }
    },[id, auth, dispatch, profile.ids])

    return (

        <div className="home row mx-0">

            <div className="left-side">
                <Menu />
            </div>

        <div className="middle-part with-custom-scrollbar">
            
            <div className='control-div'>
            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
            {
                auth.user._id === id &&
                <div className="profile_tab">
                    <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}><BsBox/></button>
                    <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}><BsBookmarkPlus/></button>
                </div>
            }

            {
                profile.loading 
                ? <MyLoader/>
                : <>
                    {
                        saveTab
                        ? <Saved auth={auth} dispatch={dispatch} />
                        : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                    }
                </>
            }
            </div>
            
        </div>

        <div className="righ-sidebar">
                <RightSideBar />
            </div>
        </div>
    )
}

export default Profile


