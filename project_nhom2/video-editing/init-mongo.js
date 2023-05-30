// db.createUser({
//   user: "admin",
//   pwd: "password",
//   roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
// });

// use VideoEditing;
// db.createCollection("VideoEditing");

// db.createUser({
//   user: "user",
//   pwd: "password",
//   roles: [ { role: "readWrite", db: "VideoEditing" } ]
// });
// use admin;
// db.createUser({ user: 'readonlyuser', pwd: 'password', roles: [ { role: 'readAnyDatabase', db: 'admin' } ] });

// use VideoEditing;
// db.createCollection("videos");
db.createUser({
    user: "admin",
    pwd: "password",
    roles: [
      {
        role: "readWrite",
        db: "VideoEditing"
      }
    ]
  });