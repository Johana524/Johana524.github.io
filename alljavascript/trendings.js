// ---- TRENDINGS ---------------------------------
let carousel = document.querySelector('.carousel');

document.addEventListener("DOMContentLoaded", trending);
console.log("DOMContentLoaded...");
//traigo gifos
function trending() {

    let urlTren = 'https://api.giphy.com/v1/gifs/trending?api_key=zj7Clj46qXUz60K9BlzesRCiJXM8sxyj&limit=25&rating=g';

    fetch(urlTren)
        .then(res => res.json())
        .then(json => {
            showGifsTrendings(json)
        })
}

function showGifsTrendings(json) {

    let trendingsHTML = ''
        //inserto gifos en carousel
    json.data.forEach(obj => {

        const id = obj.id;
        const url = obj.images.fixed_width.url;
        const title = obj.title;
        const userName = obj.username;

        trendingsHTML += `
                <div id= "gifsTrendings" class="trendings">
                      <img class="imgTrendings imgResultado" src="${url}" id="${id}">
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
    })

    carousel.innerHTML = trendingsHTML;
}


//Slider
const fila = document.querySelector('.container-carousel');
const flechaIzquierda = document.getElementById("flechaIzquierda");
const flechaDerecha = document.getElementById("flechaDerecha");

flechaDerecha.addEventListener('click', () => {
    //scroll derecho =a lo q ya tenemos + offsetwidth q es el total del container
    fila.scrollLeft += fila.offsetWidth;
    //SI PONGO GIFS.OFF NO ANDA EN DESKTOP
    //addEventListener 'resize'?
});

flechaIzquierda.addEventListener('click', () => {
    fila.scrollLeft -= fila.offsetWidth;
});