import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const app = express();
app.use(express.json());
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();
var manager_id;

app.get("/", (req, res) => {
  res.send("Hi welcome to the website");
});

app.get("/login", (req, res) => {
  res.send("Please Login");
});

app.get("/register", (req, res) => {
  res.send("Registered succesfully ");
});


app.get("/employeedisplay", async(req, res) => {
  if (req.isAuthenticated()) {
    try{
      console.log(manager_id);
      const result = await db.query("SELECT * FROM people WHERE emp_id = $1", [
        manager_id]);

     console.log(result.rows);
    }
    catch(err){
      console.log(err);
    }
    

  } else {
    res.redirect("/login");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/employeedisplay",
  passport.authenticate("google", {
    successRedirect: "/employeedisplay",
    failureRedirect: "/login",
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/employeedisplay",
    failureRedirect: "/login",
  })
);
app.get("/peopledisplay",async(req,res)=>{
  if (req.isAuthenticated()) {
    const people_id = req.body.id;
    try{
      const result = await db.query("SELECT * FROM readings WHERE emp_id = $1", [
        people_id]);
      

     console.log(result.rows);
    }
    catch(err){
      console.log(err);
    }
    

  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  try {
    const checkResult = await db.query("SELECT * FROM manager WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO manager (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          manager_id=result.rows[0].id;
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/employeedisplay");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/addemployee", async (req, res) => {
  try{
  const name = req.body.name;
  const age = req.body.age;
  const emp_i = req.body.emp_id;
  console.log(req.body);
  await db.query("INSERT INTO people (name,age,hascopd,emp_id) VALUES ($1, $2,$3,$4)",[name,age,false,emp_i]);
  }
  catch(err){
    console.log(err);
  }


  });

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM manager WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        manager_id=user.id;

        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/employeedisplay",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM manager WHERE email = $1 RETURNING *", [
          profile.email,
        ]);
        manager_id = result.rows[0].id;
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );
        
          
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
