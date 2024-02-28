const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if(userswithsamename.length>0){
        return true;
    } else {
        return false;
    }
    
}

public_users.post("/register", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!doesExist(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json({message : "User successfully registered, you can now login"});
        }
        else {
            res.status(404).json({message:"User already exist"})
        }
        }
        return res.status(400).json({message: "Unable to register user."})
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    getData()
    .then(books =>{
        res.send(JSON.stringify(books,null,4))
    })
    .catch(error => {
        res.status(500).send("Internal server error")
    })

    function getData() {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject('Error fetching data');
            }
        });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    
    getBookByISBN(isbn)
    .then(book => {
        res.send(JSON.stringify(book,null,4));
    })
    .catch(error => {
        console.error(error);
        res.status(404).send('Book not found')
    });
});

function getBookByISBN(isbn) {
    return new Promise((resolve,reject) => {
        const book = books[isbn];
        if(book) {
            resolve(book);
        }
        else {
            reject('Book not found')
        }
    });
}

// Get book details based on author

public_users.get('/author/:author',function (req, res) {

    let author = req.params.author;
 
    getBooksByAuthor(author)
    .then(authorBooks => {
        if(authorBooks.length > 0) {
            res.send(JSON.stringify(authorBooks, null,4))
        } else {
            res.status(404).send('No books found')
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Internal server error')
    });
});

function getBooksByAuthor(author) {
    return new Promise((resolve,reject) => {
        const authorBooks = [];

        for(const isbn in books) {
            if(books.hasOwnProperty(isbn) && books[isbn].author === author) {
                authorBooks.push(books[isbn])
            }
        }
        if(authorBooks.length > 0) {
            resolve(authorBooks);
        }
        else{
            reject('No books found')
        }
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    let title = req.params.title;
 
    getBooksByTitle(title)
    .then(authorBooks => {
        if(authorBooks.length > 0) {
            res.send(JSON.stringify(authorBooks, null,4))
        } else {
            res.status(404).send('No books found')
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Internal server error')
    });
});

function getBooksByTitle(title) {
    return new Promise((resolve,reject) => {
        const authorBooks = [];

        for(const isbn in books) {
            if(books.hasOwnProperty(isbn) && books[isbn].title === title) {
                authorBooks.push(books[isbn])
            }
        }
        if(authorBooks.length > 0) {
            resolve(authorBooks);
        }
        else{
            reject('No books found')
        }
    });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    
    let isbnToFind = req.params.isbn;
    let bookReviews = {};
  
    for (let key in books) {
      if (key === isbnToFind) {
        bookReviews = books[key].reviews;
        break;
      }
    }
  
    res.json(bookReviews);
});

module.exports.general = public_users;
