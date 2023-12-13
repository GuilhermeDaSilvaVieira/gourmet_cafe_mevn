const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

async function loadFinalPriceCollection() {
  const client = await mongodb.MongoClient.connect('mongodb+srv://<name>:<password>@cluster0.bkvpb2q.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
  })

  return client.db('gourmet_cafe_db').collection('final_price_collection')
}

router.get('/', async (req, res) => {
  const price = await loadFinalPriceCollection();
  res.send(await price.find({}).toArray())
})

router.put('/:price', async (req,res) => {
  const price = await loadFinalPriceCollection();
  await price.updateOne({_id: new mongodb.ObjectId("656f57fd735e1c6125f39e7a")}, { $inc: {final_price: new mongodb.Double( req.params.price)}})
  res.status(200).send() 
})

router.put('/reset/:price', async (req,res) => {
  const price = await loadFinalPriceCollection();
  await price.updateOne({_id: new mongodb.ObjectId("656f57fd735e1c6125f39e7a")}, { $inc: {final_price: new mongodb.Double( req.params.price)}})
  res.status(200).send() 
})

module.exports = router;
