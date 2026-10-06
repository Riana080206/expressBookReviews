const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[id]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[id]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* =========================================================
   TASK 10 to TASK 13: Async / Promise Implementations
   ========================================================= */

// Helper Promise function
const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

// Task 10: Get all books using Async/Await
public_users.get('/async/books', async (req, res) => {
  try {
    const bookList = await getBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Promise
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  getBooks()
    .then((bookList) => {
      if (bookList[isbn]) {
        res.status(200).json(bookList[isbn]);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Error fetching book" }));
});

// Task 12: Get book details based on Author using Promise
public_users.get('/async/author/:author', (req, res) => {
  const author = req.params.author;
  getBooks()
    .then((bookList) => {
      let results = [];
      for (let id in bookList) {
        if (bookList[id].author.toLowerCase() === author.toLowerCase()) {
          results.push(bookList[id]);
        }
      }
      res.status(200).json(results);
    })
    .catch((err) => res.status(500).json({ message: "Error fetching books by author" }));
});

// Task 13: Get book details based on Title using Promise
public_users.get('/async/title/:title', (req, res) => {
  const title = req.params.title;
  getBooks()
    .then((bookList) => {
      let results = [];
      for (let id in bookList) {
        if (bookList[id].title.toLowerCase() === title.toLowerCase()) {
          results.push(bookList[id]);
        }
      }
      res.status(200).json(results);
    })
    .catch((err) => res.status(500).json({ message: "Error fetching books by title" }));
});

module.exports.general = public_users;
