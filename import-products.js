const mongoose = require('mongoose')
const productsData = require('./productData')
const Product = require('./models/product-model')
require('dotenv').config()

const DB_URL = process.env.DB_URL

const start = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    for (const productData of productsData) {
      const product = new Product(productData)
      await product.save()
      console.log(`Товар "${product.title}" добавлен в базу данных.`)
    }

    console.log('Импорт завершен.')
  } catch (error) {
    console.error('Ошибка при добавлении товаров в базу данных:', error)
  } finally {
    mongoose.disconnect()
  }
}

start()
