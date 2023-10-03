const lis = document.querySelectorAll(".list-group-item")
const buscador = document.querySelector("#buscador")


for (i=0;i<lis.length;i+2){
    lis[i].classList.add("list-group-item-secondary")
}



//Funcion 1
function filtrar(substring, elements){
   cumplen = [] 
for (i of lis){
    if(i.innerText.toLowerCase().includes(substring.toLowerCase())){
       cumplen.push(i)
   }
 }
 return cumplen
}

//Funcion 2
buscador.addEventListener("input", ()=>{
    if (buscador.value == " "){
        for (i of lis){
            i.classList.remove("d-none")
        }
    }else{
        filtrados = filtrar(buscador.value,lis)
        for(i of lis){
            i.classList.add("d-none")
        }
        for (i of filtrados){
            i.classList.remove("d-none")
        }
    }
})