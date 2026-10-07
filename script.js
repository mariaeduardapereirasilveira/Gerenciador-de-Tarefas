let tarefas = [];
// localStorage.removeItem("tarefas");
const formTarefa = document.querySelector("#form-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");


const totalTarefas = document.querySelector("#total-tarefas");
const tarefasPendentes = document.querySelector("#tarefas-pendentes");
const tarefasConcluidas = document.querySelector("#tarefas-concluidas");


const contadorTarefas = document.querySelector("#contador-tarefas");


const  filtro = 
{ 
    situacao: "todas",
    categoria: "todas",
}


const selectSituacao = document.querySelector("#filtro-status");
const selectCategoria = document.querySelector("#filtro-categoria");

selectSituacao.addEventListener("change", () => {

    filtro.situacao = selectSituacao.value;
    renderizarTarefa(filtro);

});

selectCategoria.addEventListener("change", () => {

    filtro.categoria = selectCategoria.value;
    renderizarTarefa(filtro);

});




function concluirTarefa(index) {
    tarefas[index].status = "concluida";
    

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
        if (tarefa.status == "pendente") {
            pendentes++;
        }

        if (tarefa.status == "concluida") {
            concluida++;
        }
    });
    totalTarefas.textContent = tarefas.length;
    tarefasConcluidas.textContent = concluida;
    tarefasPendentes.textContent = pendentes;
    contadorTarefas.textContent = `${tarefas.length} tarefa(s)`;
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }

    renderizarTarefa();
    //renderizarTarefa();
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
            status: "pendente"
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
carregarTarefas()



function renderizarTarefa(filtros = filtro) {
    
    if(filtros === undefined){
        console.log("não enviou filtros");
    }
    else{
        console.log(filtros);
    }


    listaTarefas.innerHTML = "";

const tarefasFiltradas = tarefas.filter((tarefa) => {
     const situacaoOk =
            filtros.situacao === "todas" ||
            tarefa.status === filtros.situacao;

        const categoriaOk =
            filtros.categoria === "todas" ||
            tarefa.categoria === filtros.categoria;

        return situacaoOk && categoriaOk;
})



// console.log("Tarefas filtradas:", tarefasFiltradas);
// console.log("Quantidade:", tarefasFiltradas.length);


  if(tarefasFiltradas.length === 0){
     listaTarefas.innerHTML = `
        <div class="estado-vazio">
            <div class="icone-vazio">
                ✓
            </div>

            <h3>Nenhuma tarefa encontrada</h3>

            <p>
                Não existem tarefas que correspondam aos filtros selecionados.
            </p>
        </div>
    `;

    return;
  };

      tarefasFiltradas.forEach((tarefa, index) => {
          
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
          
          
          listaTarefas.appendChild(card);
          
          const btnConcluir = document.querySelector(".botao-concluir");
          
          btnConcluir.addEventListener("click", () => {
              const index = btnConcluir.dataset.index;
              concluirTarefa(index);
            });
            
        });
    
    }



