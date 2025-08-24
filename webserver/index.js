import express from "express";
import "dotenv/config";


const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {

    const api_route = process.env.API_ROUTE;
    const socker_io_server = process.env.SOCKET_IO_SERVER;


    res.render("index", { api_route, socker_io_server });
});



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
