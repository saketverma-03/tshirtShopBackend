require("dotenv").config();
const db = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

//-------------------------------------------->MIDDLE-WARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use((req,res,next) => {
// 	console.log("passed this")
// 	res.header("Access-Control-Allow-Origin","*");
// 	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next()
// })

//--------------------------------------------->ROUTS

app.use("/api", authRoutes); //->Authantication Routes
app.use("/api", userRoutes); //->All user Routes
app.use("/api", categoryRoutes); //->All user Catogerys
app.use("/api", productRoutes); //->All Products Routes


//-------------------------------------------->DATABASE-CONNECTION
let dbUrl = ""
db.connect(process.env.DB_URL || dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("DB connected");
}).catch(error => console.log(error));

//--------------------------------------------->PORT
const port = 8000;

//--------------------------------------------->SERVER-START
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
