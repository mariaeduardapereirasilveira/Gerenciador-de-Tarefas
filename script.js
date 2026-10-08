import { toast } from "./toast";
let tarefas = [];
// localStorage.removeItem("tarefas");
const formTarefa = document.querySelector("#form-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");


const totalTarefas = document.querySelector("#total-tarefas");
const tarefasPendentes = document.querySelector("#tarefas-pendentes");
const tarefasConcluidas = document.querySelector("#tarefas-concluidas");


const contadorTarefas = document.querySelector("#contador-tarefas");


const filtro =
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

function configurarData() {
    const data = document.querySelector("#data");

    const hoje = new Date();

    const hojeFormato = hoje.toISOString().split("T")[0];

    const limitePassado = new Date(hoje);
    limitePassado.setFullYear(limitePassado.getFullYear() - 1)

    const limiteFuturo = new Date(hoje);
    limiteFuturo.setFullYear(limiteFuturo.getFullYear() + 5)

    data.value = hojeFormato;
    data.min = limitePassado.toISOString().split("T")[0];
    data.max = limiteFuturo.toISOString().split("T")[0];


}


function concluirTarefa(index) {
    tarefas[index].status = "concluida";
    tarefas[index].dataConclusao = new Date().toISOString();

    salvarTarefas();
    renderizarTarefa();
    atualizarIndicadores();
    toast("Tarefa concluida!", "success");
}

function excluirTarefaAntiga() {
    const agora = new Date();
    const seteDias = 7 * 24 * 60 * 60 * 1000;
    // const seteDias= 10*1000;
    const quantidadeAntes = tarefas.length;

    tarefas = tarefas.filter((tarefa) => {
        if (tarefa.status !== "concluida") {
            return true;
        }

        const dataConclusao = new Date(tarefa.dataConclusao);
        const tempoPassado = agora - dataConclusao;

        return tempoPassado < seteDias;

    });
    if (tarefas.length < quantidadeAntes) {
        salvarTarefas();
        renderizarTarefa();
        atualizarIndicadores();
    }
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

        if (
            descricao.value.trim() === ""
            || categoria.value === ""
            || prioridade.value === ""
            || data.value === ""
        ) {
            toast("Preencha todos os campos.", "warning");
            return;
        }

        if (data.value < data.min || data.value > data.max) {
            toast("A data escolhida não é válida.", "warning");
            return;
        }

        const tarefa =
        {
            descricao: descricao.value,
            categoria: categoria.value,
            prioridade: prioridade.value,
            data: data.value,
            status: "pendente",
            dataConclusao: null
        }

        tarefas.push(tarefa);
        salvarTarefas();
        console.log(tarefas);
        renderizarTarefa();
        atualizarIndicadores();
        formTarefa.reset();
        configurarData();
        toast("Tarefa adicionada com sucesso!", "success");

    })


}


function excluirTarefa(index) {
    tarefas.splice(index, 1);
    salvarTarefas();
    renderizarTarefa();
    atualizarIndicadores();
    toast("Tarefa excluida!", "success");
}

function renderizarTarefa(filtros = filtro) {

    if (filtros === undefined) {
        console.log("não enviou filtros");
    }
    else {
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


    if (tarefasFiltradas.length === 0) {
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

        if (tarefa.status === "concluida") {
            card.classList.add("concluida");
        }

        let botaoConcluir = '';
        if (tarefa.status !== "concluida") {
            botaoConcluir = `
        <button class="botao botao-concluir" data-index="${index}" >
            Concluir
        </button>
    `;
        }

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
          
         ${botaoConcluir}
          
          <button class="botao botao-excluir"  data-index="${index}">
          Excluir
          </button>
          
          </div>
          `;


        listaTarefas.appendChild(card);
        const btnConcluir = card.querySelector(".botao-concluir");
        const btnExcluir = card.querySelector(".botao-excluir");



        if (btnConcluir) {

            btnConcluir.addEventListener("click", () => {
                const index = btnConcluir.dataset.index;
                concluirTarefa(index);
            });
        }

        if (btnExcluir) {

            btnExcluir.addEventListener("click", () => {
                const index = btnExcluir.dataset.index;
                excluirTarefa(index);
            });
        }

    });

}






function arrastar(card, index){
    let inicioX =0;
    let movimentoX=0;
    let arrastando = false;


    card.addEventListener("pointerdown", (e) =>{
        if(e,EventTarget.closest("button")){
            return;
        }
        inicioX = e.clientX;
        movimentoX =0 ;
        arrastando = true;
    
        card.setPointerCapture(e.pointeId);
        card.classList.add("arrastando");
    });

      card.addEventListener("pointermove", (e) => {
        if(!arrastando){
            return;
        }

        arrastando = false;
        card.classList.remove("arrastando");

        const limite = 100;

        if(movimentoX > limite){
            concluirTarefa(index);
        }else if (movimentoX < -limite){
            excluirTarefa(index);
        }


        card.style.transform= "";
      });
}








function inicializar() {
    adicionarTarefa();
    configurarData();
    carregarTarefas();
    excluirTarefaAntiga();

    setInterval(excluirTarefaAntiga, 60 * 1000);
}
inicializar();