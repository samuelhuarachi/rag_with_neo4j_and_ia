import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import "dotenv/config";

const config = {
    url: process.env.NEO4J_URI,
    username: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD,
    textNodeProperties: ["text"],
    indexName: "javascript_index",
    keywordIndexName: "javascript_keywords",
    searchType: "vector",
    nodeLabel: "Chunk",
    textNodeProperty: "text",
    embeddingNodeProperty: "embedding",
};

const model = new ChatOllama({
    temperature: 0,
    maxRetries: 2,
    model: process.env.NLP_MODEL,
    baseURL: process.env.OLLAMA_BASE_URL,
});

const ollamaEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseURL: process.env.OLLAMA_BASE_URL,
});

const neo4jVectorIndex = await Neo4jVectorStore.fromExistingGraph(ollamaEmbeddings, config);


await Promise.all([
    "A amanda trabalha de sabado?",
].map(async question => {
    const response = await answerQuestion(question);

    console.log("\n💡 Final Answer:\n", response.content);
    return
}));


async function answerQuestion(question) {
    const results = await neo4jVectorIndex.similaritySearchWithScore(question, 100);
    const relevantChunks = results.map(result => result[0]?.pageContent?.replaceAll('text: ', '')).filter(Boolean);

    if (relevantChunks.length === 0) {
        console.log("⚠️ No relevant context found.");
        return "Sorry, I couldn't find enough information to answer.";
    }

    const context = relevantChunks.join("\n");
    const prompt = `
        Answer the question concisely and naturally based on the following context:
        Don't use information outside of the provided context.

        Context:
        ${context}

        Question: ${question}

        Provide a direct and informative response:
    `;

    // 4️⃣ Generate Response Using AI Model
    const response = await model.invoke(prompt);
    return response;
}
