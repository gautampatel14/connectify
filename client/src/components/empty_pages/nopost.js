import React from "react";
import { Link } from "react-router-dom";

import noLike from '../../assets/emptyPages/likingNow.svg'
export const Nopost = () => {
  
  return (

    <div className="nopost">

        <div>

            <div style={{display:"flex",justifyContent:"space-around",marginBottom:"7vh"}}>

                <img style={{width:"20rem",height:"auto"}} src={noLike} alt='No_Save' />

            </div>

              <h4 style={{fontWeight:"500",textAlign:"center"}}>
                  No posts yet. Start sharing your creations & follow other people to see their amazing posts!!
              </h4>

              
              <div className="exp-div">

                <Link
                to="./discover"
                className="discover-link text-lg rounded-lg text-white py-1 px-4 m-4"
                style={{display:"flex"}}
              > 
                <span style={{fontSize:"1.3rem"}}>Explore</span>
              </Link>
              
              </div>
        </div>
    </div>
  );
  
};