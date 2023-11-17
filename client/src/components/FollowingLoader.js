import React from 'react';
import ContentLoader from 'react-content-loader';

const FollowingLoader = () => (
    <ContentLoader
        speed={2}
        width={100}
        height={100}
        viewBox="0 0 100 100"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        {/* Circle */}
        <circle cx="50" cy="50" r="40" />
    </ContentLoader>
);

export default FollowingLoader;
