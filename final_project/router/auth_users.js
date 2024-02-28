const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
     if(validUsers.length > 0){
        return true;
     } else {
        return false;
     }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(404).json({message: "Error logging in"})
    }

    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data:password
        }, 'access', {expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in")
    } else {
        return res.status(208).json({message : "Invalid login. Check username and password"})
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book) {
        let author = req.body.author;
        let title = req.body.title;
        let reviews = req.body.reviews;

        //if the reviw has been changed, update the review
        if(reviews) {
            book["reviews"] = reviews
        }

        books[isbn] = book;
        res.send(`Book with isbn ${isbn} updated.`)
    }
    else{
        res.send("unable to find book")
    }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    if(isbn) {
        delete books[reviews]
    }
    res.send(`Book with isbn ${isbn} review is deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
