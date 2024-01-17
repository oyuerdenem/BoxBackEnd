require('dotenv').config();
/**
 * MongoDB
 */
require('./config/db');

const app = require('express')();
const cors = require("cors")
const port = 3000;

/**
 * Routes
 */
const StockRouter = require('./Routes/Stock/Stock.controller');

/** Objects */
const UserRouter = require('./Routes/User/User.controller');
const WarehouseRouter = require('./Routes/Warehouse/Warehouse.controller'); //✅
const ProductRouter = require('./Routes/Product/Product.controller'); //✅
const StoreRouter = require('./Routes/Store/Store.controller'); //✅
const SupplierRouter = require('./Routes/Supplier/Supplier.controller'); //✅

/** Actions */
const SaleRouter = require('./Routes/Sale/Sale.controller'); //✅
const MovementRouter = require('./Routes/Movement/Movement.controller'); //✅
const SupplyingRouter = require('./Routes/Supplying/Supplying.controller');

/** Dashboard */
const DashboardRouter = require('./Routes/Dashboard/Dashboard.Controller');

//for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
app.use(cors());

app.use('/stock', StockRouter)
app.use('/user', UserRouter)
app.use('/warehouse', WarehouseRouter)
app.use('/product', ProductRouter)
app.use('/store', StoreRouter)
app.use('/supplier', SupplierRouter)
app.use('/sale', SaleRouter);
app.use('/movement', MovementRouter)
app.use('/supplying', SupplyingRouter)
app.use("/dashboard", DashboardRouter)

app.listen(port, () => {
  console.log('Server running on port ' + port);
})