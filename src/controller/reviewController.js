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

const updateReview = async function(req,res) {
    try {
        const reviewId = req.params.reviewId
        const bookId = req.params.bookId
        if(!reviewId) return res.status(404).send({status : false , message : "Review Id is not found in params"})
        if(!bookId) return res.status(404).send({status : false , message : "Book Id not found in params "})

        if(!ObjectIdCheck(bookId) && (!ObjectIdCheck(reviewId))) return res.status(400).send({status : false , message : "Object ID is invalid"})

        const book = await bookModel.findOne({_id : bookId , isDeleted : false})
        if(!book) return res.status(404).send({status : false , message : "Book not found"})

        const review  = await reviewModel.findONe({_id : reviewId , isDeleted : false})
        if(!review) return res.status(404).send({status : false , message :"Review not found"})

        if(bookId !=review.bookId) return res.status(400).send({status : false , message : "BookId is not valid "})

        const updateReview = await reviewModel.findByIdAndUpdate( 
            reviewId , 
            req.body ,
            {new : true}
        )

        res.status(200).send({status : true , message : "Review updated successfully" , data : updateReview})
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

const deletedReview = async function(req,res) {
    try {
        const reviewId = req.params.reviewId
        const bookId = req.params.bookId
        if(!reviewId || !bookId) return res.status(404).send({status : false , message : "reviewId or BookId is not found in the params"})
        if(!ObjectIdCheck(bookId) && (!ObjectIdCheck(reviewId))) return res.status(400).send({status : false , message : "Object ID is invalid"}) 

        const book = await bookModel.findOne({_id : bookId , isDeleted : false })
        if(!book) return res.status(404).send({status : false , message : "Book does not exist"})
        const review = await reviewModel.findOne({_id : reviewId , isDeleted : false }) 
        if(!review ) return res.status(404).send({status : false, message : "Review not found"})
        if(bookId != review.bookId) return res.status(400).send({status : false , message : "Book Id is not valid"})

        const bookUpdate = await bookModel.findByIdAndUpdate(
            bookId , 
            {$inc : {reviews : -1}} ,
            {new : true}
        )
        const reviewUpdate = await reviewModel.findByIdAndUpdate(
            reviewId ,
            {$set : {isDeleted : true}} ,
            {new : true}
        )
        res.status(200).send({status : true , message : "Review deleted Successfully"})


    } catch(error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {createReview , updateReview , deletedReview}