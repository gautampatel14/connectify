import {React,useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteAccount, logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import NotifyModal from '../NotifyModal'
import '../../styles/left.css'
import { useAlert } from 'react-alert'
import ConfirmationDialog from '../ConfirmationDialog'
// import Status from '../home/Status'

const Menu = () => {



    const navLinks = [

        { label: 'Home', icon: 'home', path: '/'},
        { label: 'Message', icon: 'near_me', path: '/message'},
        { label: 'Explore', icon: 'explore', path: '/discover'},
    ]

    const { auth, theme, notify } = useSelector(state => state)
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const alert = useAlert(); // Use the useAlert hook

    

    const isActive = (pn) => {

        if(pn === pathname) return 'active'
    }


    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const handleDeleteAccount = () => {
        setIsConfirmationOpen(true);
    };

    const confirmDeleteAccount = () => {
    try {
        dispatch(deleteAccount(auth.user._id));
        alert.success('Your account has been deleted.');
        dispatch(logout());
    } catch (err) {
        console.error(err);
    }
    setIsConfirmationOpen(false);
    };

    const cancelDeleteAccount = () => {
        setIsConfirmationOpen(false);
    };


    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                {
                    navLinks.map((link, index) => (
                        <li className={`nav-item ${isActive(link.path)} ${link.label}`} key={index} style={{marginTop:"1.2rem"}}>
                            <Link className="nav-link" to={link.path}>
                                <div style={{display:'flex'}}>
                                    <span className='material-icons' style={{fontSize:"1.5rem"}}>{link.icon}</span>
                                    <span className="ml-2 label-name active" style={{color:"black",fontSize:"1.2rem"}}>{link.label}</span>
                                </div>
                            </Link>
                        </li>
                        
                    ))
                }

                <li className='nav-item' style={{marginTop:"1.2rem"}}>
                
                    <span className='nav-link position-relative'>

                        <div style={{display:"flex"}} className='menu-create' onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>

                            <span className='material-icons' style={{fontSize:"1.5rem"}} >
                                
                                {'add_circle'} 
                            
                            </span>
                            <span className="ml-2 label-name active" style={{color:"black",fontSize:"1.2rem"}}>Create</span>
                        </div>

                    </span>
                </li>

                <li className="nav-item dropdown" style={{opacity: 1,marginTop:"1.25rem"}}  >
                    <span className="nav-link position-relative" id="navbarDropdown" 
                    role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                        <span className="material-icons" 
                        style={{color: notify.data.length > 0 ? 'crimson' : '',fontSize:"1.25rem"}}>
                            favorite
                        </span>

                        <span className="notify_length">{notify.data.length}</span>

                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown"
                    style={{transform: 'translateX(75px)'}}>
                        <NotifyModal />
                    </div>
                        
                </li>

            
                <li className="nav-item dropdown" style={{opacity: 1,marginTop:"1.25rem"}} >
                    <span className="nav-link dropdown-toggle" id="navbarDropdown" 
                    role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>

                    {/* <label htmlFor="theme" className="dropdown-item"
                    onClick={() => dispatch({
                        type: GLOBALTYPES.THEME, payload: !theme
                    })}>

                        {theme ? 'Light mode' : 'Dark mode'}
                    </label> */}

                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/"
                    onClick={() => dispatch(logout())}>
                        Logout
                    </Link>

                    <div
                    className="dropdown-item text-danger"
                    onClick={handleDeleteAccount}
                    >
                    Delete Account
                    </div>

                    <ConfirmationDialog
                    isOpen={isConfirmationOpen}
                    onRequestClose={cancelDeleteAccount}
                    onConfirm={confirmDeleteAccount}
                    />
                
                </div>
            </li>
        </ul>
    </div>

    )
}

export default Menu
