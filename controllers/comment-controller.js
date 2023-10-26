const Comment = require('../models/comment-model.js')

class CommentController {
  async getProductComments(req, res) {
    try {
      const productId = req.params.productId
      const comments = await Comment.find({ product: productId })
      res.json(comments)
    } catch (e) {
      res.status(500).json({ message: 'Error get comments' })
    }
  }
}
exports.createComment = async (req, res) => {
  try {
    const { productId } = req.params
    const { text } = req.body

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const comment = new Comment({
      product: productId,
      author: req.user.userId,
      text
    })

    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error making comment' })
  }
}
module.exports = new CommentController()
