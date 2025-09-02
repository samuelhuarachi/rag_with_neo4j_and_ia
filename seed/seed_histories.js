import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { readFile } from "node:fs/promises";
import "dotenv/config";



// SHOW INDEXES;
// DROP INDEX history_index;


/*
CALL db.index.vector.createNodeIndex(
  'history_index',
  'History',
  'embedding',
  768,   
  'cosine'
);

// dimensão do vetor (4096 ou 768)

// nao testei a maneira a baixo de fazer index, so a de cima
CREATE VECTOR INDEX history_index 
FOR (d:History) ON (d.embedding)
OPTIONS { indexConfig: { `vector.dimensions`: 768, `vector.similarity_function`: 'cosine' } };
*/


// CREATE FULLTEXT INDEX history_keywords FOR (h:History) ON EACH [h.text];


const config = {
    url: 'bolt://localhost:7687',
    username: 'neo4j',
    password: 'password',
    textNodeProperties: ["text"],
    nodeLabel: "History",
    indexName: "history_index",
    keywordIndexName: "history_keyword"
};

const ollamaEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseURL: process.env.OPENAI_BASE_URL,
});

// const neo4jVectorStore = await Neo4jVectorStore.fromExistingGraph(ollamaEmbeddings, config);
const neo4jVectorStore = await Neo4jVectorStore.initialize(ollamaEmbeddings, config);


const histories = JSON.parse(await readFile("./seed/histories.json"));
for (const history of histories) {

    console.log("tamanho", history.content.length);

    const doc = { pageContent: history.content, metadata: { 
        userId: history.userId,
        topicId: history.topicId,
        title: history.title,
        classfification: history.classfification,
        created_at: history.created_at
    } };


    await addDocumentIfNotExists(doc);
}

await neo4jVectorStore.close();
async function addDocumentIfNotExists(doc) {

    try {
        console.log("buscando");
        const searchResults = await neo4jVectorStore.similaritySearchWithScore(doc.pageContent, 1);
        const score = searchResults.at(0)?.at(1)
        const item = searchResults.at(0)?.at(0)
        console.log("🔍 Score:",  score);

        if (score === 1) {
            console.log(`🚫 Skipping duplicate: "${doc.metadata.title}"`);
            return;
        }

        if (score > 0.9 && item?.pageContent === '\ntext: '.concat(doc.pageContent)) {
            console.log(`🚫 Skipping duplicate: "${doc.metadata.title}"`);
        } else {
            console.log(`✅ Adding new document: "${doc.metadata.title}"`);
            await neo4jVectorStore.addDocuments([doc]);
        }
    } catch (error) {
        console.log(error);
    }
}

