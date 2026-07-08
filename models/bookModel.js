const pool = require('../config/db');

class Book {
    
    static async getAll({ search, status } = {}) {
        let sqlQuery = `
            SELECT b.*, a.name AS author_name 
            FROM books b 
            JOIN authors a ON b.author_id = a.id 
            WHERE 1=1
        `;
        const queryValues = [];
        let paramIndex = 1;

        
        if (search && search.trim() !== '') {
            sqlQuery += ` AND (b.title ILIKE $${paramIndex} OR b.description ILIKE $${paramIndex} OR b.isbn ILIKE $${paramIndex} OR a.name ILIKE $${paramIndex})`;
            queryValues.push(`%${search.trim()}%`);
            paramIndex++;
        }


        if (status && status.trim() !== '') {
            sqlQuery += ` AND b.status = $${paramIndex}`;
            queryValues.push(status.trim());
            paramIndex++;
        }

        sqlQuery += ` ORDER BY b.title ASC`;

        const res = await pool.query(sqlQuery, queryValues);
        return res.rows;
    }

    
    static async findById(id) {
        const res = await pool.query(
            `SELECT b.*, a.name AS author_name 
             FROM books b 
             JOIN authors a ON b.author_id = a.id 
             WHERE b.id = $1`,
            [id]
        );
        return res.rows[0];
    }


    static async create({ title, isbn, author_id, publication_year, description, status = 'available' }) {
        const res = await pool.query(
            `INSERT INTO books (title, isbn, author_id, publication_year, description, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, isbn, author_id, publication_year, description, status]
        );
        return res.rows[0];
    }

   
    static async update(id, { title, isbn, author_id, publication_year, description, status }) {
        const res = await pool.query(
            `UPDATE books 
             SET title = $1, isbn = $2, author_id = $3, publication_year = $4, description = $5, status = $6 
             WHERE id = $7 RETURNING *`,
            [title, isbn, author_id, publication_year, description, status, id]
        );
        return res.rows[0];
    }

   
    static async updateStatus(id, status) {
        const res = await pool.query(
            `UPDATE books SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return res.rows[0];
    }

   
    static async delete(id) {
        await pool.query('DELETE FROM books WHERE id = $1', [id]);
    }
}

module.exports = Book;