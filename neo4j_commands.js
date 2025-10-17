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

/*

excluir tudo:
MATCH (n)
DETACH DELETE n;

mostrar tudo:
MATCH (n) RETURN n LIMIT 100;

*/


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
