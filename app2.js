const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', Controller.home)
app.get('/products', Controller.products)
app.get('/products/:CategoryId', Controller.byCategory)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.addUser)
app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginPost)

app.get("/emailUs", Controller.sendEmailForm)
app.post("/emailUs", Controller.sendEmail)

app.get("/myAccount/:id", Controller.myAccount)
app.get("/deleteAccount/:id", Controller.deleteAccount)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})