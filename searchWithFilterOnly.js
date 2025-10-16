export async function searchWithFilterOnly(driver, label, options) {
    const session = driver.session();
    try {
        const { filter = {}, rangeFilter = {}, limit = 5, skip = 0 } = options;

        const conditions = [];
        const params = {};

        // --- filtros normais e especiais ---
        for (const key of Object.keys(filter)) {
            if (key === "grade") {
                conditions.push("node.grade >= $grade");
                params.grade = filter.grade;
            } else {
                conditions.push(`node.${key} = $${key}`);
                params[key] = filter[key];
            }
        }

        // --- filtros de intervalo ---
        for (const key of Object.keys(rangeFilter || {})) {
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

        // --- cláusula WHERE ---
        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // --- query Cypher ---
        const query = `
      MATCH (node:${label})
      ${whereClause}
      RETURN node {.*} AS result
      SKIP $skip
      LIMIT $limit
    `;

        // --- parâmetros de paginação ---
        params.limit = limit;
        params.skip = skip;

        const result = await session.run(query, params);
        return result.records.map(r => r.get("result"));
    } finally {
        await session.close();
    }
}
