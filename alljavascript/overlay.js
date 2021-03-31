//-------------- ICONOS OVERLAY -----------------------------
document.addEventListener('DOMContentLoaded', (e) => {
    // si existe algo en ls
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarFavs()
    }
})

//-- FAVS
const btnFavs = document.getElementById('btnFavs');
const main = document.querySelector('main');
const headerFavsEmpty = document.getElementById('headerFavsEmpty');
const miniContainerFavs = document.getElementById('miniContainerFavs');
const templateFav = document.getElementById('templateFavs').content
const fragment = document.createDocumentFragment();
const iconFavActive = document.querySelector('.icon-fav-active')
const btnPaginacion = document.getElementById('btnPaginacion')
let carrito = {};

let gifsClick = document.querySelectorAll('.click-on-gif');

for (i of gifsClick) {
    i.addEventListener('click', function(e) {
        clickIconsOverlay(e)
    })
}

// BOTONES OVERLAY 
const clickIconsOverlay = e => {
    const iconoOver = e.target.classList[1];
    const parentsElements = e.target.parentElement.parentElement.parentElement
    switch (iconoOver) {
        case ('imgResultado'):
            console.log('click img');
            setMax(parentsElements);
            maxDiv.classList.add('activeMax');
            break;
        case ('icon-max'):
            console.log('click en max');
            setMax(parentsElements);
            maxDiv.classList.add('activeMax');
            break;
        case ('icon-fav'):
            console.log('click en fav');
            setFavoritos(parentsElements);
            break;
        case ('icon-download'):
            console.log('click en download');
            setDownload(parentsElements)
            break;
        case ('icon-link'):
            console.log('click en link');
            break;
        case ('icon-trash'):
            console.log('click trash');
            break;
    }

    e.preventDefault();
}

// -----DOWNLOAD

const setDownload = objeto => {
    console.log(objeto)
    const download = {
        imagen: objeto.querySelector('.imgResultado').src,
        title: objeto.querySelector('.text h1').textContent
    }
    const img = download.imagen
    const title = download.title
    descarga(img, title)
}

const descarga = async function(img, title) {
    console.log(img, title)
    let a = document.createElement("a");
    let response = await fetch(img);
    let gif = await response.blob();
    a.download = title;
    a.href = window.URL.createObjectURL(gif);
    a.dataset.downloadurl = [
        "application/octet-stream",
        a.download,
        a.href
    ].join(":");
    a.click();
}

// ---FAVS

const setFavoritos = objeto => {
    console.log(objeto)
    const favorito = {
            id: objeto.querySelector('.icon-fav').id,
            imagen: objeto.querySelector('.imgResultado').src,
            title: objeto.querySelector('.text h1').textContent,
            userName: objeto.querySelector('.text h3').textContent,
        }
        // empujo a carrito una copia de favorito
    carrito[favorito.id] = {...favorito } //spreadoperators
    localStorage.setItem('carrito', JSON.stringify(carrito))

    pintarFavs()
}

const pintarFavs = () => {

    var pageSize = 12;
    var pageNumber = 1;
    var pagination;
    var array = Object.values(carrito)
    var pageCont = Math.ceil(array.length / pageSize)

    function paginate(array, pageSize, pageNumber) {
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    }

    function showFavs(_array) {
        pagination = paginate(array, pageSize, pageNumber)
        miniContainerFavs.innerHTML = '';
        pagination.forEach(favorito => {
            templateFav.querySelector('.imgResultado').src = favorito.imagen
            templateFav.querySelector('.text h3').textContent = favorito.title
            templateFav.querySelector('.text h1').textContent = favorito.userName
            templateFav.querySelector('.icon-fav-active').id = favorito.id

            const clone = templateFav.cloneNode(true)
            fragment.appendChild(clone)
        })
        miniContainerFavs.appendChild(fragment)

        if (pageCont > 1) {
            btnVerMasFav.style.display = 'block';
        } else {
            btnVerMasFav.style.display = 'none';
        }
        if (pageNumber > 1) {
            btnVerMenosFav.style.display = 'block';
        } else {
            btnVerMenosFav.style.display = 'none';
        }
    }

    btnPaginacion.addEventListener('click', (e) => {
        switch (e.target.classList[0]) {
            case ('btn-anterior'):
                console.log('anterior')
                pageNumber--;
                showFavs(pagination)
                break;
            case ('btn-siguiente'):
                console.log('siguiente')
                pageNumber++;
                showFavs(pagination)
                break;
        }
        e.preventDefault();
    })

    showFavs(array)

    if (miniContainerFavs.length === 0) {
        headerFavsEmpty.style.display = 'flex';
    } else {
        headerFavsEmpty.style.display = 'none';
    }
}


btnFavs.addEventListener('click', e => {
    clickFavs(e);
})

const clickFavs = e => {
    e.preventDefault();
    main.classList.add('activeFavs');
    main.classList.remove('activeMisGifos');
    main.classList.remove('activeCrear');
}

// ------------ MAX ---------------------------

let maxDiv = document.querySelector('.maxDiv');
const templateMaxGifs = document.getElementById('templateMaxGifs').content;
const poputModal = document.getElementById('poputModal');
let maxx = {};


maxDiv.addEventListener('click', e => {
    if (e.target.className === "close-modal") {
        maxDiv.classList.remove('activeMax');
    }
})

const setMax = objGifMax => {

    const gifMax = {
        id: objGifMax.querySelector('.icon-max').id,
        id: objGifMax.querySelector('.icon-fav').id,
        imagen: objGifMax.querySelector('.imgResultado').src,
        title: objGifMax.querySelector('.text h1').textContent,
        userName: objGifMax.querySelector('.text h3').textContent
    }

    maxx[gifMax.id] = {...gifMax };

    pintarMaxGif();
}

const pintarMaxGif = () => {

    maxDiv.innerHTML = '';

    Object.values(maxx).forEach(gifMax => {
        templateMaxGifs.querySelector('.img-maxgif').src = gifMax.imagen
        templateMaxGifs.querySelector('.img-maxgif').id = gifMax.id
        templateMaxGifs.querySelector('.text h3').textContent = gifMax.userName
        templateMaxGifs.querySelector('.text h1').textContent = gifMax.title
        templateMaxGifs.querySelector('.icon-max').id = gifMax.id
        templateMaxGifs.querySelector('.icon-fav').id = gifMax.id
        const clone = templateMaxGifs.cloneNode(true)
        fragment.appendChild(clone)
    })
    maxDiv.appendChild(fragment)

}