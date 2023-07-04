const userModel = require('../model/userModel')
const validator = require('validator')
const {titleCheck , passwordCheck , ratingRange} = require('../utils/validations')
const jwt = require('jsonwebtoken')


const userRegister = async (req,res)=>{
    try {
        const details = req.body
        const {title , name , phone , email , password} = details //destructuring
        if(!title || !name || !phone || !email || !password) {
            return res.status(400).send({status : false , message : "Please fill all the fields"})
        }
        if(!validator.isEmail(email)) return res.status(400).send({status : false , message : "Please enter valid email"})

        if(!titleCheck(title)) return res.status(400).send({status : false , message : "Please enter valid title"})
        if(!passwordCheck(password)) return res.status(400).send({status : false , message : "Please enter a valid password whose length is between 8 and 15"})
        if(!validator.isMobilePhone(phone)) return res.status(400).send({status : false , message : "Please enter valid phone number"})

        const userPhone = await userModel.findOne({phone : phone})
        if(userPhone) return res.status(400).send({status : false , message : "Phone number already exists"})
        else {
            const user = await userModel.findOne({email : email})
            if(user) return res.status(400).send({status : false , message : "Email already exists"})
            else {
                const newUser = await userModel.create(details)
                return res.status(200).send({status : true , message : "User registered successfully", data : newUser})
            }
        }






    } catch(error) {
        console.log(error)
        res.status(500).send({status : false , error : error.message})
    }
}



const userLogin  = async function(req, res) {
    try {
        let credentials  = req.body
        let {email , password } = credentials
        if(!email || !password) {
            return res.status(400).send({status : false , message : 'Please fill all the fields'})
        }

        const user = await userModel.findOne({email : email})
        if(!user) {
            return res.status(401).send({status : false , message : "User not found"})
        }
        const token = jwt.sign({userId : user._id}, "rahul4317")
        res.setHeader('x-api-key',token)
        return res.status(200).send({status : true , data : {token : token}})
    } catch(error) {
        res.status(500).send({status : false , error : error.message})
    }
}


module.exports = {userRegister , userLogin }