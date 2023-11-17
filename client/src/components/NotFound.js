import React from 'react'
import notfound from '../assets/notfond.svg'
import '../styles/pagenotfound.css'
import { Link } from "react-router-dom";

const NotFound = () => {
    return (

        <div className="nopost page-not-found" style={{height:"91vh"}}>

            <div>

                <div style={{display:"flex",justifyContent:"space-around",marginBottom:"7vh"}}>

                    <img className='not-found-svg' style={{width:"20rem",height:"auto"}} src={notfound} alt='No_Save' />

                </div>

                <h4 style={{fontWeight:"500",textAlign:"center"}}>
                    Somthing went wrong ! please go to your home page
                </h4>

                
                <div className="exp-div">

                    <Link
                    to="/home"
                    className="discover-link text-lg rounded-lg text-white py-1 px-4 m-4"
                    style={{display:"flex"}}
                > 
                    <span style={{fontSize:"1.3rem"}}>Goback</span>
                </Link>
                
                </div>
            </div>
        </div>
    )
}

export default NotFound
