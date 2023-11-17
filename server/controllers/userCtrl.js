const Users = require('../models/userModel')
const stripe = require('stripe')('sk_test_51Ns4h8SAkofUcsoWdrX999df90oavKcAk5UPuVAGLGmLy4OV0itBofwzibjaWR2hOkBOZRV3cBO7anxNXPEQxFHw00BMNswvCD');

let endpointSecret ;
let checkoutInfo;


const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, story, website, gender } = req.body
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    suggestionsUser: async (req, res) => {

        try {

            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 10

            const users = await Users.aggregate([
                
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getAllfollowers: async(req,res) =>{

        // try {
        // const userId = req.user._id;

        // // Get all followers for the current user
        // const user = await Users.findById(userId).populate("followers", "_id");

        // if (!user) {
        //     return res.status(400).json({ msg: "User does not exist." });
        // }

        // // Extract follower IDs from the user object
        // const followersArray = user.followers.map(follower => follower._id);

        // console.log(res.json({
        //     followersArray
        // }));

        // return res.json({
        //     followers: followersArray,
        //     result: followersArray.length,
        // });
        // } catch (err) {
        //     return res.status(500).json({ msg: err.message });
        // }

    try {
            const userId = req.user._id;

            const num  = req.query.num || 10
            const users = await Users.aggregate([
                { $match: { _id: userId } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'followingUsers' } },
            ]).project("-password -_id -following");

            // Extract the 'followingUsers' array from the result
            const followingUsers = users.length > 0 ? users[0].followingUsers : [];

            return res.json({
                users: followingUsers,
                result: followingUsers.length,
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    deleteAccount:async (req,res) => {

        try{
            const id = req.params.id;
            const { currentUserId} = req.body;
            
            if(currentUserId === id){

                await UserModel.findByIdAndDelete(id);
                res.status(200).json("User deleted successfully");

            }
        }catch(err){
            return res.status(500).json({msg: err.message})
        }

    },


    create_checkout: async(req,res) =>{


        try{

            const {product} = await req.body;
            const {id} = req.params

            const customer = await stripe.customers.create({

                metadata:{
                    userId:id,
                    product:JSON.stringify(product)
                }
            })


            console.log(` PRODUCT : ${product}`)

            const session = await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                line_items: [
                        {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                            name:product.name,
                            },
                            unit_amount: product.price * 100, // Adjust the amount as needed
                        },
                        quantity: 1,
                        },
                ],
                mode:"payment",
                customer:customer.id,
                success_url:`http://localhost:3000/profile/${id}`,
                cancel_url:`http://localhost:3000/profile/${id}`,
            });
    
            checkoutInfo = { id: session.id, customer };


            return res.json({id: session.id, customer})

        }catch(err){
            
            console.log(err);
                res.status(500).send({ error: 'Server error' });
        }
    },
    

    getVerified: async (request,response) =>{

        try {

            let data;
            let eventType;
            

            if(endpointSecret){

                let event;
                
                try {
                    event = stripe.webhooks.constructEvent(
                    
                            request.body,
                            sig, 
                            endpointSecret
                            
                        );
                } catch (err) {

                    console.log(`Webhook Erro : ${err.message}`);
                    response.status(400).send(`Webhook Error: ${err.message}`);
                    return;
                }
                
                data = event.data.object;
                eventType = event.type;



        }else{

            data = request.body.data.object;
            eventType = request.body.type

        }

        if(eventType === "checkout.session.completed"){

            console.log("Done");
            
        
            // console.log(checkoutInfo);

            const userId = checkoutInfo?.customer?.metadata?.userId;
            console.log("User ID:", userId);
            const cid = checkoutInfo?.customer?.id;

            const updatedUser = await Users.findByIdAndUpdate(
                userId,
                {
                    verified: true,
                    customerId: cid,
                },
                { new: true } // Return the updated user document
            );

            return response.status(200).json({
                msg: 'Payment and user verification successful.',
                // paymentId: paymentIntent.id,
                verified: updatedUser.verified,
            });
        }

        response.send().end();

            } catch (error) {

                console.error(error);
                return response.status(500).json({ error: 'Error processing payment and verifying user.' });
            
            }
        
    },


}


module.exports = userCtrl








    // getVerify: async (req,res) =>{
    //     try {

    //         const { id } = req.params;
    //         const session = await stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         line_items: [
    //             {
    //             price_data: {
    //                 currency: 'usd',
    //                 product_data: {
    //                 name: 'Your Product',
    //                 },
    //                 unit_amount: 999, // Adjust the amount as needed
    //             },
    //             quantity: 1,
    //             },
    //         ],
    //     mode: 'payment',
    //     success_url: `http://localhost:3000/${id}`, // Redirect to success page
    //     cancel_url: `http://localhost:3000/${id}`, // Redirect to cancel page
    //     });

    //     res.json({ id: session.id });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ error: 'Server error' });
    // };

    // },

    // verification:async(req,res)=>{

    //     try{

    //         const { id } = await req.params;

    //         const {token,product} = await req.body

    //         console.log(`Id : ${id}`);

    //         console.log(`Token : ${token}`);
            
    //         console.log(`Product : ${product}`);

            
    //         const customer = await stripe.customers.create({
    //         email: token.email,
    //         source: token.id
            
    //         })

    //         const paymentIntent = await stripe.paymentIntents.create({
                
    //         amount:999 * 100,
    //         currency:'inr',
    //         payment_method_types: ['card'],
    //         confirm:true,
    //         customer:customer.id,
    //         payment_method:token.card.id,
        
    //     });


    //     const clientSecret = paymentIntent.client_secret;
            // const key = uuid()
        

            //     const charge = await stripe.charges.create({
            //     amount: product.price * 1000,
            //     currency: "usd",
            //     customer: customer.id,
            //     receipt_email: token.email,
            //     description: `Purchase the ${product.name}`,
            //     shipping: {
            //         name: token.card.name,
            //         address: {
            //             line1: token.card.address_line1,
            //             line2: token.card.address_line2,
            //             city: token.card.address_city,
            //             country: token.card.address_country,
            //             postal_code: token.card.address_zip,
            //         },
            //     },
            // }, {
            //     idempotencyKey:key,
            // });


            // console.log(charge)

            // status="success"

    //         if(paymentIntent){
    //                 const updatedUser = await Users.findByIdAndUpdate(
    //                 id,
    //                 {
    //                     verified: true,
    //                     paymentId: token.id,
    //                 },
    //                 { new: true } // Return the updated user document
    //                 );

    //                 return res.status(200).json({
    //                 msg: 'Payment and user verification successful.',
    //                 verified: updatedUser.verified,
    //                 clientSecret,
    //             });
    //         }else{
    //             res.send({msg:"payment-faild"})
    //         }

    //         return res.status(200).json({
    //                 msg: 'Payment and user verification successful.',
    //                 verified: true,
    //                 clientSecret,
    //             });

    //     }catch(err){

    //         console.log(err);
    //         res.status(500).send({ error: 'Server error' });
    //     }
    // },


