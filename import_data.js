import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import fs from "fs"
import path from "path"
import "dotenv/config";

const dir = "./documents_extrated"; 

const config = {
    url: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'password',
    textNodeProperties: ["text"],
    indexName: "sim_example_index",
    keywordIndexName: "sim_example_keywords",
};

const ollamaEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseURL: process.env.OPENAI_BASE_URL,
});


const neo4jVectorIndex = await Neo4jVectorStore.fromExistingGraph(ollamaEmbeddings, config);

const files = fs.readdirSync(dir);
for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, "utf8");

  const doc = { pageContent: content, metadata: {} };
  await addDocumentIfNotExists(doc);
}


// await makeAQuestion("melhor casa?");
await neo4jVectorIndex.close();


async function makeAQuestion(question) {
    let results = await neo4jVectorIndex.similaritySearchWithScore(question, 5);
    console.log("🔍 Search Results:", question, results.at(0)?.at(1), results.at(0)?.at(0));
}

async function addDocumentIfNotExists(doc) {
    const searchResults = await neo4jVectorIndex.similaritySearchWithScore(doc.pageContent, 1);
    const score = searchResults.at(0)?.at(1)
    const item = searchResults.at(0)?.at(0)
    //console.log("🔍 Search Results:", searchResults, score);

    if (score > 0.9 && item?.pageContent === '\ntext: '.concat(doc.pageContent)) {
        console.log(`🚫 Skipping duplicate: "${doc.pageContent}"`);
    } else {
        console.log(`✅ Adding new document: "${doc.pageContent}"`);
        await neo4jVectorIndex.addDocuments([doc]);
    }
}

