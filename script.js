let tarefas = [];

const formTarefa = document.querySelector("#form-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");


const totalTarefas = document.querySelector("#total-tarefas");
const tarefasPendentes = document.querySelector("#tarefas-pendentes");
const tarefasConcluidas = document.querySelector("#tarefas-concluidas");



function concluirTarefa(index) {
    tarefas[index].concluida = true;

    salvarTarefas();
    renderizarTarefa();
    atualizarIndicadores();
}

function salvarTarefas() {

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarIndicadores() {
    let pendentes = 0;
    let concluida = 0;
    tarefas.forEach((tarefa) => {
        if (tarefa.concluida == false) {
            pendentes++;
        }

        if (tarefa.concluida == true) {
            concluida++;
        }
    });
    totalTarefas.textContent = tarefas.length;
    tarefasConcluidas.textContent = concluida;
    tarefasPendentes.textContent = pendentes;
}

function carrgarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }

    renderizarTarefa();
    atualizarIndicadores();
}

function adicionarTarefa() {
    formTarefa.addEventListener("submit", (e) => {
        e.preventDefault();
        const descricao = document.querySelector("#descricao");
        const categoria = document.querySelector("#categoria");
        const prioridade = document.querySelector("#prioridade");
        const data = document.querySelector("#data");

        console.log(descricao.value);
        console.log(categoria.value);
        console.log(prioridade.value);
        console.log(data.value);

        const tarefa =
        {
            descricao: descricao.value,
            categoria: categoria.value,
            prioridade: prioridade.value,
            data: data.value,
            concluida: false
        }

        tarefas.push(tarefa);
        salvarTarefas();
        console.log(tarefas);
        renderizarTarefa();
        atualizarIndicadores();
        formTarefa.reset();

    })
}

adicionarTarefa();
carrgarTarefas()



function renderizarTarefa() {
    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa, index) => {

        const card = document.createElement("div");

        card.classList.add("tarefa");

        card.innerHTML = `
            <div class="tarefa-conteudo">

                <h3 class="tarefa-descricao">
                    ${tarefa.descricao}
                </h3>

                <div class="tarefa-informacoes">

                    <span>${tarefa.categoria}</span>

                    <span>${tarefa.prioridade}</span>

                    <span>${tarefa.data}</span>

                </div>

            </div>

            <div class="tarefa-acoes">

                <button class="botao botao-concluir" data-index= "${index}">
                    Concluir
                </button>

                <button class="botao botao-excluir">
                    Excluir
                </button>

            </div>
        `;
        const btnConcluir = document.querySelector(".botao-concluir");

        btnConcluir.addEventListener("click", () => {
            const index = btnConcluir.dataset.index;
            concluirTarefa(index);
        });


        listaTarefas.appendChild(card);

    });
}

