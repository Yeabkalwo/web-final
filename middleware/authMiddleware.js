const jwt = require('jsonwebtoken');
require('dotenv').config();

 
exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error', 'Please sign in to access this feature.');
        return res.redirect('/auth/login');
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; 
        res.locals.currentUser = decoded; 
        
        return next();
    } catch (err) {
        res.clearCookie('token'); 
        req.flash('error', 'Session expired. Please log in again.');
        return res.redirect('/auth/login');
    }
};


exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Access denied! This module requires administrative authorization credentials.');
    return res.redirect('/books');
};


exports.isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    req.flash('error', 'Access limited to standard library members.');
    return res.redirect('/books');
};


exports.loadUserContext = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.locals.currentUser = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.currentUser = decoded;
    } catch (err) {
        res.clearCookie('token');
        res.locals.currentUser = null;
    }
    next();
};