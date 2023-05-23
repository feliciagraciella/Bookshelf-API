/* eslint-disable no-extra-semi */
/* eslint-disable no-else-return */
/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    const id = nanoid(16);

    let finished = false;

    if (pageCount === readPage) {
        finished = true;
    }

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
      };

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          });
        response.code(400);
        return response;
    }
    books.push(newBook);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
};

const getAllBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;

    let buku = books;

    if (reading === '1') {
        buku = books.filter((book) => book.reading === true);
    }
    
    if (reading === '0') {
        buku = books.filter((book) => book.reading === false);
    }

    if (finished === '1') {
        buku = books.filter((book) => book.finished === true);
    }

    if (finished === '0') {
        buku = books.filter((book) => book.finished === false);
    }

    if (name !== undefined) {
        buku = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
        

    return h.response({
        status: 'success',
        data: {
            books: buku.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
            },      
    });
};    
        

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const book = books.filter((n) => n.id === bookId)[0];
   
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
            };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;   
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
        response.code(400);
        return response;
    }
    
    const updatedAt = new Date().toISOString();
   
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
        const finished = pageCount === readPage;

      books[index] = {
        ...books[index],
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        finished, 
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;   

    // const book = books.filter((n) => n.id === bookId)[0];

    const index = books.findIndex((book) => book.id === bookId);


    if (index !== -1) {
        // const index = books.findIndex((buku) => buku.id === bookId);

        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

// const deleteBookByIdHandler = (request, h) => {
//     const { bookId } = request.params;

//     const index = books.findIndex((book) => book.id === bookId);

//     if (index !== -1) {
//         books.splice(index, 1);

//         return h.response({
//         status: 'success',
//         message: 'Buku berhasil dihapus',
//         }).code(200);
//     }

//     return h.response({
//         status: 'fail',
//         message: 'Buku gagal dihapus. Id tidak ditemukan',
//     }).code(404);
// };
  
 
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };