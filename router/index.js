const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')

const authMiddleware = require('../middlewares/auth-middleware')
const userController = require('../controllers/user-controller')
const Product = require('../models/product-model')
const Comment = require('../models/comment-model')

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error('Error in get data', error)
    res.status(500).json({ message: 'Error in get data' })
  }
})
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id
  try {
    const product = await Product.findOne({ id: productId }).exec()
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(200).json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search Error' })
  }
})
router.get('/products/:productId/comments', async (req, res) => {
  const productId = req.params.productId

  try {
    const comments = await Comment.find({ product: productId })

    res.status(200).json(comments)
  } catch (error) {
    console.error('Error getting comments', error)
    res.status(500).json({ message: 'Error getting comments' })
  }
})
router.post(
  '/products/:productId/comments',
  authMiddleware,
  async (req, res) => {
    console.log(req.body)
    const productId = req.params.productId
    const userId = req.user.id

    try {
      const { text, rating } = req.body

      const comment = new Comment({
        product: productId,
        authorID: userId,
        text,
        rating
      })
      await comment.save()
      res.status(201).json(comment)
    } catch (error) {
      console.error('Error creating comment', error)
      res.status(500).json({ message: 'Error creating comment' })
    }
  }
)

module.exports = router
