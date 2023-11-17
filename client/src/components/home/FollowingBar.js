import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from '../UserCard';
import { getAllfollowers } from '../../redux/actions/followersAction';
import MyLoader from '../MyLoader';
import FollowingCard from '../FollowingCard';
import FollowingLoader from '../FollowingLoader';

const FollowingBar = () => {
    const { auth, following } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);




        const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state change after a delay (you can replace this with your actual loading logic)
    useEffect(() => {
        const timeout = setTimeout(() => {
        setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);





    useEffect(() => {

        const handleResize = () => {
        setWindowWidth(window.innerWidth);
        };

        const fetchData = () => {
        if (windowWidth <= 1000) {
            dispatch(getAllfollowers(auth.token));
        }
        };

        window.addEventListener('resize', handleResize);
        fetchData(); // Load data on initial mount

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, [auth.token, dispatch, windowWidth]);

    return (
        <div className="mt-3">

        <div className='folloing-control'>
            <FollowingCard className="user_" user={auth.user} />

            {isLoading.loading ? (
                <FollowingLoader />
            ) : (
                <div className="suggestions" style={{display:"flex"}}>
                {following.users.map((user) => (
                    <FollowingCard key={user._id} user={user} />
                ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default FollowingBar;
