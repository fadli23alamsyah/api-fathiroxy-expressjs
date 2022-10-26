const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotEnv = require('dotenv')

dotEnv.config({path: '.env'})

// routes
const auth = require('./src/routes/auth')
const user = require('./src/routes/user')
const order = require('./src/routes/order')
const priceList = require('./src/routes/pricelist')
const finance = require('./src/routes/finance')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

const middleware = (req, res, next) => {
    console.log('LOGGED %s',Date.now())
    if(req.headers["api-key"] != process.env.API_KEY){
        res.status(400).send({"message" : "Aplikasi tidak diperbolehkan"})
    }else{
        next()
    }
}

app.use(middleware)

app.get('/', (req, res) => {
    res.send(`Selamat datang di API Fathir Oxy. Waktu : ${Date.now()}`)
})

app.use('/auth', auth)
app.use('/user', user)
app.use('/order', order)
app.use('/pricelist', priceList)
app.use('/finance', finance)

app.listen(port, () => {
    console.log(`Server start with port : ${port}`)
})
