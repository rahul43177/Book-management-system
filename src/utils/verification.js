const mongoose = require('mongoose')
const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')

const ObjectIdCheck = (Id) => {
    if(mongoose.Types.ObjectId.isValid(Id)) return true
    return false
}
const reviewCheck = async(Id) => {
    const book = await reviewModel.findById(Id) 
    if(book) return true
    return false
}

module.exports = {
    ObjectIdCheck   , reviewCheck
}