const Comment = require('../models/comment-model.js')

class CommentController {
  async getProductComments(req, res) {
    try {
      const productId = req.params.productId
      const comments = await Comment.find({ product: productId })
      res.json(comments)
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Ошибка при получении комментариев товара' })
    }
  }
}
exports.createComment = async (req, res) => {
  try {
    const { productId } = req.params
    const { text } = req.body

    // Проверка, существует ли товар с указанным productId
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    // Создание нового комментария
    const comment = new Comment({
      product: productId,
      author: req.user.userId, // Используйте ID авторизованного пользователя
      text
    })

    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка при создании комментария' })
  }
}
module.exports = new CommentController()
