const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    sameSite: true 
  }
}))


app.get('/register', Controller.registerForm)

app.post('/register', Controller.addUser)

app.get('/login', Controller.loginForm)

app.post('/login', Controller.loginPost)

app.use((req, res, next) => {
  console.log('Time:', Date.now())

  if(!req.session.userId) {
    const error = `Please login first`
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
})

app.use((req, res, next) => {
  console.log(req.session, 'ini req session')
  console.log('Time:', Date.now())

  if(req.session.userId && req.session.membership !== 'VIP') {
    const error = `You have no access to buy special package`
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
})

app.get('/logout', Controller.getLogOut)

app.get('/products', Controller.products)

app.get('/products/:productId', Controller.detailProduct)

app.get('/products/:productId/:userId', Controller.buy)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})