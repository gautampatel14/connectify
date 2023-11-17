import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscoverPosts, DISCOVER_TYPES } from '../redux/actions/discoverAction'
import PostThumb from '../components/PostThumb'
import MyLoader from '../components/MyLoader'
import LoadMoreBtn from '../components/LoadMoreBtn'
import { getDataAPI} from '../utils/fetchData'

import Menu from '../components/header/Menu'
import RightSideBar from '../components/home/RightSideBar'


let scroll = 0;



const Discover = () => {



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


    const { auth, discover } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(!discover.firstLoad){
            dispatch(getDiscoverPosts(auth.token))
        }
    },[dispatch, auth.token, discover.firstLoad])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`post_discover?num=${discover.page * 9}`, auth.token)
        dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
        setLoad(false)
    }

    
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



    return (

        <div className='home row mx-0'>

            <div className="left-side">
                <Menu />
            </div>

            <div className='discover-part  with-custom-scrollbar'>

                <div className='discover-control'>

                    {/* {windowWidth <=1000? (<div className='top_bar'><RightSideBar /></div>):(<></>)} */}

                    {
                        discover.loading 
                        ? <MyLoader/>
                        : <PostThumb posts={discover.posts} result={discover.result} />
                    }

                    {
                        load && <MyLoader/>
                    }

                    {
                        !discover.loading &&
                        <LoadMoreBtn result={discover.result} page={discover.page}
                        load={load} handleLoadMore={handleLoadMore} />
                    }
                    
                </div>

            </div>

        </div>
    )
}

export default Discover
