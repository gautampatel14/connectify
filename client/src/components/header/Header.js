import React, { useEffect,useState} from 'react'
import { Link, useLocation } from 'react-router-dom';
import Search from './Search'
// import Logo1 from '../../images/logo-transp.png'
// import Menu from './Menu'

const Header = () => {


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { pathname } = useLocation();

    useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);


    const renderMessageLink = () => {

    if (pathname.includes('/profile') || pathname.includes('/message') || pathname.includes('/post') || pathname.includes('/discover')) {

        return (
            <Link to={'/'} className='go_back_link nav-link '>
            <div style={{ display: 'flex' }}>
                <span className='material-icons' style={{ fontSize: '1.5rem', color: 'black' }}>
                arrow_back
                </span>
            </div>
            </Link>
        );
        } else {
        return (
            <Link className='nav-link' to={'message'}>
            <div style={{ display: 'flex' }}>
                <span className='material-icons' style={{ fontSize: '1.5rem', color: 'black' }}>
                near_me
                </span>
            </div>
            </Link>
        );
        }
    };


    return (
        <div className="header bg-light">

            <nav className="navbar navbar-expand-lg navbar-light 
            bg-light align-middle">

                <Link to="/" className="logo">
                    <div className="navbar-brand  p-0 m-0 header-h1"
                    onClick={() => window.scrollTo({top: 0})}>

                        {/* <img src={`${Logo1}`}  style={{height:"100px",width:"100px"}} />  */}
                        <span className='custom-span' style={{fontWeight:"600",fontSize:"1.35rem"}}>C</span>
                        <span className='header-text'>Connectify</span>
                    </div>
                </Link>

                <div>
                    <Search />
                </div>

                {windowWidth <= 765 ? (

                    // Render the or Message/Go Back link based on the condition
                    <>{renderMessageLink()}</>
                    ) : (
                        <div></div>
                    )
                }

            {/* {windowWidth <=765? (<><div>
                    <Link className="nav-link" to={'message'}>
                                <div style={{display:'flex'}}>
                                    <span className='material-icons' style={{fontSize:"1.5rem",color:"black"}}>{`near_me`}</span>
                                </div>
                    </Link>
                </div></>):(<div></div>)} */}

            

            </nav>
        </div>
    )
}

export default Header
