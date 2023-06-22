const jwt = require('jsonwebtoken')


const authentication = function(req,res,next) {
    try {
        const token = req.header['x-api-key']
        if(!token) return res.status(401).send({status : fasle , message : "Unauthorised "})

        const decoded = jwt.verify(token , "rahul4317")
        req.userId = decoded.userId
        next()
    } catch(error) {
        res.status(500).send({status : false , error : error.message })
    }
}

module.exports = {authentication}