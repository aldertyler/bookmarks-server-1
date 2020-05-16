const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../store");
const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!url) {
      logger.error(`url is required`);
      return res.status(400).send("Invalid data");
    }

    if (!description) {
      logger.error(`description is required`);
      return res.status(400).send("Invalid data");
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send(`'rating' must be a number between 0 and 5`);
    }

    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route("/bookmark/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((c) => c.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("bookmark Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((b) => b.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
