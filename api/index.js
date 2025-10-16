import express from "express";
import cors from "cors";
import "dotenv/config";
import GoSearch from "../GoSearch.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import IncommingQuestionValidation from "./IncommingQuestionValidation.js";
import NormalizeForNeo4j from "./NormalizeForNeo4j.js";

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
            try {
                const incommingQuestionValidation = new IncommingQuestionValidation();
                const question = incommingQuestionValidation.execute(req.body);
                if (!question) return res.status(400).json({ errors: "Erro na validacao dos dados" });

                // normalizar os parametros de question, para o neo4j
                const normalizeForNeo4j = new NormalizeForNeo4j(question);
                const params = normalizeForNeo4j.execute();

                // configurando o rangefilter
                let rangeFilter = {};
                if (question.dateFinish && question.dateInitial) {
                    rangeFilter.created_at = {
                        from: question.dateInitial.toISOString(),
                        to: question.dateFinish.toISOString(),
                    };
                    // { created_at: { from: "2024-11-05", to: "2024-11-06T23:59:59" } }
                }


                console.log("question.question >> ", question.question);


                const goSearch = new GoSearch();
                await goSearch.init();

                const response = (question.question) ?
                    await goSearch.answerQuestion(question.question, params, rangeFilter) :
                    await goSearch.searchRandom(params, rangeFilter);

                await goSearch.close();


                response.forEach(obj => delete obj.embedding);

                // aqui ele pode retornar um 200 falando que esta tudo ok, e que logo a  resposta sera
                // publicada
                res.status(201).json({
                    answer: response
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ errors: "Erro inesperado" });
            }

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
