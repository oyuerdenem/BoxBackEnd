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

  const result = await SaleModel.aggregate([
    {
      $group: {
        _id: "$ProductId",
        howMany: { $sum: "$Quantity" },
        howMuch: { $sum: "$Price" }
      }
    },
    {
      $sort: { howMany: -1 } // Sort in descending order
    }
  ]);

  const maxQty = result[0]?.howMuch;
  const maxId = result[0]?._id;

  const maxProduct = await ProductModel.aggregate([
    {
      $match: {
        _id: maxId
      }
    },
    {
      $project: {
        name: "$Name"
      }
    }
  ]);

  /**
   *  2. Борлуулалт багатай бүтээгдэхүүн
   */
  const minQty = result[result.length - 1]?.howMuch;
  const minId = result[result.length - 1]?._id;

  const minProduct = await ProductModel.aggregate([
    {
      $match: {
        _id: minId
      }
    },
    {
      $project: {
        name: "$Name"
      }
    }
  ]);

  // console.log(minProduct[0].name);
  // console.log(minQty);
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

  /**
   * Диаграмм 1, Орлого, өдрөөр
   */
  const CountingWarehouse = await SaleModel.aggregate([
    {
      $group: {
        _id: {
          dateToString: {
            format: "%Y-%M-%D",
            date: "$DateAt"
          }
        },
        count: { $count: {} }
      }
    }
  ])
  // console.log(CountingWarehouse.length); // how many warehouses

  const CountingStore = await SaleModel.aggregate([
    {
      $group: {
        _id: "$StoreId",
        count: { $count: {} }
      }
    }
  ])
  // console.log(CountingStore.length); // how many stores

  const CountingProduct = await SaleModel.aggregate([
    {
      $group: {
        _id: "$ProductId",
        count: { $count: {} }
      }
    }
  ])
  // console.log(CountingProduct.length); // how many stores

  const TotalAmount = await SaleModel.aggregate([
    {
      $group: {
        _id: null,
        sum: { $sum: "$Price" }
      }
    }
  ])
  // console.log(TotalAmount[0].sum); 

  /**
   * Group by day
   */
  // const Lists = await SaleModel.aggregate([
  //   {
  //     $group: {
  //       _id: {
  //         year: { $year: "$DateAt" },
  //         month: { $month: "$DateAt" },
  //         day: { $dayOfMonth: "$DateAt" }
  //       },
  //       TotalAmount: { $sum: "$Price" }
  //     }
  //   }
  // ]);

  /**
   * Group by Products
   */
  const Lists = await SaleModel.aggregate([
    {
      $group: {
        _id: "$ProductId",
        TotalAmount: { $sum: "$Price" }
      }
    }
  ]);
  const yCategories = Lists?.slice(0, 8).map(item => item?.TotalAmount) || [];

  const productIds = Lists.map(item => item._id);
  const Names = await ProductModel.aggregate([
    {
      $match: {
        _id: { $in: productIds }
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$Name" } // Assuming you want to get the name from the first matching document
      }
    }
  ]);  
  const xCategories = Names?.slice(0, 8).map(item => item?.name) || [];

  /**
   * Орлого, зарлага харуулах
   */

  res.json({
    success: true,
    values: {
      count: [
        {
          today: `Борлуулалт ихтэй`,
          title: ` ${maxProduct[0].name}`,
          // persent: `💸 ${(maxQty || 0)?.toLocaleString?.()}₮`,
          icon: `RiseOutlined`,
          bnb: "bnb2",
        },
        {
          today: "Борлуулалт багатай",
          title: `${minProduct[0].name}`,
          // persent: `💸 ${(minQty || 0)?.toLocaleString?.()}₮`,
          icon: 'FallOutlined',
          bnb: "bnb2",
        },
        {
          today: "Нийт орлого",
          title: `${(allSalesSum || 0)?.toLocaleString?.()}₮`,
          // persent: "+30%",
          icon: 'AreaChartOutlined',
          bnb: "bnb2",
        },
        {
          today: "Нийт зарлага",
          title: `${(allSupplyingSum || 0)?.toLocaleString?.()}₮`,
          // persent: "+30%",
          icon: 'DotChartOutlined',
          bnb: "bnb2",
        }
      ],
      barchart: {
        items: [
          {
            Title: `${CountingWarehouse.length}`,
            user: "Агуулах",
          },
          {
            Title: `${CountingStore.length}`,
            user: "Дэлгүүр",
          },
          {
            Title: `${CountingProduct.length}ш  `,
            user: "Бараа",
          },
          {
            Title: `${(TotalAmount[0].sum || 0)?.toLocaleString?.()}₮`,
            user: "Орлого",
          },
        ],
        series: [
          {
            name: "Sales",
            data: yCategories,
            color: "#fff",
          },
        ],
        options: {
          chart: {
            type: "bar",
            width: "100%",
            height: "auto",

            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              borderRadius: 5,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 1,
            colors: ["transparent"],
          },
          grid: {
            show: true,
            borderColor: "#ccc",
            strokeDashArray: 2,
          },
          xaxis: {
            categories: xCategories,
            labels: {
              show: true,
              align: "right",
              minWidth: 0,
              maxWidth: 160,
              style: {
                colors: [
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                ],
              },
            },
          },
          yaxis: {
            labels: {
              show: true,
              align: "right",
              minWidth: 0,
              maxWidth: 160,
              style: {
                colors: [
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                  "#fff",
                ],
              },
            },
          }
        },
      },
      linechart: {
          series: [
            {
              name: "Орлого",
              data: [350, 40, 300, 220, 500, 250, 400, 230, 500],
              offsetY: 0,
            },
            {
              name: "Зарлага",
              data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
              offsetY: 0,
            },
          ],
        
          options: {
            chart: {
              width: "100%",
              height: 350,
              type: "area",
              toolbar: {
                show: false,
              },
            },
        
            legend: {
              show: false,
            },
        
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
            },
        
            yaxis: {
              labels: {
                style: {
                  fontSize: "14px",
                  fontWeight: 600,
                  colors: ["#8c8c8c"],
                },
              },
            },
        
            xaxis: {
              labels: {
                style: {
                  fontSize: "14px",
                  fontWeight: 600,
                  colors: [
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                    "#8c8c8c",
                  ],
                },
              },
              categories: [
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
              ],
            }
          }
      }
    }
  })
});

module.exports = router;