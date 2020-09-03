const knex = require("knex");

const getTableData = (req, res, db) => {
  db.select("*")
    .from("users")
    .then((items) => {
      if (items.length) {
        res.json({ users: items });
      } else {
        res.json({ users: [] });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

const getUsersWithoutUser = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .whereNot("id", id)
    .from("users")
    .then((items) => {
      if (items.length) {
        res.json({ users: items });
      } else {
        res.json({ users: [] });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

const getUserData = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .where("id", id)
    .from("users")
    .then((users) => {
      if (users.length) {
        const user = users.pop();
        res.json({ user: user });
      } else {
        res.json({ message: "User does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

const postTableData = (req, res, db) => {
  const { first, last, avatar } = req.body;
  const added = new Date();
  db("users")
    .insert({ first, last, avatar, added })
    .returning("*")
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

// Friend Request
const friendRequest = (req, res, db) => {
  const { friendId } = req.body;
  const { id } = req.params;

  db("users")
    .where({ id })
    .update({
      friendRequested: knex.raw("array_append(friendRequested, ?)", [friendId]),
    })
    .then((item) => {
      return db("users")
        .where("id", friendId)
        .update({
          friendRequest: knex.raw("array_append(friendRequest, ?)", [id]),
        })
    })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

const putTableData = (req, res, db) => {
  const { id, first, last, avatar } = req.body;
  db("users")
    .where({ id })
    .update({ first, last, avatar })
    .returning("*")
    .then((item) => {
      res.json(item);
    })
    .catch((err) => res.status(400).json({ dbError: "db error" }));
};

const deleteTableData = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .del()
    .then(() => {
      res.json({ delete: "true" });
    })
    .catch((err) => res.status(400).json({ dbError: "db error" }));
};

module.exports = {
  getTableData,
  postTableData,
  putTableData,
  deleteTableData,
  getUserData,
  getUsersWithoutUser,
  friendRequest,
};
