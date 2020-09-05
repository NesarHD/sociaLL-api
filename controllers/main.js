const knex = require("knex");

const getUsers = (req, res, db) => {
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

// Friends of friends
const getFriendsOfFriends = (req, res, db) => {
  const { id } = req.params;
  db.select("friends")
    .from("users")
    .where("id", id)
    .then((user) => {
      if (user[0].friends && user[0].friends.length)
        return db
          .select("friends")
          .from("users")
          .whereIn("id", user[0].friends);
      else return [];
    })
    .then((friendList) => {
      let friendsOfFriends = [];
      friendList.map((key, i) => {
        friendsOfFriends = [...friendsOfFriends, ...friendList[i].friends];
      });
      friendsOfFriends = [...new Set(friendsOfFriends)];

      friendsOfFriends.map((key, index) => {
        if (friendsOfFriends[index] == id) friendsOfFriends.splice(index, 1);
      });

      return db.select("*").from("users").whereIn("id", friendsOfFriends);
    })
    .then((friends) => {
      if (friends.length) {
        res.json({ users: friends });
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

const createUser = (req, res, db) => {
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
      friend_requested: knex.raw("array_append(friend_requested, ?)", [
        friendId,
      ]),
    })
    .then(() => {
      return db("users")
        .where("id", friendId)
        .update({
          friend_request: knex.raw("array_append(friend_request, ?)", [id]),
        });
    })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

// Accept friend
const friendAccept = (req, res, db) => {
  const { friendId } = req.body;
  const { id } = req.params;

  db("users")
    .where({ id })
    .update({
      friends: knex.raw("array_append(friends, ?)", [friendId]),
      friend_request: knex.raw("array_remove(friend_request, ?)", [friendId]),
    })
    .update({})
    .then(() => {
      return db("users")
        .where("id", friendId)
        .update({
          friend_requested: knex.raw("array_remove(friend_requested, ?)", [id]),
          friends: knex.raw("array_append(friends, ?)", [id]),
        });
    })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ dbError: "db error" });
    });
};

const updateUser = (req, res, db) => {
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

const deleteUser = (req, res, db) => {
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
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserData,
  getUsersWithoutUser,
  friendRequest,
  friendAccept,
  getFriendsOfFriends,
};
