const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');


const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const borrowRoutes = require('./routes/borrowRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
app.use(csrf({ cookie: true }));


app.use((req, res, next) => {
    let currentUser = null;
    try {
        if (req.cookies && req.cookies.token) {
            currentUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        }
    } catch (e) {
        currentUser = null;
    }

    res.locals.currentUser = currentUser;
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.get('/', (req, res) => res.redirect('/books'));
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/borrow', borrowRoutes);


app.use((req, res) => {
    res.status(404).render('books/index', { 
        books: [], 
        search: '',
        messages: { error: ['The requested system resource path could not be located.'] } 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Library System running on http://localhost:${PORT}`));