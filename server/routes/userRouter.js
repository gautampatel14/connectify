const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require("../controllers/userCtrl")
const authCtrl = require('../controllers/authCtrl')
const express = require('express')


router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)

router.patch('/user', auth, userCtrl.updateUser)

router.patch('/user/:id/follow', auth, userCtrl.follow)

router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)

router.get('/getAllfollowers',auth,userCtrl.getAllfollowers)



// router.post('/user/:id/verification', auth, userCtrl.verification);

router.post('/user/:id/create-checkout-session', auth, userCtrl.create_checkout);

router.post('/user/webhook',express.raw({type: 'application/json'}), userCtrl.getVerified);


// const stripe = require('stripe')('sk_test_51Ns4h8SAkofUcsoWdrX999df90oavKcAk5UPuVAGLGmLy4OV0itBofwzibjaWR2hOkBOZRV3cBO7anxNXPEQxFHw00BMNswvCD');

//   ******************************************************************************* //
// let endpointSecret ;

// endpointSecret = "whsec_2ebb1fbaf2c7450fc1bc2e8faf16b3350706dae8dad2806765ab50516df296d3";


// router.post('/user/webhook', express.raw({type: 'application/json'}), (request, response) => {



//     let data;
//     let eventType;
    

//     if(endpointSecret){

//         let event;
        
//         try {
//             event = stripe.webhooks.constructEvent(
            
//                     request.body,
//                     sig, 
//                     endpointSecret
                    
//                 );
//         } catch (err) {

//             console.log(`Webhook Erro : ${err.message}`);
//             response.status(400).send(`Webhook Error: ${err.message}`);
//             return;
//         }
        
//         data = event.data.object;
//         eventType = event.type;



//     }else{

//         data = request.body.data.object;
//         eventType = request.body.type

//     }

//     if(eventType === "checkout.session.completed"){

        
//     }

//     // Handle the event
//     // switch (event.type) {
//     //     case 'payment_intent.succeeded':
//     //     const paymentIntentSucceeded = event.data.object;
//     //     // Then define and call a function to handle the event payment_intent.succeeded
//     //     break;
//     //     // ... handle other event types
//     //     default:
//     //     console.log(`Unhandled event type ${event.type}`);
//     // }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send().end();
// });





module.exports = router