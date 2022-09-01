const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const movieRoutes = require('./routes/movies')

// require('dotenv').config({ path: './config/.env' })
require('dotenv').config()

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        cookie: {
            // maxAge: 60000 * 60 * 24, //1Sec * 1H * 24 = 1 Day
            secure: process.env.NODE_ENV !== 'prod' ? false : true,
        },
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    })
)
// app.use(
//     session({
//         secret: 'keyboard cat',
//         resave: false,
//         saveUninitialized: false,
//         store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     })
// )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', mainRoutes)
app.use('/movies', movieRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is running, you better catch it!')
    console.log(`Server running on http://localhost:${PORT}`)
})
