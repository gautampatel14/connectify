import React, { useEffect,useState} from 'react'

import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import RightSideBar from '../components/home/RightSideBar'

import { useSelector } from 'react-redux'
import MyLoader from '../components/MyLoader'
import Menu from '../components/header/Menu'

import { Nopost } from '../components/empty_pages/nopost'
import FollowingBar from '../components/home/FollowingBar'




let scroll = 0;

const Home = () => {


const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);



    const { homePosts } = useSelector(state => state)

    window.addEventListener('scroll', () => {
        if(window.location.pathname === '/'){
            scroll = window.pageYOffset
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({top: scroll, behavior: 'smooth'})
        }, 100)
    },[])





    return (

        <div className="home row mx-0">

            <div className="left-side">
                <Menu />
            </div>

            <div className='middle-part with-custom-scrollbar'>



                <div className='control-div'>

                    {windowWidth <=1000? (<div className='top_bar'><FollowingBar /></div>):(<></>)}
                    
                    <div className=''>
                        <Status />
                    </div>

                    <div className='post-controller'>
                        {
                            homePosts.loading 
                            ? <MyLoader/>
                            : (homePosts.result === 0 && homePosts.posts.length === 0)
                                ? <Nopost />
                                : <Posts />
                        }
                    </div>
                </div>

            </div>

                {windowWidth <=765? (<></>):(<div className='righ-sidebar'><RightSideBar/></div>)}
            
        </div>
    )
}

export default Home
