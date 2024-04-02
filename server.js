const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

app.use(cookieParser());
app.use(express.static("public"));

app.use((req, res, next) => {
  let data = readData();
  console.log("Data", data);
  req.data = data;
  next();
});

const readData = () => {
  let data = JSON.parse(
    require("fs").readFileSync(
      path.join(__dirname, "database/data.json"),
      "utf-8"
    )
  );
  return data;
};
const PORT = process.env.PORT || 4455;

app.get("/", (req, res) => {
  console.log("/products pinged");
  let htmlResponse = `<div style="text-align:center,padding:1rem"><h1>Items API</h1><p>Welcome! Our data can be your assets! :)</p><a href='/api/v1/items'>Items Data</a>`;
  res.end(htmlResponse);
});

app.get("/api/v1/items", (req, res) => {
  console.log("Data", req?.data);
  res.json({ status: 200, items: req?.data?.products });
});

app.get("/api/v1/items/:id", (req, res) => {
  let findItem = req?.data.products.find((u) => u.id == req.params.id);
  if (!findItem)
    return res.json({ status: 404, msg: "Item couldn't be found" });
  res.json({ status: 200, items: findItem });
});

// app.get(
//   "/admin",
//   (req, res, next) => {
//     console.log(req.cookies);
//     // if(req.cookie)
//     const { authCookie } = req.cookies;
//     if (!authCookie) return res.redirect("/unauthorized");
//     next();
//   },
//   (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "cookie.html"));
//   }
// );

app.get("/unauthorized", (req, res) => {
  res.json({
    status: 403,
    msg: "Uh-oh, musta been snooping where you weren't welcome!",
  });
});

app.use((req, res, next) => {
  res.redirect("/");
  next();
});

app.listen(PORT, console.log(`Listening in on port ${PORT}`));
