// ------ BUSQUEDA
const searchForm = document.getElementById('mainForm');
const searchInput = document.getElementById('searchInput');
const containerGifs = document.getElementById('containerGifs');
const searchName = document.getElementById('searchName');
const btnSearch = document.getElementById("btnSearch");
const btnSearchDark = document.getElementById("btnSearchDark");
const btnClose = document.getElementById('btnClose');
const searchBox = document.getElementById('searchBox');
const selectContainer = document.getElementById('selectContainer');
const containerResultado = document.getElementById('containerResultado');
const btnVerMas = document.getElementById('btnVerMas');
var limit = 12;
var verMas = 1;

searchInput.addEventListener("input", bigSearch);

function bigSearch() {

    const apiKey = "zj7Clj46qXUz60K9BlzesRCiJXM8sxyj";
    const q = this.value;
    const path = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&limit=5&q=${q}`;

    // aparece select
    // SE ACTIVA CON UNA LETRA,DESACTIVA CON OTRA con toggle
    selectContainer.classList.add('active');
    searchBox.classList.add('active'); //p modif btns

    fetch(path)
        .then(res => res.json())
        .then(content => {
            // RECIBO DATOS PARA CONTAINER SELECT
            let listaArray = content.data;
            let select = '';

            for (let i = 0; i < listaArray.length; i++) {

                let itemsName = content.data[i].name;

                select += `
                <div id="selectValue" class="srch-select">
                  <img class="img-select" src="imagenes/icon-search.svg">
                  <a href="#" class="select" id="select">
                    <div  class="select-value">
                       <p>${itemsName}</p>
                    </div>
                  </a>
                </div>`;

            }
            selectContainer.innerHTML = select;
            console.log(selectContainer)

        })
        .then(() => {
            // RELLENO INPUT CUANDO DOY CLICK EN VALUE
            document.querySelectorAll('#selectContainer > .srch-select').forEach((value) => {
                // x c click recibimos un evento e
                value.addEventListener('click', (e) => {

                    e.preventDefault();
                    selectContainer.classList.toggle('active');
                    // click en selectvalue, relleno input
                    searchInput.value = e.currentTarget.querySelector('.select-value').innerText;
                    console.log(searchInput.value);
                    inputChange(e)
                })
            })
        });
};

let sbtn = document.querySelectorAll('.sbtn');

for (j of sbtn) {
    j.addEventListener('click', function(e) {
        clickSbtn(e)
    })
}

const clickSbtn = e => {
    e.preventDefault();
    const classBtn = e.target.classList[0];
    switch (classBtn) {
        case ('search-btn'):
            console.log('click search-btn');
            selectContainer.classList.remove('active');
            inputChange(e)
            break;
        case ('sbtn-dark-theme'):
            selectContainer.classList.remove('active');
            console.log('click sbtn-dark-theme');
            inputChange(e)
            break;
    }
}

searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        // console.log(e.target.value)
        e.preventDefault();
        selectContainer.classList.remove('active');
        inputChange(e)
    }
});
// TRAIGO INPUT VALUE Y DESATO SEARCH
const inputChange = e => {
    e.preventDefault();
    limit = 12;
    verMas = 1;

    search(searchInput.value);
}

btnClose.addEventListener('click', closeSrch);

function closeSrch() {
    searchInput.value = "";
    searchBox.classList.toggle('active');
}

btnVerMas.addEventListener('click', function() {
    search(searchInput.value);
});

// funcion busqueda y resultados
// TRAIGO GIF Q COINCIDEN CON VALUE INPUT
function search(q) {
    const apiKey = "zj7Clj46qXUz60K9BlzesRCiJXM8sxyj";
    const path = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${limit}`;

    fetch(path)
        .then(res => res.json())
        .then(json => {

            verMas = verMas + 1;
            limit = 12 * verMas;

            showGifsSearch(json);
        })
        .catch(err => {
            console.log(err.message);
        })
}

// RECORRO DATA GIF E IMPRIMO 
function showGifsSearch(json) {

    let resultsHTML = '';

    json.data.forEach(obj => {
        const id = obj.id;
        const url = obj.images.fixed_width.url;
        const title = obj.title;
        const userName = obj.username;

        resultsHTML += `
                <div class="resultado" id="resultado">
                      <img class="abracadabra imgResultado" src="${url}" id="${id}">
                      <div class="overlay overlayFade" id="${id}">
                      <div class="textOverlay text">
                          <h3>${userName}</h3>
                          <h1> ${title}</h1>
                      </div>
                        <div class="iconos-overlay" id="iconosOverlay">
                            <img class="iconos icon-download" id="iconDownload" src="imagenes/slider/icon-download.svg">
                            <img class="iconos icon-fav" id="${id}" src="imagenes/slider/icon-fav.svg">
                            <img class="iconos icon-fav-selected" id="${id}" src="imagenes/slider/icon-fav-active.svg">
                            <img class="iconos icon-max" id="${id}" src="imagenes/slider/icon-max.svg">
                        </div>
                      </div>
                    </div>`;
    });
    // IMPRIMO EN CONTAINER GIF
    searchName.innerHTML = searchInput.value.toUpperCase();
    containerResultado.classList.add('active');
    // containerGifs.setAttribute("class", "container-gifs");
    containerGifs.innerHTML = resultsHTML;

    // VER
    if (json.data.length === 50) {
        btnVerMas.style.display = 'none';
    }

    let sinResultsContainer = document.getElementById('sinResultsContainer');
    if (resultsHTML.length === 0) {
        containerResultado.classList.remove('active');
        selectContainer.classList.remove('active')
        containerGifs.removeAttribute("class", "container-gifs");
        sinResultsContainer.style.display = 'flex';
    } else {
        sinResultsContainer.style.display = 'none';
    };
};