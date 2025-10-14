const go_search = document.getElementById("go_search")


document.addEventListener("submit", async (e) => {
    e.preventDefault();

    const search_form = document.getElementById('search_form');
    const formData = new FormData(search_form);
    const search_form_values = Object.fromEntries(formData.entries());
    const search_form_values_cleaned = Object.fromEntries(Object.entries(search_form_values).filter(([_, value]) => value !== ""))

    const pergunta = document.getElementById("pergunta")
    const f = await fetch(api_route + "/go_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...search_form_values_cleaned })
    });

    const answer = await f.json()

    console.log(answer);
})


document.addEventListener("DOMContentLoaded", evt => {
    // Cria o bloco da resposta
    const respostaItem = document.createElement('div');
    respostaItem.className = 'list-group-item list-group-item-action';
    respostaItem.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">Pergunta:</h6>
        <small>${new Date().toLocaleTimeString()}</small>
      </div>
      <p class="mb-1">TEXTOOO</p>
      <small class="text-muted">Resposta: (aguardando...)</small>
    `;

    respostasContainer.prepend(respostaItem);

    // Cria o bloco da resposta
    const respostaItem2 = document.createElement('div');
    respostaItem2.className = 'list-group-item list-group-item-action';
    respostaItem2.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">Pergunta:</h6>
        <small>${new Date().toLocaleTimeString()}</small>
      </div>
      <p class="mb-1">TEXTOOO</p>
      <small class="text-muted">Resposta: (aguardando...)</small>
    `;

    respostasContainer.prepend(respostaItem2);
});



/*
 { answer: 
    'Sabe-se que uma mulher chamada Amanda atende na casa do Alfredo, localizada na Rua Guaiçara. 
    Ela foi mencionada em um Test Drive (TD) publicado por "felipe_1999" no dia 12 de setembro de 2021, onde o 
    usuário descreveu a experiência com Amanda como positiva: ela ofereceu toalha limpa para banho, estava sempre cheirosa e limpinha, 
    e proporcionou um bom atendimento (incluindo boquete sem capa e posições sem reclamações). 
    O contato com Amanda foi classificado com nota 8.' }
*/


