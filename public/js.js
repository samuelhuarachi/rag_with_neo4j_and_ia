const go_search = document.getElementById("go_search")


document.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pergunta = document.getElementById("pergunta")

    const f = await fetch(api_route + "/go_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({pergunta: pergunta.value})
    });

    const answer = await f.json()

    console.log(answer);
})

/*
 { answer: 
    'Sabe-se que uma mulher chamada Amanda atende na casa do Alfredo, localizada na Rua Guaiçara. 
    Ela foi mencionada em um Test Drive (TD) publicado por "felipe_1999" no dia 12 de setembro de 2021, onde o 
    usuário descreveu a experiência com Amanda como positiva: ela ofereceu toalha limpa para banho, estava sempre cheirosa e limpinha, 
    e proporcionou um bom atendimento (incluindo boquete sem capa e posições sem reclamações). 
    O contato com Amanda foi classificado com nota 8.' }
*/


