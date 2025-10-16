export async function similaritySearchWithFilter(
    driver,
    indexName,
    options
) {
    const session = driver.session();
    try {
        const { k, embedding, filter, rangeFilter } = options;

        const conditions = [];
        const params = { k, embedding };

        for (const key of Object.keys(filter)) {
            if (key === "total_tds") {
                conditions.push("node.total_tds >= $total_tds");
                params.total_tds = filter.total_tds;
            } else if (key === "grade") {
                // tratamento especial: grade >= valor
                conditions.push("node.grade >= $grade");
                params.grade = filter.grade;
            } else {
                // filtros normais
                conditions.push(`node.${key} = $${key}`);
                params[key] = filter[key];
            }
        }

        // --- filtros de intervalo ---
        if (rangeFilter) {
            for (const key of Object.keys(rangeFilter)) {
                const range = rangeFilter[key];
                if (range.from) {
                    conditions.push(`node.${key} >= $${key}_from`);
                    params[`${key}_from`] = range.from;
                }
                if (range.to) {
                    conditions.push(`node.${key} <= $${key}_to`);
                    params[`${key}_to`] = range.to;
                }
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

        const result = await session.run(query, params);
        return result.records.map(r => r.get("result"));
    } finally {
        await session.close();
    }
}
