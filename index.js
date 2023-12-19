const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
//const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const UserModel = require('./models/User');
const ProductModel = require('./models/Product');

dotenv.config();

mongoose
  .connect("mongodb+srv://pharmacyapp:pharma@cluster0.balnaos.mongodb.net/shop?retryWrites=true&w=majority")
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
//app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute); 

app.post("/api/login",(req,res)=>{
  const {username,password}=req.body;
  UserModel.findOne({username:username})
  .then(user=>{
    if(user){
      if(user.password===password){
        res.json("Success")

      }
      else{res.json("Incorrect password")}
    }
    else{
      res.json("User does not exist")
    }
  })

});

app.post("/api/register",(req,res)=>{
  UserModel.create(req.body)
.then(registers=>res.json(registers))
.catch(err=>res.json(err))})

app.post("/api/products",(req,res)=>{
  ProductModel.create(req.body)
.then(products=>res.json(products))
.catch(err=>res.json(err))})

app.get("/api/products", (req, res) => {
  ProductModel.find()
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

app.get("/api/products/find/:id", (req, res) => {
  const productId = req.params.id;

  ProductModel.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    })
    .catch((err) => {
      console.error("Error fetching product:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.delete("/api/products/delete/:title", (req, res) => {
  const productTitle = req.params.title;

  ProductModel.findOneAndDelete({ title: productTitle })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});




app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});   