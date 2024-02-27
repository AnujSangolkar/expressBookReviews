const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
    const book = books[isbn];
    
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.status(404).send('Book not found');
    }
});

// Get book details based on author

public_users.get('/author/:author',function (req, res) {

    let authorToFind = req.params.author;
  let matchingBooks = [];

  for (let key in books) {
    if (books[key].author === authorToFind) {
      matchingBooks.push(books[key]);
    }
  }

  res.send(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    let titleToFind = req.params.title;
    let matchingBooks = [];

    for(let key in books){
        if(books[key].title === titleToFind) {
            matchingBooks.push(books[key])
        }
    }
    res.send(matchingBooks);
});

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
