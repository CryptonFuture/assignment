const http = require('http')
const dotenv = require('dotenv')
const fs = require('fs')

const readFile = async () => {
  try {
    const data = await fs.readFileSync('./input.txt', { encoding: 'utf-8', flag: 'r' })
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

readFile()

dotenv.config({ path: '.env' })

const port = process.env.PORT

http.createServer(function (req, res) {
  console.log(`Server is running port ${port}`);
  res.write('Hello world')
  res.end()
}).listen(port)