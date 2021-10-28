// Development server for mocking API calls
const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const yargs = require("yargs/yargs");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
// NOTE: json-server uses lowdb@1.0.0!
// https://github.com/typicode/lowdb/tree/v1.0.0
const db = router.db;
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes. For reference, see create/update/destroy/list, etc. in
// https://github.com/typicode/json-server/blob/master/src/server/router/plural.js
// to see how json-server handles routes.

server.post("/polls", (req, res) => {
  const pollId = db.get("polls").insert({}).value().id;
  const choices =
    req.body && Array.isArray(req.body.choices)
      ? req.body.choices.map(({ title }) =>
          db.get("choices").insert({ pollId, title }).value()
        )
      : [];

  const result = {
    id: pollId,
    choices,
  };
  res.status(201);
  res.jsonp(result);
});

function run(args) {
  if (args.routes) {
    const routes = JSON.parse(fs.readFileSync(argv.routes));
    const rewriter = jsonServer.rewriter(routes);
    server.use(rewriter);
  }

  server.use(router);
  server.listen(args.port, () => {
    console.log(`Server is listening on port ${args.port}`);
  });
}

const argv = yargs(process.argv.slice(2)).options({
  routes: {
    alias: "r",
    description: "Path to routes file",
  },
  port: {
    alias: "p",
    description: "Set port",
    default: 3001,
  },
}).argv;

run(argv);
