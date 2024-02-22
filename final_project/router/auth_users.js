const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user_obj = null;
    users.map((entry) => {
        if (entry.username == username) {
            user_obj = entry;
        }
    });
    if (!user_obj) {
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let user_obj = null;
    users.map((entry) => {
        if (entry.username == username) {
            user_obj = entry;
        }
    });
    if (!user_obj) {
        return false;
    }
    return user_obj.password == password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(403).json({message: "Credential incomplete."});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({message: "Credential invalid."});
  }
  let token = jwt.sign({data: username}, "access");
  req.session.authorization = {accessToken: token};
  return res.status(200).json({message: "Login successful."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.user;
  let isbn = req.params.isbn;
  if (isbn <= 0 || isbn > 10) {
    return res.status(404).json({message: "Book not found!"});
  }
  books[isbn].reviews[user] = req.body.comment;
  res.status(200).json({message: "Review added & updated."})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let user = req.user;
  let isbn = req.params.isbn;
  if (isbn <= 0 || isbn > 10) {
    return res.status(404).json({message: "Book not found!"});
  }
  delete books[isbn].reviews[user];
  res.status(200).json({message: "Review deleted."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
