const Book = require('../models/bookModel');

const Author = require('../models/authorModel'); 


exports.listBooks = async (req, res) => {
    try {
        const search = req.query.search || '';
        const status = req.query.status || '';

        
        const books = await Book.getAll({ search, status });

        
        res.render('books/index', { 
            books, 
            search,                  
            searchQuery: search,     
            statusFilter: status    
        });
    } catch (err) {
        req.flash('error', 'Could not access the library catalog.');
        return res.redirect('/');
    }
};

exports.adminDashboard = async (req, res) => {
    try {
        const search = req.query.search || '';
        const status = req.query.status || '';

        const books = await Book.getAll({ search, status });

        res.render('books/admin', { 
            books,
            search,
            searchQuery: search,
            statusFilter: status
        });
    } catch (err) {
        req.flash('error', 'Failed loading administrative management dashboard.');
        return res.redirect('/books');
    }
};


exports.getCreateBook = async (req, res) => {
    try {
        
        const authors = await Author.getAll(); 
        res.render('books/create', { authors });
    } catch (err) {
        req.flash('error', 'Author dependency retrieval exception.');
        return res.redirect('/books/admin-dashboard');
    }
};


exports.postCreateBook = async (req, res) => {
    try {
        const { title, isbn, author_id, publication_year, description, status } = req.body;
        
        
        await Book.create({ title, isbn, author_id, publication_year, description, status });
        
        req.flash('success', 'Book added to database inventory ledger successfully.');
        return res.redirect('/books/admin-dashboard');
    } catch (err) {
        req.flash('error', 'Failed building inventory index node. Verify unique ISBN constraints.');
        return res.redirect('/books/create');
    }
};


exports.getEditBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const authors = await Author.getAll();

        if (!book) {
            req.flash('error', 'Requested book item lookup failed inside structural models.');
            return res.redirect('/books/admin-dashboard');
        }

        res.render('books/edit', { book, authors });
    } catch (err) {
        req.flash('error', 'Exception displaying management interface interfaces.');
        return res.redirect('/books/admin-dashboard');
    }
};


exports.postEditBook = async (req, res) => {
    try {
        const { title, isbn, author_id, publication_year, description, status } = req.body;
        
        await Book.update(req.params.id, { title, isbn, author_id, publication_year, description, status });
        
        req.flash('success', 'Book modifications saved successfully.');
        return res.redirect('/books/admin-dashboard');
    } catch (err) {
        req.flash('error', 'Failed database stream update execution.');
        return res.redirect(`/books/edit/${req.params.id}`);
    }
};


exports.deleteBook = async (req, res) => {
    try {
        await Book.delete(req.params.id);
        req.flash('success', 'Resource book node cleared permanently.');
        return res.redirect('/books/admin-dashboard');
    } catch (err) {
        req.flash('error', 'Resource cleanup execution error. Book might be tied to borrow logs.');
        return res.redirect('/books/admin-dashboard');
    }
};