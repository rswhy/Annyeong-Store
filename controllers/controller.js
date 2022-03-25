const { Product, Category, User, Profile } = require('../models/index')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs') 
const formatDate = require('../helpers/formatDate')
const nodemailer = require('nodemailer')

class Controller {

  static home(req, res) {
    res.render("home")
  }

  static products(req, res) {
    let keyword = req.query.search
    let sort = req.query.sortBy
    let sortCategory = req.query.category
    const userId = req.session.userId

    let temp = []
   

    if (keyword) {
      temp.push(`search=${keyword}`)
    } 

    if (sort) {
      if (sort.length > 1) {
        sort = sort[1]
      }
      const filterTemp = temp.filter(el => el.includes('sort'))
      if (filterTemp.length > 0) {
        temp = []
        temp.push(`sortBy=${sort}`)
      } else {
        temp.push(`sortBy=${sort}`)
      }

    } 

    if (sortCategory) {
      if (sortCategory.length > 1) {
        sortCategory = sortCategory[1]
      }

      const filterTemp = temp.filter(el => el.includes('category'))
      console.log(filterTemp.length )
      if (filterTemp.length > 0) {
        console.log('masokkkkkkkkkk')
        temp = []
        temp.push(`category=${sortCategory}`)
      } else {
        temp.push(`category=${sortCategory}`)
      }

    }

    let queryAll = temp.join('&')

    if (temp.length > 0) {
      queryAll = `${queryAll}&`
    }
    
    if (!keyword) {
      keyword = ''
    }
    
    let sortResult
    if (sort === 'high') {
      sortResult = [['price', 'DESC']]
    } else if (sort === 'low') {
      sortResult = [['price', 'ASC']]
    } else {
      sortResult = [['productName', 'ASC']]
    }

    let whereResult = {
      productName: {
        [Op.iLike]: `%${keyword}%`
      }
    }

    if (sortCategory) {
      whereResult = {
        ...whereResult,
        CategoryId: +sortCategory,
      }
    }

    Product.findAll({
      order: sortResult,
      include: {
        model: Category
      },
      where: whereResult
    }).then(data => {
      res.render('products', { products: data, Product, userId, queryAll})
    }).catch(error => {
      res.send(error)
    })
  }

  static registerForm(req, res) {
    let errors = req.query.errors

    res.render("registerForm", { errors })
  }

  static addUser(req, res) {
    const { userName, password, fullName, gender, email, phone, address, membership} = req.body

    User.create({ 
      userName, password, membership
    }).then((result) => {
      return Profile.create({
        fullName, gender, email, phone, address, UserId: result.id
      })
    }).then(() => {
      res.redirect("/login")
    }).catch(err => {
        if (err.name === "SequelizeValidationError") {
          err = err.errors.map(el => {
            return el.message
          })
        }
        let error = err.join(', ')
        res.redirect(`/register/?errors=${error}`)
      })
  }

  static loginForm(req, res) {
    const err = req.query.error
    res.render("login", { err })
  }

  static loginPost(req, res) {
    let { userName, password } = req.body
    User.findOne({
      where: {
        userName: userName
      }
    }).then(user => {
        if (user) {
          let isValidPassword = bcrypt.compareSync(password, user.password)

          if (isValidPassword) {
            req.session.userId = user.id
            req.session.membership = user.membership
            return res.redirect("/products")
          } else {
            let error = "invalid username/password"
            return res.redirect(`/login?error=${error}`)
          }
        } else {
          let error = "invalid username/password"
          return res.redirect(`/login?error=${error}`)
        }
    }).catch(err => {
        res.send(err)
      })
  }

  static getLogOut (req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/login')
      }
    })
  }

  static detailProduct (req, res) {
    const id = req.params.productId
    const userId = req.session.userId
   
    Product.findOne({
      include: {
        model: Category
      },
      where: {
        id
      }
    }).then(product => {
      res.render('detailProduct', { product, Product, formatDate, userId })
    }).catch(error => {
      console.log(error)
      res.send(error)
    })
  }

  static buy (req, res) {

    const userId = req.session.userId
    const productId = req.params.productId

    User.findByPk(userId)
      .then((user) => {
        if (user.ProductId === null) {
          return [User.update({
            ProductId: +productId
          }, {where: {
            id: userId
          }}), 'success']
        } else {
          return [User.findOne({
            where: {
              id: userId
            },
            include: {
              model: Product
            }
          }), 'error']
        }
    }).then(result => {
      console.log(result)
      if (result[1] === 'error') {
        res.render('errorBuy')
      } else {
        res.render('successBuy')
      }

    }).catch(err => {
      console.log(err)
      res.send(err)
    })

  }

  //Part 2
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
    })

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
    const userId = req.session.userId

    User.findOne({
      include: [Profile, Product],
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
    const userId = req.session.userId

    Profile.destroy({
      where : {
        UserId: userId
      }
    })
    .then(() => {
      User.destroy({
        where : {
          id: userId
        }
      })
    }) 
    .then(() => {
      res.redirect("/")
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
  }
}

module.exports = Controller