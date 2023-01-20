const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const ExpressError = require("./ExpressError");


app.use(express.static(path.join(__dirname, "public")));
app.use('/starter-code/assets/', express.static('./starter-code/assets'));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");


const sessionOptions = { secret: "thisisnotagoodsecret", resave: false, saveUninitialized: false }
app.use(session(sessionOptions));

app.get("/", (req, res) => {
    res.render("gameIntro");
});

app.post("/game", (req, res) => {
    const { picks1st, gameMode } = req.body;
    res.render("game", { picks1st, gameMode });
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not Found", 404))
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    const { message = "Whoops, something went wrong! We are working on that now!" } = err;
    res.status(status).send(message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
});
