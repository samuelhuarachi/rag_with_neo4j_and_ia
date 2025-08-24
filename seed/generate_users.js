/**
 schema: 

{
  "id": "samuel",
  "nick": "samuel",
  "created_at":" 2025-08-21T14:35:51.570Z"
}

*/

import fs from "fs"
import path from "path"

const dir = "./documents_extrated"; 
const files = fs.readdirSync(dir);
import crypto from "crypto";

const users_f = [];

fs.appendFileSync("seed/users.json", "[" + "\n", "utf8");
for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, "utf8");

//   const nick = content.explode(content, ",")
  const match = content.match(/Este post foi escrito por:\s*(.*?),/);
  const nick = (match[1] === "") ? "indefinido" : match[1];
  const match2 = content.match(/Este usuário se registrou no dia:\s*(.*?)\./);
  const created_at = new Date(match2[1].trim());

  const find = users_f.find((value) => value === nick)
  if (!find) {
    const doc = {
      id: nick,
      nick,
      created_at
    }

    fs.appendFileSync("seed/users.json", JSON.stringify(doc) + "," + "\n", "utf8");

    users_f.push(nick)
  }
}


fs.appendFileSync("seed/users.json", "]" + "\n", "utf8");
