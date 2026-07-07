const BorrowRecord = require('../models/borrowModel');

exports.borrowBook = async (req, res) => {
    try {
        const user_id = res.locals.currentUser.id;
        const book_id = req.body.book_id;
        
        await BorrowRecord.create({ user_id, book_id });
        req.flash('success', 'Checkout sequence completed successfully!');
        res.redirect('/borrow/history');
    } catch (err) {
        req.flash('error', err.message || 'Transactional checkout error.');
        res.redirect('/books');
    }
};

exports.returnBook = async (req, res) => {
    try {
        const recordId = req.params.id;
        await BorrowRecord.returnBook(recordId);
        req.flash('success', 'Book processed back into available library stock.');
        
        if (res.locals.currentUser.role === 'admin') {
            res.redirect('/borrow/all-records');
        } else {
            res.redirect('/borrow/history');
        }
    } catch (err) {
        req.flash('error', err.message || 'Return operation sequence interrupted.');
        res.redirect('/books');
    }
};

exports.viewUserHistory = async (req, res) => {
    try {
        const user_id = res.locals.currentUser.id;
        const records = await BorrowRecord.getHistoryByUser(user_id);
        res.render('borrow/history', { records });
    } catch (err) {
        req.flash('error', 'Archive streaming failed.');
        res.redirect('/books');
    }
};

exports.viewAllRecords = async (req, res) => {
    try {
        const records = await BorrowRecord.getAllRecords();
        res.render('borrow/admin_records', { records });
    } catch (err) {
        req.flash('error', 'Audit array retrieval exception.');
        res.redirect('/books/admin-dashboard');
    }
};