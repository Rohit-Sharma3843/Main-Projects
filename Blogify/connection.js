const mongoose = require("mongoose");

let cached = global.mongo; 

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function connect(uri) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connect;
