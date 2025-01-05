const express = require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const mysql = require('mysql2');
const port=3001;
const app = express();
const db=require("./Database/mysql")




const corsOptions = {
  origin: 'https://glittering-kleicha-93a26b.netlify.app/',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
const sessionStore = new MySQLStore({}, db.promise());

app.use(session({
    key: 'user_sid',
    secret: 's3cr3t',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false // Set to true if using https
    }
}));
app.get("/test",()=>{
  console.log("test");
})
require('./routes/api-routes')(app)


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


