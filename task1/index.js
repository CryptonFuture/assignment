const http = require('http')
const dotenv = require('dotenv')

dotenv.config({path: '.env'})

const port = process.env.PORT

http.createServer(function(req, res) {
    console.log('Server is running port 5000');
    res.write('Hello world')
    res.end()
}).listen(port)