require('dotenv').config();
//mongodb
require('./config/db');

const app = require('express')();
const cors = require("cors")
const port = 3000;

const UserRouter = require('./routes/User/User.controller');
//1.9
const StoreRouter = require('./routes/Дэлгүүр/store.controller');
const StorageRouter = require('./routes/Агуулах/storage.controller');
// 1.10
const ProductRouter = require('./routes/Бараа/product.controller');
const SupplierRouter = require('./routes/Нийлүүлэгч/supplier.controller');
const MovementRouter = require('./routes/Хөдөлгөөн/movement.controller');
const WithdrawRouter = require('./routes/Татан авалт/withdraw.controller');

const SaleRouter = require('./routes/Борлуулалт/sale.controller');

//for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
app.use(cors());

app.use('/user', UserRouter)
app.use('/store', StoreRouter)
app.use('/storage', StorageRouter)
app.use('/product', ProductRouter)
app.use('/supplier', SupplierRouter)
app.use('/movement', MovementRouter)
app.use('/withdraw', WithdrawRouter)
app.use('/sale', SaleRouter);

app.listen(port, () => {
    console.log('Server running on port ' + port);
})