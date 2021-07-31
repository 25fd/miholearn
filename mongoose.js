const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    //console.log(con.connections);
    console.log("db connected successfully");
  })
  .catch(err => {
    console.log("Error connecting to DB" + err);
  });

mongoose.set("debug", true);