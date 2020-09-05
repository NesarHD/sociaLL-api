## Project Description
Nodejs Express based application to serve the apis for the client on https://github.com/NesarHD/sociaLL-client 

built on Nodejs, Postgresql.

## Project setup and deployment

Git clone the repository and then `npm install`
Run schema.sql placed in the seed folder to create the database 
`psql postgres < schema.sql

`npm start` to run this code.

can be reverse proxied at 3000 post on a production machine

please check project.json for the project dependencies.

## Postman API testing 

API available.

Host http://localhost:3000 - please use the routes with this URL to fetch all the api data.

[GET] /api/users - fetches all the uses in the application

[GET] /api/users/:id - fetches all the users except the user with the id

[GET] /api/friends-of-friends/:id - fetches all the friends of friends of the user ( id )

[GET] /api/user/:id - fetches all the data related to the user

[POST] /api/friend-request/:id - sends a friend request to the particular friendId in the POST body from user (id)

[POST] /api/accept-friend/:id - Accepts friend request from friendId with the user (id)

[POST] /api/user - Creates a user with first last and avatar

[PUT] /api/user - Update user related data

[DELETE] /api/user - Deletes a particular user


### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

###