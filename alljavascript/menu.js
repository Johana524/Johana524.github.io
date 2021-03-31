//---- BurgerMenu -------------------
const enlaces = document.getElementsByClassName("enlaces")[0];
const hamburguesa = document.getElementsByClassName("hamburguesa")[0];
const hamburguesa1 = document.getElementById("hamburguesa1");

let abierto = false; //guardo valor booleano

//FUNCION ACCION
const toggleMenu = () => {
    enlaces.classList.toggle("enlaces2");
    enlaces.style.transition = "transform 0.5s ease-in-out";
}

//FUNCION EVENTO
hamburguesa.addEventListener("click", function() {
    toggleMenu();
    //saber si esta cerrado o abierto
    if (document.querySelector(".enlaces.enlaces2")) {
        abierto = true;
        hamburguesa1.src = "imagenes/menu/close.svg";
    } else {
        abierto = false;
        hamburguesa1.src = "imagenes/menu/burger.svg";
    }
})

//cerrar el menu tocando cualquier parte de la pantalla
window.addEventListener("click", function(e) {
    if (abierto) {
        if (e.target !== hamburguesa1) {
            //cerrar menu
            toggleMenu();
            abierto = false;
            hamburguesa1.src = "imagenes/menu/burger.svg";
        }
    }
})

//si abro la pantalla y el menu esta abierto
window.addEventListener("resize", function() {
    if (screen.width > 600) {
        if (abierto) {
            toggleMenu();
            enlaces.style.transition = "none";
            abierto = false;
        }
    }
});

//------ ModoNocturno ----------------------------

const btnModoNoc = document.getElementById("btnModoNoc");

btnModoNoc.addEventListener('click', () => {

    document.body.classList.toggle('dark');
    // btnModoNoc.textContent = 'MODO DIURNO'

    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'darkMode');
        btnModoNoc.textContent = 'Modo diurno';
    } else {
        localStorage.setItem('theme', 'lightMode');
        btnModoNoc.textContent = 'Modo nocturno';
    }
});

if (localStorage.getItem('theme') === 'darkMode') {
    document.body.classList.add('dark')
    btnModoNoc.textContent = 'Modo diurno';
} else {
    document.body.classList.remove('dark')
    btnModoNoc.textContent = 'Modo nocturno';
}

// CREAR
const btnCrear = document.getElementById('btnCrear');
const crearGifo = document.getElementById('crearGifo');

btnCrear.addEventListener('click', e => {
    console.log('CLICK CREAR')
    clickCrear(e);
    crearGifo.src = './imagenes/menu/CTA-crear-gifo-active.svg';

})

const clickCrear = e => {
    e.preventDefault();
    main.classList.add('activeCrear');
    main.classList.remove('activeFavs');
    main.classList.remove('activeMisGifos');
}