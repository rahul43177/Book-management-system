const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const {ratingRange } = require('../utils/validations')
const {ObjectIdCheck} = require('../utils/verification')


const createReview = async function(req,res) {
    try {
        const bookId = req.params.bookId
        const details = req.body
        const {rating , reviewdAt , reviewedBy } = details
        if(!bookId) return res.status(404).send({status : false , message : "BookId is required"})
        if(!ObjectIdCheck(bookId)) return res.status(400).send({status : false , message : "BookId is invalid"})
        if(!rating || !reviewdAt) return res.status(400).send({status : false , message : "Detais are missing"})
        if(!ratingRange(rating)) return res.status(400).send({status : false , message : "Rating is invalid"})
    

        const checkBook = await bookModel.findOne({_id :bookId , isDeleted : false})
        if(!checkBook) return res.status(404).send({status : false , message : "Book not found"})

        const reviewDetails = {
            rating : rating , 
            bookId : bookId , 
            reviewdAt : reviewdAt ,
        }
        if(req.body.review)  reviewDetails.review = req.body.review
        if(reviewedBy)  reviewDetails.reviewedBy = reviewedBy

        const reviewCreate = await reviewModel.create(reviewDetails)
        const book = await bookModel.findByIdAndUpdate(
            bookId , 
            {$inc : {reviews : 1}} ,
            {new : true}
        )
        book.reviewData = reviewCreate
        res.status(201).send({status : true , message : "Review created successfully" , data : book})



    } catch(error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            res.status(500).json({ status: false, message: error.message })
        }
    }


}







module.exports = {createReview }