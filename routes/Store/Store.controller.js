const express = require('express');
const router = express.Router();

//mongodb
const Store = require('./Store.model');

const SaleModel = require('../Sale/Sale.model');

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
      message: "Хоосон утга оруулсан байна."
    })
  }

  const newStore = new Store({
    Name, Location
  });

  newStore.save().then(result => {
    res.json({
      success: true,
      message: "Дэлгүүрийн мэдээллийг амжилттай хадгаллаа.",
      data: result
    })
  }).catch(err => res.json({
    success: false,
    message: err
  }))
});

/**
 * Read
 */
router.get('/', verifyJWT, async (req, res) => {
  Store.find().then(data => res.send({
    success: true, values: data
  })).catch(err => res.send({
    success: false,
    values: [],
    message: err.message || err
  }))
});

/**
 * Update
 */
router.put('/:id', verifyJWT, (req, res) => {
  const id = req.params.id;
  const { Name, Location } = req.body;

  if (!Name && !Location) {
    res.json({
      success: false,
      message: "Дэлгүүрийн нэр болон байршлыг оруулна уу."
    })
    return
  }

  Store.findByIdAndUpdate(id,
    { Name, Location },
  ).then(data => res.json({
    success: true,
    message: "Дэлгүүрийн мэдээллийг амжилттай хадгаллаа.",
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

    const isUsedStore = await SaleModel.findOne({ StoreId: id });

    if (isUsedStore) {
      return res.json({
        success: false,
        message: "Уг дэлгүүрийн мэдээллийг устгах боломжгүй байна."
      });
    }

    const deletedStore = await Store.findByIdAndDelete(id);

    if (deletedStore) {
      res.json({
        success: true,
        message: "Дэлгүүрийн мэдээллийг амжилттай устгалаа.",
        data: deletedStore
      })
    } else {
      res.json({
        success: false,
        message: "Дэлгүүрийн мэдээлэл олдсонгүй."
      })
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Дэлгүүрийн мэдээллийг устгах явцад алдаа гарлаа."
    })
  }
})

module.exports = router;