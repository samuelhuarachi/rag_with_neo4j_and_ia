const go_search = document.getElementById("go_search");


document.addEventListener("submit", async (e) => {
    e.preventDefault();

    const search_form = document.getElementById("search_form");
    const formData = new FormData(search_form);
    const search_form_values = Object.fromEntries(formData.entries());
    const search_form_values_cleaned = Object.fromEntries(Object.entries(search_form_values)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => {
            if (key === "grade" || key === "tds") {
                return [key, Number(value)];
            }
            if (key === "dateInitial" || key === "dateFinish") {
                return [key, new Date(value)]; // converte para Date
            }
            return [key, value]; // mantém o valor original
        }));



    const f = await fetch(api_route + "/go_search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...search_form_values_cleaned })
    });

    const response = await f.json();

    answer(response);
});

function answer(data) {
    const respostaItem = document.createElement("div");
    respostaItem.className = "answer";
    respostaItem.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">Resultado da pesquisa</h6>
        <small>${new Date().toLocaleTimeString()}</small>
      </div>
      <pre class="mb-1">${JSON.stringify(data.answer, undefined, 2)}</pre>

    `;

    respostasContainer.prepend(respostaItem);
}

