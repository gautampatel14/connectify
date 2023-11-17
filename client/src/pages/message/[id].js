import React, { useEffect,useState} from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'
import Menu from '../../components/header/Menu'


const Conversation = () => {

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



        <div style={{display:"flex"}} className='home row mx-0'>

        {windowWidth <=765? (<></>):( <div className='left-side'>
            <Menu />
        </div>)}


        <div style={{}} className='message-control'>
            <div className="message d-flex">
                <div className="col-md-4 border-right px-0 left_mess">
                    <LeftSide />
                </div>

                <div className="col-md-8 px-0">
                    <RightSide />
                </div>
            </div>
        </div>

        <div></div>
        
        </div>
    )
}

export default Conversation
