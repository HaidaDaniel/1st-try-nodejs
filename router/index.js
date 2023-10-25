const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator')

const authMiddleware = require('../middlewares/auth-middleware')
const userController = require('../controllers/user-controller')
const Product = require('../models/product-model')

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
    console.error('Ошибка при получении продуктов:', error)
    res
      .status(500)
      .json({ message: 'Произошла ошибка при получении продуктов' })
  }
})

router.get('/products/:id', async (req, res) => {
  const productId = req.params.id

  try {
    const product = await Product.findOne({ id: productId }).exec()

    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден.' })
    }

    res.status(200).json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка при поиске продукта.' })
  }
})

module.exports = router
