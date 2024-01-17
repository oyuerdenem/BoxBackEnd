const express = require('express');
const router = express.Router();

const verifyJWT = require('../../middleware/verifyJWT.js');

const SupplyingModel = require("../Supplying/Supplying.model.js");
const SaleModel = require("../Sale/Sale.model.js");
const ProductModel = require("../Product/Product.model.js");


router.get("/", verifyJWT, async (req, res) => {

  /**
   * 1. Борлуулалттай ихтэй бүтээгдэхүүн
   */
  // const salesData = await SaleModel.find({}); // Борлуулалтын мэдээллүүдийг авна.
  // const productIds = salesData.map((sale) => sale.ProductId); // Борлуулалтын мэдээллүүдээс бүтээгдэхүүний мэдээллийг авна.

  // const mostDemandedProduct = productIds.reduce((acc, productId) => {
  //   acc[productId] = (acc[productId] || 0) + 1;
  //   return acc;
  // }, {}); // хамгийн их борлуулагдсан бүтээгдэхүүнийг олно.

  // const mostDemandedProductId = Object.keys(mostDemandedProduct).reduce(
  //   (a, b) => (mostDemandedProduct[a] > mostDemandedProduct[b] ? a : b),
  //   ''
  // ); // хамгийн их борлуулагдсан бүтээгдэхүүний Id авна.

  // const mostDemandedProductData = await ProductModel.findOne({
  //   _id: mostDemandedProductId,
  // });
  // const mostDemandedProductName = mostDemandedProductData ? mostDemandedProductData.Name : ''; // нэрийг авна.

  /**
   *  2. Эрэлттэй бүтээгдэхүүн
   */

  /**
   *  3. Нийт орлого
   */
  const allSales = await SaleModel.find({})
    .then(data => data.map?.(x => x.Price))
    .catch(err => res.json({ success: false, message: `${err}` }))

  const allSalesSum = allSales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  /**
   *  4. Нийт зарлага
   */
  const allSupplying = await SupplyingModel.find({})
    .then(data => data.map?.(x => x.Price))
    .catch(err => res.json({ success: false, message: `${err}` }))

  const allSupplyingSum = allSupplying.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  res.json({
    success: true,
    values: {
      count: [
        {
          today: `Борлуулалт ихтэй ${mostDemandedProductName}`,
          title: `${(saleSum || 0)?.toLocaleString?.()}₮`,
          persent: "+30%",
          icon: 'dollor',
          bnb: "bnb2",
        },
        {
          today: "Эрэлттэй",
          title: `${(saleSum || 0)?.toLocaleString?.()}₮`,
          persent: "+30%",
          icon: 'dollor',
          bnb: "bnb2",
        },
        {
          today: "Нийт орлого",
          title: `${(allSalesSum || 0)?.toLocaleString?.()}₮`,
          persent: "+30%",
          icon: 'dollor',
          bnb: "bnb2",
        },
        {
          today: "Нийт зарлага",
          title: `${(allSupplyingSum || 0)?.toLocaleString?.()}₮`,
          persent: "+30%",
          icon: 'dollor',
          bnb: "bnb2",
        }
      ],
      barchart: [
        {
          Title: "3K",
          user: "Users",
        },
        {
          Title: "2m",
          user: "Clicks",
        },
        {
          Title: "$772",
          user: "Sales",
        },
        {
          Title: "82",
          user: "Items",
        },
      ],
      linechart: []
    }
  })
});

module.exports = router;