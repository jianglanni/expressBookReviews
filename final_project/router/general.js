const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let body = req.body;
  if (!body.username) {
    res.status(300).json({message: "Invalid register info."});
    return;
  }
  let user_object = {username: body.username, password: body.password};
  let exist = false;
  users.map((entry) => {
    if (entry.username == body.username) {
        exist = true;
    }
  });
  if (exist) {
    res.status(300).json({message: "Invalid register info."});
    return;
  }
  users.push(user_object);
  res.status(200).json({message: "user "+body.username+" registered!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn > 0 && isbn <= 10)
    res.status(200).json({message: books[isbn]});
  else
    res.status(300).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let all_books = Object.values(books);
  let picked_books = [];
  all_books.map((entry) => {
    if (entry.author == author) {
        picked_books.push(entry);
    }
  });
  res.status(200).json({message: picked_books});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let all_books = Object.values(books);
  let picked_books = [];
  all_books.map((entry) => {
    if (entry.title == title) {
        picked_books.push(entry);
    }
  });
  res.status(200).json({message: picked_books});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn > 0 && isbn <= 10)
    res.status(200).json({message: books[isbn].reviews});
  else
    res.status(300).json({message: "Book not found"});
});

module.exports.general = public_users;
