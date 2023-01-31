const dotenv = require('dotenv').config()
const port = process.env.PORT || '3000';
const app = require('./app');
const { sequelize } = require('./models');

app.use((error,req,res,next) => {
    console.log(error);
    res.status(500).send(error.message);
});

app.listen(port, async()=>{
    console.log('connecting to backend and Database...')
    await sequelize.sync({force : true});
    console.log(`Starting Server with port Number is ${port}`);
});


