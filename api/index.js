import express from "express";
import cors from "cors";
import "dotenv/config";
import GoSearch from "../GoSearch.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3002;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


app.use(express.json());
app.use(cors());


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("DB connected");


    app.post("/go_search", async (req, res) => {
        const { pergunta } = req.body;

        // Posta a mensagem no SQS, para processar uma de cada vez
        
        const goSearch = new GoSearch();
        await goSearch.init();
        const response = await goSearch.answerQuestion(pergunta);
        await goSearch.close();

        res.status(201).json({
            answer: response.content
        });
    });

    server.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
    });
})
.catch((err) => console.error("Erro ao conectar no MongoDB:", err));


// Evento de conexão do Socket.IO
io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Recebe mensagem do cliente
    socket.on("mensagemDoCliente", (msg) => {
        console.log("Mensagem recebida do cliente:", msg);

        // Envia de volta para todos os clientes
        io.emit("mensagemDoServidor", `Servidor recebeu: ${msg}`);
    });

    // Detecta desconexão
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});




// Função para encerrar a conexão
const closeMongoConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("Conexão MongoDB encerrada.");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao encerrar MongoDB:", err);
    process.exit(1);
  }
};



// Captura CTRL+C
process.on("SIGINT", closeMongoConnection);

// Captura kill ou encerramento do processo
process.on("SIGTERM", closeMongoConnection);

// Captura erros não tratados
process.on("uncaughtException", async (err) => {
  console.error("Exceção não tratada:", err);
  await closeMongoConnection();
});