const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store");
//No se olviden de inicializarlo! 
const fileStore = FileStore(session);
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
require("./database.js");
const app = express();
const exphbs = require("express-handlebars");
const multer = require("multer");
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
    //Carpeta donde se guardan las imagenes.
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    //Mantengo el nombre original
  },
});
const upload = multer({ storage: storage });

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

//Middleware de Session
//app.use(
 // session({
    //secret: "secretCoder",
    //resave: true,
    //saveUninitialized: true,
    //3) Utilizando Mongo Storage:
    //store: MongoStore.create({
     // mongoUrl:
       // "mongodb+srv://catalinakrenz3316:coderhouse@cluster0.0yui3l4.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0",
     // ttl: 100,
    //}),
  //})
//);



//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Multer
app.post("/upload", upload.array("imagen"), (req, res) => {
  res.send("Imagen cargada");
});

// Cookies
//Seteamos una cookie: 

//app.get("/setcookie", (req, res) => {res.cookie("coderCookie", "Mi primera chamba con cookie").send("Cookie seteada!");})

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

//Cambios passport: 
//initializePassport();
//app.use(passport.initialize());
//app.use(passport.session());




app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
