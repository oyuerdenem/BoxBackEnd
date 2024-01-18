const express = require('express');
const router = express.Router();

//mongodb
const Product = require('./Product.model');

const MovementModel = require('../Movement/Movement.model');
const SaleModel = require('../Sale/Sale.model');
const SupplyingModel = require('../Supplying/Supplying.model');

const verifyJWT = require('../../middleware/verifyJWT');
// const { verify } = require('jsonwebtoken');

/**
 * Create Product
 */
router.post('/', verifyJWT, async (data, res) => {
  let { Name, Price, Image } = data.body;

  if (!Name || !Price || !Image) {
    return res.json({
      success: false,
      message: "Хоосон мэдээлэл оруулсан тул алдаа гарлаа."
    })
  }

  const newProduct = new Product({ 
    Name, Price, Image
  });

  newProduct.save().then(result => {
    res.json({
      success: true,
      message: "Барааны мэдээллийг амжилттай хадгаллаа.",
      data: result
    })
  }).catch(err => res.json({
    success: false,
    message: err
  }))
})

/**
 * Read
 */
router.get('/', verifyJWT, async (req, res) => {
  Product.find().then(data => res.send({
    success: true, values: data
  })).catch(err => res.send({
    success: false,
    values: [],
    message: err.message || err
  }))
})


/**
 * Update
 */
router.put('/:id', verifyJWT, (req, res) => {
  const id = req.params.id;
  const { Name, Price, Image } = req.body;

  if (!Name && !Price && !Image) {
    return res.json({
      success: false,
      message: err.message || err
    })
  }

  Product.findByIdAndUpdate(id,
    { Name, Price, Image },
  ).then(data => res.json({
    success: true,
    message: "Барааны мэдээллийг амжилттай шинэчлэлээ.",
    values: data
  })).catch(err => res.json({
    success: false,
    message: "Барааны мэдээллийг шинэчилж чадсангүй."
  }))
})

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;

    const isUsedProductInSupplying = await SupplyingModel.findOne({ ProductId: id });
    const isUsedProductInMovement = await MovementModel.findOne({ ProductId: id });
    const isUsedProductInSale = await SaleModel.findOne({ ProductId: id });

    if (isUsedProductInSupplying || isUsedProductInMovement || isUsedProductInSale) {
      return res.json({
        success: false,
        message: "Уг барааг устгах боломжгүй байна."
      })
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
      res.json({
        success: true,
        message: "Барааг амжилттай устгалаа",
        data: deletedProduct
      })
    } else {
      res.json({
        success: false,
        message: err.message || err
      })
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: err.message || err
    })
  }
})

module.exports = router;