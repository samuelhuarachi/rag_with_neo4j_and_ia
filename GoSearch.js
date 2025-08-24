import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import "dotenv/config";

export default class GoSearch {

    #config;

    #ollamaEmbeddings = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseURL: process.env.OLLAMA_BASE_URL,
    });

    #model = new ChatOllama({
        temperature: 0,
        maxRetries: 2,
        model: process.env.NLP_MODEL,
        baseURL: process.env.OLLAMA_BASE_URL,
    });

    #neo4jVectorIndex;
    

    constructor(neoj4_index = "history_index", neo4j_keywords = "history_keywords") {
        this.#config = {
            url: process.env.NEO4J_URI,
            username: process.env.NEO4J_USER,
            password: process.env.NEO4J_PASSWORD,
            textNodeProperties: ["text"],
            indexName: neoj4_index,
            keywordIndexName: neo4j_keywords,
            searchType: "vector",
            textNodeProperty: "text",
            embeddingNodeProperty: "embedding",
        };
    }

    async init() {
        this.#neo4jVectorIndex = await Neo4jVectorStore.initialize(this.#ollamaEmbeddings, this.#config);
    }

   
    async answerQuestion(question) {

        // const filter = { a: { $eq: 1 } };
        /*
        https://js.langchain.com/docs/integrations/vectorstores/neo4jvector/
        
        const filter = {
            date: {
                $gte: "2024-01-01",
                $lte: "2024-12-31"
            }
        };
        */
        const results = await this.#neo4jVectorIndex.similaritySearchWithScore(question, 10);
        const relevantChunks = results.map(result => result[0]?.pageContent?.replaceAll('text: ', '')).filter(Boolean);

        if (relevantChunks.length === 0) return {content: "Sorry, I couldn't find enough information to answer."};
        

        const context = relevantChunks.join("\n");
        const prompt = `
            Answer the question concisely and naturally based on the following context:
            Don't use information outside of the provided context.

            Context:
            ${context}

            Question: ${question}

            Provide a details and informative response in portuguese. Use nicks, and dates, to reference your answers:
        `;

        const response = await this.#model.invoke(prompt);
        return response;
    }

    async close() {
        await this.#neo4jVectorIndex.close();
    }
}