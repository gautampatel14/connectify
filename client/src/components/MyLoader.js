import React from 'react';
import '../styles/loader.css'

import {Audio,Puff,Circles,Dna} from 'react-loader-spinner'
import { Instagram } from 'react-content-loader';
import { HashLoader } from 'react-spinners';
import {ClipLoader} from 'react-spinners';

const MyLoader = () => {
  return (
    // <Instagram /> 

    // <div style={{display:"flex",justifyContent:"space-around"}}>
    
    //   <HashLoader color='#dc2f02' style={{marginTop:"10vh"}}/>
      
    // </div>
    <div style={{display:"flex",justifyContent:"space-around",marginTop:"10vh"}} >
            <ClipLoader color="#d63638"  />
    </div>
  );
};

export default MyLoader;
