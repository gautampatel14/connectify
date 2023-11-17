
import React from 'react'
import noSaved from '../../assets/emptyPages/bookmarkNow.svg'



const no_saved = () => {



    return (

        <div className='nopost_' style={{display:"block",marginTop:"7vh"}}>

        
            <div style={{display:"flex",justifyContent:"space-around"}}>

                <img style={{width:"20rem",height:"auto"}} src={noSaved} alt='No_Save' />

            </div>

            <div style={{marginTop:"4vh"}}>
                <h4 style={{fontWeight:"500",textAlign:"center"}}>
                    Look like there is no posts right now !
                    
                </h4>

            </div>

        </div>
    )
}

export default no_saved