import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { readFile } from 'node:fs/promises'

const config = {
    url: process.env.NEO4J_URI,
    username: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD,
    indexName: "agent_index",
    searchType: "vector",
    textNodeProperties: ["question"],
    nodeLabel: "Chunk",
};

