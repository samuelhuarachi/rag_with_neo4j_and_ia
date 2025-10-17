import neo4j from "neo4j-driver";
import { readFile } from "node:fs/promises";
import { faker } from "@faker-js/faker";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

/*

excluir tudo:
MATCH (n)
DETACH DELETE n;

mostrar tudo:
MATCH (n) RETURN n LIMIT 100;

*/

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

const ollamaEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseURL: process.env.OPENAI_BASE_URL,
});

const users = JSON.parse(await readFile("./seed/users.json"));
const histories = JSON.parse(await readFile("./seed/histories.json"));
const topics = JSON.parse(await readFile("./seed/topics.json"));
const cities = JSON.parse(await readFile("./seed/cities.json"));
const states = JSON.parse(await readFile("./seed/states.json"));

// for (const data of histories) {
//     data.content = data.content.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g,'');
//     data.embedding = await ollamaEmbeddings.embedQuery(data.content);
// }

// acho que isso aqui, eu consigo editar alguem atributo por id
// await session.run(
//   `
//   MATCH (h:History {id: $id})
//   SET h.embedding = $embedding
//   `,
//   { id: historiaId, embedding }
// );



// await session.run(
//     `UNWIND $batch AS row
//     MERGE (s:User {id: row.id})
//     ON CREATE SET s.nick = row.nick, s.created_at = row.created_at`,
//     { batch: users }
// );
// console.log("✅ Users Inserted!");

// await session.run(
//     `UNWIND $batch AS row
//     MERGE (s:State {id: row.id})
//     ON CREATE SET s.name = row.name`,
//     { batch: states }
// );
// console.log("✅ States Inserted!");

// await session.run(
//         `UNWIND $batch AS row
//         MATCH (s:State {id: row.stateId})
//         MERGE (c:City {id: row.id})
//         ON CREATE SET c.name = row.name
//         MERGE (c)-[:PART_OF]->(s)`,
//         { batch: cities }
//     );
// console.log("✅ Cities Inserted!");


// await session.run(
//         `UNWIND $batch AS row
//         MATCH (c:City {id: row.cityId})
//         MERGE (t:Topic {id: row.id})
//         ON CREATE SET t.name = row.name
//         MERGE (t)-[:LOCATED_IN]->(c)`,
//         { batch: topics }
//     );
// console.log("✅ Topics Inserted!");



// pode executar essa consulta direto no neo4j, para fazer o relacionamentos
// nao se funciona direto pelo codigo, mas no neo4j foi ok
// MATCH (h:History)
//   WITH h, h.userId AS uid, h.topicId AS tid
//   MATCH (u:User {id: uid})
//   MATCH (t:Topic {id: tid})
//   MERGE (u)-[:POSTED]->(h)
//   MERGE (h)-[:BELONGS_TO]->(t)
//   RETURN h.id AS historyId, uid, tid
// console.log("✅ Histories Template defined!");



await session.close();
await driver.close();