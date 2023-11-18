const Users = require('../models/userModel')
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Notifies = require('../models/notifyModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authCtrl = {

    register: async (req, res) => {
        try {

            console.log("Register")
            const { fullname, username, email, password, gender } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')   // remove all space and convert to lowercase

            const user_name = await Users.findOne({username: newUserName}) // before creating new user , check for validity.
            if(user_name) return res.status(400).json({msg: "This user name already exists."})

            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})


            // const salt = await bcrypt.genSalt(12);
            //using salt we can bcrypt the password using genSalt().  but here we direct pass salt as 12.
            //here 12 is amount of how much we want to alter the password by hashing

             //return hashed password
            // const hashedPass = await bcrypt.hash(password, salt);

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname,
                username: newUserName, 
                email, 
                password: passwordHash, 
                gender
            })


            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
                // maxAge:1000
            })

            // console.log(`Refresh token : ${refresh_token}`);

            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) => {
        try {   
             // retriving data from request body
            const { email, password } = req.body


            // Here populate method takes one or more fields to populate and specifies which fields from the related documents to include. In this case, it is populating the "followers" and "following" fields in the "user" document, and for each of these fields, it specifies which fields to include: "avatar," "username," "fullname," "followers," and "following

            const user = await Users.findOne({email})
            .populate("followers following", "avatar username fullname followers following")

            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    generateAccessToken: async (req, res) => {
        try {

            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) return res.status(400).json({msg: "Please login now."})

                const user = await Users.findById(result.id).select("-password")
                .populate('followers following', 'avatar username fullname followers following')

                if(!user) return res.status(400).json({msg: "This does not exist."})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    deleteAccount: async (req, res) => {
    
        try {

            const id = req.params.id;

        
            // const { email, password } = req.body
            // const user = await Users.findById({id})
            // if(!user) return res.status(400).json({msg: "This email does not exist."})
            // const isMatch = await bcrypt.compare(password, user.password)
            // if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
            // const { currentUserId } = req.body;
            // console.log("Currenr Id : "+ currentUserId);
            // console.log("ID : "+ id);
            //  if(currentUserId === id)


            if(id){

                
                res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
                
                const post = await Posts.deleteMany({ user: id})  // deleting post
                await Comments.deleteMany({_id: {$in: post.comments }})
                
                await Users.findByIdAndDelete(id);
                res.status(200).json("User deleted successfully");
                // removing id from list

                const notify = await Notifies.deleteMany({
                    id: id
                })

                await Users.updateMany({_id: id}, { 
                $pull: {followers: id}
                },)

                await Users.updateMany({_id: id}, {
                    $pull: {following: id}
                },)

                // return res.json({msg: "Account Deleted Successfully"})


            }else{
                res.status(403).json("Access Denied! you can only delete your own profile");
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = authCtrl
