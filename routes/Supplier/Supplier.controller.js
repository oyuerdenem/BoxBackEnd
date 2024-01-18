const express = require('express');
const router = express.Router();

//mongodb
const SupplierModel = require('./Supplier.model');
const SupplyingModel = require('../Supplying/Supplying.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {
  let { Name, Location } = data.body;

  const newSupplier = new SupplierModel({
    Name, Location
  });

  newSupplier.save().then(result => {
    res.json({
      success: true,
      message: "Нийлүүлэгчийн мэдээллийг амжилттай хадгаллаа.",
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
  SupplierModel.find().then(data => res.send({
    success: true,
    values: data
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
  const id = req.params?.id;
  const body = {
    Name: req.body?.Name,
    Location: req.body?.Location
  }

  if (!body?.Name && !body?.Location) {
    res.json({
      success: false,
      message: "Нийлүүлэгчийн нэр болон хаягийн мэдээллийг оруулна уу."
    })
    return
  }
  SupplierModel.findByIdAndUpdate(id, { ...body }
  ).then(data => res.json({
    success: true,
    message: "Нийлүүлэгчийн мэдээллийг амжилттай шинэчлэлээ.",
    values: data
  })).catch(err => res.json({
    success: false,
    message: err
  }))
});

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;

    const isUsedSupplying = await SupplyingModel.findOne({ SupplierId: id });

    if (isUsedSupplying) {
      return res.json({
        success: false,
        message: "Уг нийлүүлэгчийн мэдээллийг устгах боломжгүй байна."
      });
    }
    const deletedSupplier = await SupplierModel.findByIdAndDelete(id);

    if (deletedSupplier) {
      res.json({
        success: true,
        message: "Нийлүүлэгчийн мэдээллийг амжилттай устгалаа.",
        data: deletedSupplier
      })
    } else {
      res.json({
        success: false,
        message: err.message || err
      })
    }
  } catch (err) {
    res.json({
      success: false,
      message: err.message || err
    })
  }
})

module.exports = router;