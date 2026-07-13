// Store factory: picks Postgres or in-memory based on config.
const cfg = require("./config");
module.exports = cfg.storeType === "pg" ? require("./store.pg") : require("./store.memory");
