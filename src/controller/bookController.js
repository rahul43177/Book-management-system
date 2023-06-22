const bookModel = require('../model/bookModel')
const validator = require('validator')
const {ObjectIdCheck} = require('../utils/verification')
const reviewModel = require('../model/reviewModel')
const userModel = require('../model/userModel')

const createBook = async (req,res) =>{
    try {
        const details = req.body.details
        const {title , excerpt , releasedAt , userId , subcategory , category , ISBN} = details

        if(!title || !excerpt || !userId || !subcategory || !category || !ISBN) return res.status(400).send({status : false , message : "All fields are required"})

        if(!ObjectIdCheck(userId)) return res.status(400).send({status : false , message : "UserId is invalid"})
        if(!validator.isISBN(ISBN)) return res.status(400).send({status : false , message : "ISBN is invalid"})

        const titleBook = await bookModel.findOne({title: title})
        if(titleBook) {
            return res.status(400).send({status : false , message : "Title already exists"})
        }
        const user = await userModel.findById(userId) 
        if(!user) return res.status(400).send({status : false , message : "User does not exist"})
        else {
            const isbnBook = await bookModel.findOne({ISBN : ISBN})
            if(isbnBook) return res.status(400).send({status : false , message : "ISBN already exists"})
            else {
                const book = await bookModel.create(details)
                res.status(201).send({status : true , message : "Book created successfully", data : book})
            }
        }
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



const getBooks = async (req,res) => {
    try {
        const books = await bookModel.find({...req.query , isDeleted : false }).sort({name : 1})
        if(books.length == 0) return res.status(400).send({status : false , message : "No books found"})
        res.status(200).send({status : true , message : 'Book List' , data : books})
    } catch(error) {
        res.status(500).send({status : false , error : error.message})
    }
}


const getBooksById =async (req,res) =>{
    try {
        const bookId = req.params.bookId
        if(!ObjectIdCheck(bookId)) return res.status(400).send({status : false , message : "Book Id is invalid"})
        const book = await bookModel.findById(bookId)
        if(!book) return res.status(400).send({status : false , message : "Book does not exist"})
        const reviewData = await reviewModel.find({bookId : bookId , isDeleted : false })
        book.reviewsData = reviewData
        res.status(200).send({status : true , data : book})

    } catch(error) {
        res.status(500).send({status : false , error : error.message})
    }
}

const updateBook = async(req,res) =>{
    let bookId = req.params.bookId
    if(!bookId) return res.status(400).send({status : false , message : "Book id is required"})
    if(ObjectIdCheck(bookId)) return res.status(400).send({status : false , message : "BookId is not valid"})
    const book = await bookModel.findOne({_id : bookId , isDeleted : false})
    if(!book) return res.status(400).send({status : false , message : "Book not found"})
    if(book.userId != req.userId) return res.status(400).send*{status : false , message : "Access Denied"} 
    
    const updateBookDetails = await bookModel.findOneAndUpdate(
        {_id : bookId , isDeleted : false},
        req.body ,
        {new : true}
    )
    res.status(200).send({status : true , message :" Update Book Success" , data : updateBookDetails})

}

const deleteBooksById = async function(req,res) {
    try {   
        const bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status : false , message : "BookId is required"})
        if(!ObjectIdCheck(bookId)) return res.status(400).send({status : false , message : "BookId is not valid"})
        const book = await bookModel.findOne({_id : bookId , isDeleted : false})
        if(!book) return res.status(400).send({status : false , message : "Book does not exist"})
        if(book.userId != req.userId) return res.status(403).send({status : false , message : "Access Denied"})
        
        const deleteBooks = await bookModel.findOneAndUpdate(
            {_id : bookId , isDeleted :false},
            {isDeleted : true , deleteAt : new Date()},
            {new : true}
        )
        res.status(200).send({status : true , message : "Book deleted successfully" , data : deleteBooks})

    } catch(error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ status: false, message: error.message });
        }
        res.status(500).json({ status: false, message: error.message });
    }
}











module.exports = {createBook , getBooks , updateBook , deleteBooksById}