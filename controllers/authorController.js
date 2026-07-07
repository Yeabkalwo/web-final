const Author = require('../models/authorModel');

exports.listAuthors = async (req, res) => {
    try {
        const authors = await Author.getAll();
        res.render('authors/index', { authors });
    } catch (err) {
        req.flash('error', 'Could not open index reference arrays.');
        res.redirect('/books');
    }
};

exports.getCreateAuthor = (req, res) => res.render('authors/create');

exports.postCreateAuthor = async (req, res) => {
    try {
        const { name, biography, birth_year, nationality } = req.body;
        await Author.create({ name, biography, birth_year, nationality });
        req.flash('success', 'Author signature saved.');
        res.redirect('/authors');
    } catch (err) {
        req.flash('error', 'Structural compilation error.');
        res.redirect('/authors/create');
    }
};

exports.getEditAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            req.flash('error', 'Author reference missing.');
            return res.redirect('/authors');
        }
        res.render('authors/edit', { author });
    } catch (err) {
        req.flash('error', 'Rendering exception caught.');
        res.redirect('/authors');
    }
};

exports.postEditAuthor = async (req, res) => {
    try {
        const { name, biography, birth_year, nationality } = req.body;
        await Author.update(req.params.id, { name, biography, birth_year, nationality });
        req.flash('success', 'Biographical datasets successfully modified.');
        res.redirect('/authors');
    } catch (err) {
        req.flash('error', 'Database submission rejection failure.');
        res.redirect(`/authors/edit/${req.params.id}`);
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        await Author.delete(req.params.id);
        req.flash('success', 'Author node cleared cleanly.');
        res.redirect('/authors');
    } catch (err) {
        req.flash('error', 'Deletion integrity blockade violation.');
        res.redirect('/authors');
    }
};