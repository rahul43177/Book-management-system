const express = require('express')
const router = express.Router()
const {createBook , getBooks , updateBook ,getBooksById , deleteBooksById }= require('../controller/bookController')
const {userRegister , userLogin} = require('../controller/userController')
const {createReview , updateReview , deletedReview} = require('../controller/reviewController')
const {authentication} = require('../middleware/authMiddleware')


//====================user routes====================
router.post('/register' , userRegister)
router.post('/login' , userLogin)
//====================Book Routes==================
router.post('/books', authentication, createBook)
router.get('/books', authentication, getBooks)
router.get('/books/:bookId', authentication, getBooksById)
router.put('/books/:bookId', authentication, updateBook)
router.delete('/books/:bookId', authentication, deleteBooksById)
//================== Review routes====================
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deletedReview)







module.exports = router