boton = document.querySelector(".boton")
blanco= document.querySelector(".blanco")

function color(){
    document.body.classList.toggle("boton")
    document.body.classList.toggle("blanco")
}

boton.addEventListener("click",color)


function pregunta(){
    if (confirm("¿Estas seguro de enviar este formulario?")){
        document.getElementById("formulario").submit();
    }
}

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('enviar').addEventListener("click", function(e){
        e.preventDefault();
        pregunta()
    });
});

