const { v4: uuid } = require("uuid");

const bookmarks = [
  {
    id: uuid(),
    title: "Portfolio",
    url: "https://www.tyleralder.com",
    description: "Tyler Alder's portfolio",
    rating: 5,
  },
];

module.exports = { bookmarks };
