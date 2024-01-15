const express = require('express');
const router = express.Router();

//mongodb
const Warehouse = require('./Warehouse.model');

const MovementModel = require('../Movement/Movement.model');
const SaleModel = require('../Sale/Sale.model');
const SupplyingModel = require('../Supplying/Supplying.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {
  let { Name, Location } = data.body;
  Name = Name.trim();
  Location = Location.trim();

  if (!Name || !Location) {
    return res.json({
      success: false,
      message: "empty input fields."
    })
  }

  const newData = new Warehouse({
    Name,
    Location
  });

  newData.save().then(result => {
    res.json({
      success: true,
      message: "Агуулахын мэдээллийг амжилттай хадгаллаа.",
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
  Warehouse.find().then(data => res.send({
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
      message: "Агуулахын нэр болон байршлын мэдээллийг оруулна."
    })
    return
  }
  Warehouse.findByIdAndUpdate(id, { ...body },
  ).then(data => res.json({
    success: true,
    values: data
  })).catch(err => res.json({
    success: false,
    message: "Агуулахын мэдээллийг шинэчлэх үед алдаа гарлаа."
  }))
});

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  const id = req.params.id;

  const isUsedWarehousetInSupplying = await SupplyingModel.findOne({ WarehouseId: id });
  const isUsedWarehouseInMovement = await MovementModel.findOne({ WarehouseId: id });
  const isUsedWarehousetInSale = await SaleModel.findOne({ WarehouseId: id });

  if (isUsedWarehousetInSupplying || isUsedWarehouseInMovement || isUsedWarehousetInSale) {
    return res.json({
      success: false,
      message: "Уг агуулахын мэдээллийг устгах боломжгүй байна."
    })
  }

  const DeletedData = await Warehouse.findByIdAndDelete(id);
  console.log(DeletedData);
  if (DeletedData) {
    res.json({
      success: true,
      message: "Агуулахын мэдээллийг амжилттай устгалаа.",
      data: DeletedData
    })
  } else {
    res.json({
      success: false,
      message: err.message || err
    })
  }
})

module.exports = router;