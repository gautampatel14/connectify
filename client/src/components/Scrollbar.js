import React from 'react';

const CustomScrollBarComponent = () => {
    const containerStyle = {
        height: '300px', // Set your desired height
        width: '400px', // Set your desired width
        overflowY: 'scroll',
        position: 'relative',
    };

    const scrollBarStyle = {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '10px', // Set your desired scrollbar width
        height: '100%',
        background: '#eee', // Set your desired background color
        borderRadius: '5px', // Set your desired border radius
    };

    const thumbStyle = {
        width: '100%',
        height: '50px', // Set your desired thumb height
        background: '#888', // Set your desired thumb color
        borderRadius: '5px', // Set your desired thumb border radius
    };

    const customScrollBar = (
        <div style={scrollBarStyle}>
        {/* Thumb */}
        <div style={thumbStyle}></div>
        </div>
    );

    return (
        <div style={containerStyle}>
        {/* Your content goes here */}
        <div>
            {containerStyle.overflowY === 'scroll' && customScrollBar}
        </div>
        </div>
    );
};

export default CustomScrollBarComponent;
