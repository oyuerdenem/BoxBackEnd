require('dotenv').config();
//mongodb
require('./config/db');

const app = require('express')();
const cors = require("cors")
const port = 3000;

const UserRouter = require('./routes/User/User.controller');
const StoreRouter = require('./routes/Дэлгүүр/store.controller');
const StorageRouter = require('./routes/Агуулах/storage.controller');
const ProductRouter = require('./routes/Бараа/product.controller');
// const SaleRouter = require('./routes/Борлуулалт/sales.controller');

//for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
app.use(cors());

app.use('/user', UserRouter)
app.use('/store', StoreRouter)
app.use('/storage', StorageRouter)
// app.use('/sales', SaleRouter)
app.use('/product', ProductRouter)

app.listen(port, () => {
    console.log('Server running on port ' + port);
})