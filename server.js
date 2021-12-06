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

function getPermaLink(req) {
  return `${req.protocol}://${req.hostname}:3000${req.path}`;
}

router.render = (req, res) => {
  if (res.locals.hasPermaLink) {
    if (Array.isArray(res.locals.data)) {
      res.locals.data.forEach((obj) => {
        obj.link = `${getPermaLink(req)}/${obj.id}`;
      });
    } else if (res.locals.data) {
      res.locals.data.link = getPermaLink(req);
    }
  }

  if (req.method === "GET" && req.path === "/polls") {
    // Only include polls that the user has voted in or
    // created. We're including this logic in `router.render`
    // so we can use json-server's middleware to handle
    // the GET request. Otherwise, we'd have to write our own
    // handler for GET /polls.
    const user = res.locals.user;
    res.locals.data = res.locals.data.filter(
      (poll) =>
        poll.owner === user.id ||
        poll.votes.find((vote) => vote.participantId === user.id)
    );
  }
  res.jsonp(res.locals.data);
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware

server.use((req, res, next) => {
  // Only anon users are supported right now
  res.locals.user = {
    id: req.header("Anon-Authorization"),
    isAnon: true,
  };
  next();
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  next();
});

// Custom routes. For reference, see create/update/destroy/list, etc. in
// https://github.com/typicode/json-server/blob/master/src/server/router/plural.js
// to see how json-server handles routes.

server.post("/polls", (req, res) => {
  const user = res.locals.user;
  const pollId = db
    .get("polls")
    .insert({ owner: user.id, createdAt: req.body.createdAt })
    .value().id;
  const choices =
    req.body && Array.isArray(req.body.choices)
      ? req.body.choices.map(({ title }) =>
          db.get("choices").insert({ pollId, title }).value()
        )
      : [];
  db.write();

  const result = {
    id: pollId,
    link: `${getPermaLink(req)}/${pollId}`,
    choices,
  };
  res.status(201);
  res.jsonp(result);
});

server.get("/polls", (req, res, next) => {
  res.locals.hasPermaLink = true;
  next();
});

server.get("/polls/:id", (req, res, next) => {
  res.locals.hasPermaLink = true;
  next();
});

server.post("/votes", (req, res, next) => {
  req.body.participantId = res.locals.user.id;
  next();
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
