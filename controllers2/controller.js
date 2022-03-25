const { Product, Category, Profile, User } = require('../models/index')
const passwordVisible = require("../helpers/passwordVisible")
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer")

class Controller {

  static home(req, res) {
    res.render("home")
  }

  static products(req, res) {

    Product.findAll({
      order: [['productName', 'ASC']],
      include: {
        model: Category
      }
    }).then(data => {
      res.render('products', { products: data, Product })
    }).catch(error => {
      console.log(error)
      res.send(error)
    })

  }

  static byCategory(req, res) {
    let idCategory = req.params.CategoryId
    Product.findAll({
      include: Category,
      where: {
        CategoryId: idCategory
      }
    })
      .then(data => {
        res.render("byCategoryPage", { data })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static registerForm(req, res) {
    let errors = req.query.errors

    res.render("registerForm", { errors })
  }

  static addUser(req, res) {
    let { userName, password, membership, fullName, gender, email, phone, address } = req.body

    User.create({
      userName,
      password,
      membership
    })
      .then(newUser => {
        
        let idUser = newUser.id
        return Profile.create({
          fullName,
          gender,
          email,
          phone,
          address,
          UserId: idUser
        })
      })
      .then(newProfile => {
        res.redirect("/products")
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          err = err.errors.map(el => {
            return el.message
          })
        }
        let error = err.join()
        res.redirect(`/register/?errors=${error}`)
      })
  }

  static loginForm(req, res) {
    res.render("login")
  }

  static loginPost(req, res) {
    let { userName, password } = req.body
    User.findOne({
      where: {
        userName: userName
      }
    })
      .then(user => {
        if (user) {
          let isValidPassword = bcrypt.compareSync(password, user.password)

          if (isValidPassword) {
            return res.redirect("/products")
          } else {
            let error = "invalid username/password"
            return res.redirect(`/login?error=${error}`)
          }
        } else {
          let error = "invalid username/password"
          return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => {
        res.send(err)
      })
  }

  static sendEmailForm(req, res) {
    res.render("emailForm")
  }

  static sendEmail(req, res) {
    let { yourEmail, subject, message } = req.body
    console.log(req.body)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pair.projectRD@gmail.com',
        pass: 'rdprojectphase1'
      }
    });

    const options = {
      from: yourEmail,
      to: "pair.projectRD@gmail.com",
      subject: subject,
      text: message
    }

    transporter.sendMail(options)
      .then(response => {
        res.render("successEmail")
      })
      .catch(error => {
        res.send(err)
      })
  }

  static myAccount(req, res) {
    const userId = req.params.id

    User.findOne({
      include: Profile,
      where : {
        id : userId
      }
    })
    .then(data => {
      console.log(data)
      res.render("accountDetail", {data})
    })
    .catch(err => {
      res.send(err)
    })
  }

  static deleteAccount(req, res) {
    let userId = req.params.id

    User.destroy({
      where :{
        id: userId
      }
    })
    then(data => {
      res.redirect("/")
    })
    .catch(err => {
      res.send(err)
    })
  }
}

module.exports = Controller