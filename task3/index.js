const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

dotenv.config({path: '.env'})

connectDatabase()

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running port ${port}`);
})