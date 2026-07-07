const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.getLogin = (req, res) => res.render('auth/login');
exports.getRegister = (req, res) => res.render('auth/register');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findByEmail(email);
        
        if (existingUser) {
            req.flash('error', 'Email already exists inside database registry.');
            return res.redirect('/auth/register');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = (role === 'admin' || role === 'user') ? role : 'user';
        
        await User.create({ username, email, password: hashedPassword, role: assignedRole });
        
        req.flash('success', `Registration successful as system ${assignedRole}! Please log in.`);
        res.redirect('/auth/login');
    } catch (err) {
        req.flash('error', 'Server error encountered during authentication enrollment.');
        res.redirect('/auth/register');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'Invalid authorization email or access password.');
            return res.redirect('/auth/login');
        }
        
         
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        
        req.flash('success', `Welcome back, ${user.username} (${user.role})!`);
        
        if (user.role === 'admin') {
            res.redirect('/books/admin-dashboard');
        } else {
            res.redirect('/books');
        }
    } catch (err) {
        req.flash('error', 'Server exception during login runtime verification.');
        res.redirect('/auth/login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Successfully dropped session authorization state.');
    res.redirect('/auth/login');
};