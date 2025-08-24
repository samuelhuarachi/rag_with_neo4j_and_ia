/**
 schema: 
{
    "id": "b13507cb-e273-481e-9cdd-8cbbc08eb999",
    "userId": "samuel",
    "topicId": "3b9153f1-d505-4921-85f8-0b26167c4501",
    "title": "Historia de terror 1",
    "content": "A noite estava silenciosa quando Pedro decidiu atravessar o velho cemitério para voltar para casa. \n        Entre as lápides quebradas e árvores retorcidas, uma névoa densa começou a surgir, cobrindo cada passo que ele dava. \n        De repente, ouviu sussurros indistintos ao seu redor, como se centenas de vozes estivessem repetindo seu nome, mas não havia ninguém à vista.\n\nQuando ele acelerou o passo, sentiu um frio cortante no pescoço, como se alguém tivesse passado a mão por ali. \nAo se virar, não viu nada, mas seus olhos encontraram uma sombra parada atrás de uma lápide, imóvel, observando cada movimento. \nPedro correu, mas a sombra parecia seguir cada passo, e o sussurro transformou-se em risada sombria, ecoando na escuridão, \nfazendo o coração dele quase parar.",
    "classfification": "positive",
    "created_at": "2025-08-21T14:41:32.031Z"
  }
 */

import fs from "fs"
import path from "path"

const dir = "./documents_extrated"; 
const files = fs.readdirSync(dir);
import crypto from "crypto";

fs.appendFileSync("seed/histories.json", "[" + "\n", "utf8");
for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, "utf8");

//   const nick = content.explode(content, ",")
  const match = content.match(/Este post foi escrito por:\s*(.*?),/);
  const nick = (match[1] === "") ? "indefinido" : match[1];

  const match2 = content.match(/Este post foi criado no dia:\s*(.*?)\./);
  const created_at = new Date(match2[1].trim());
  const id = crypto.randomUUID();
  const topicId = "3b9153f1-d505-4921-85f8-0b26167c4501"; // historias de terror

  const doc = {
    id,
    userId: nick,
    topicId,
    title: "",
    content,
    classfification: "",
    created_at
  }

  fs.appendFileSync("seed/histories.json", JSON.stringify(doc) + "," + "\n", "utf8");

}

fs.appendFileSync("seed/histories.json", "]" + "\n", "utf8");
