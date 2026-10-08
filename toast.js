export function toast(mensage, type){
    const toast = document.createElement("div");

    toast.classList.add("toast", type);
    toast.textContent = mensage;

    document.body.appendChild(toast);

    setTimeout(() =>{
        toast.remove();
    }, 3000);
}