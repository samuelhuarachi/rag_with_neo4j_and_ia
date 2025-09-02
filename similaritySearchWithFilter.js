import neo4j, { Driver } from "neo4j-driver";

// interface SimilaritySearchOptions {
//   k: number;              // Quantidade de resultados
//   embedding: number[];    // Vetor da query
//   filter?: Record<string, any>; // Metadados (opcionais)
// }

export async function similaritySearchWithFilter(
  driver,
  indexName,
  options) {
  const session = driver.session();
  try {
    const { k, embedding, filter } = options;

    // Monta a parte do WHERE a partir do objeto filter
    let whereClause = "";
    if (filter && Object.keys(filter).length > 0) {
      const conditions = Object.keys(filter).map(
        (key) => `node.${key} = $${key}`
      );
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    const query = `
      CALL db.index.vector.queryNodes($indexName, $k, $embedding)
      YIELD node, score
      ${whereClause}
      RETURN node {.*, score} AS result
      ORDER BY score DESC
    `;
    
    const result = await session.run(query, {
      indexName,
      k,
      embedding,
      ...filter,
    });

    return result.records.map((r) => r.get("result"));
  } finally {
    await session.close();
  }
}
