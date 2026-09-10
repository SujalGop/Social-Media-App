import User from "../models/user.model.js"
import bcrypt from 'bcrypt'

// register controller
export const registerUser = async (req, res) =>{
    try{
        const {name , email , password , username} = req.body
        // all fileds present
        // if the email or username already exists
        // password should be greater tha 6 characters

        if(!username || !password || !email || !name){
            return  res.status(400).json({message : "All fields Required"})
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password length should be greater than or equal to 6"})
        }

        const userNameExits = await User.findOne({username})

        if(userNameExits){
            return res.status(409).json({message : "User Already Exists"})
        }

        const emailExits = await User.findOne({email})

        if(emailExits){
            return res.status(409).json({message : "User Already Exists"})
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = User.create({
            name,
            username,
            email,
            password : hashedPassword
        })

        res.status(201).json({message : "User Registered" , user : newUser})



        
    }catch(error){
        res.status(500).json({message : "Internal Server Error" , error : error})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User Not Found Please Register" })
        }

       const passwordCheck = await bcrypt.compare(password, user.password)

        console.log(passwordCheck)

        if (!passwordCheck) {
            return res.status(400).json({ message: "Wrong Password" })
        }


        res.status(200).json({ message: "User Logged IN" })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}