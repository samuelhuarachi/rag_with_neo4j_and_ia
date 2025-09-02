export async function similaritySearchWithFilter(
  driver,
  indexName,
  options
) {
  const session = driver.session();
  try {
    const { k, embedding, filter, rangeFilter } = options;

    const conditions = [];

    // filtros de igualdade
    if (filter) {
      conditions.push(...Object.keys(filter).map(key => `node.${key} = $${key}`));
    }

    // filtros de intervalo
    if (rangeFilter) {
      for (const key of Object.keys(rangeFilter)) {
        const range = rangeFilter[key];
        if (range.from) conditions.push(`node.${key} >= $${key}_from`);
        if (range.to) conditions.push(`node.${key} <= $${key}_to`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      CALL db.index.vector.queryNodes("${indexName}", $k, $embedding)
      YIELD node, score
      ${whereClause}
      RETURN node {.*, score} AS result
      ORDER BY score DESC
    `;

    const params = { k, embedding, ...filter };
    if (rangeFilter) {
      for (const key of Object.keys(rangeFilter)) {
        const range = rangeFilter[key];
        if (range.from) params[`${key}_from`] = range.from;
        if (range.to) params[`${key}_to`] = range.to;
      }
    }

    const result = await session.run(query, params);
    return result.records.map(r => r.get("result"));
  } finally {
    await session.close();
  }
}
