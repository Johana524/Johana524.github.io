// document.addEventListener('DOMContentLoaded', (e) => {

//     if (localStorage.getItem('mygifos')) {
//         mygifos = JSON.parse(localStorage.getItem('mygifos'));
//         console.log(mygifos)
//         createGifos()
//     }
// })

// CREAR GIFO
const containerCrear = document.querySelector('.container-crear');
const boxCrear = document.querySelector('.box-crear');
const textoCrear = document.querySelector('.texto-crear');
const textoCrearcomenzar = document.querySelector('.texto-crear-comenzar');
const accionButtons = document.querySelector('.accion-buttons');
const video = document.getElementById('video');
const uploadOverlay = document.getElementById('uploadOverlay');
const h3upload = document.querySelector('.h3-upload')
const repetirCaptura = document.getElementById('repetirCaptura');
let recorder;
let formdata;
let stream;

// funcion q inicia captura
async function getStreamAndRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
        })

        // utilizo stream como src y empiezo a reproducir
        video.srcObject = stream;
        await video.play();

        return stream;

    } catch (error) {
        console.error(error);
    }
}

const crearSecundario = document.querySelector('.crear-secundario')
    .addEventListener('click', async(e) => {

        switch (e.target.innerText) {
            case ('COMENZAR'):
                containerCrear.classList.add('comenzar');
                accionButtons.textContent = 'GRABAR';

                break;
            case ('2'):
                console.log('paso dos');
                containerCrear.classList.add('pasodos');
                containerCrear.classList.remove('comenzar');
                // implemento funcion
                stream = await getStreamAndRecord();
                break;

            case ('GRABAR'):

                console.log("Grabando", stream);
                recorder = RecordRTC(stream, {
                    type: "gif",
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                    onGifRecordingStarted: function() {
                        console.log("started")
                    },
                });

                recorder.startRecording();
                initTimer();
                accionButtons.textContent = 'FINALIZAR';
                break;

            case ('FINALIZAR'):
                await recorder.stopRecording();
                await video.pause();

                stopTimer(timer)

                accionButtons.textContent = 'SUBIR GIFO';
                containerCrear.classList.add('finalizar');

                formdata = new FormData();
                formdata.append("file", recorder.getBlob(), "myGif.gif");
                console.log(formdata.get("file"))

                repetirCaptura.addEventListener("click", async() => {
                    console.log("repetir");
                    accionButtons.textContent = 'GRABAR';
                    containerCrear.classList.remove('finalizar');
                    stream = await getStreamAndRecord()
                });

                break;
            case ('SUBIR GIFO'):
                console.log('SUBIENDO...');

                containerCrear.classList.remove('pasodos');
                containerCrear.classList.add('subir');
                accionButtons.textContent = 'COMENZAR';
                // agrego overlay
                boxCrear.classList.add('uploadOverlayActive');

                try {
                    const response = await uploadGif(formdata);
                    console.log(response);

                    boxCrear.classList.add('uploadOverlayOk');

                    const gifo = await fetchGifById(response.data.id);
                    storageMyGifo(gifo.data)

                } catch (error) {
                    console.error(error);
                }
                break;
        }
    })

async function uploadGif(formdata) {
    var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
    };

    return await fetch(
        `https://upload.giphy.com/v1/gifs?api_key=zj7Clj46qXUz60K9BlzesRCiJXM8sxyj`,
        requestOptions

    ).then((response) => response.json());
}

async function fetchGifById(id) {
    console.log(id);
    return await fetch(
        `https://api.giphy.com/v1/gifs/${id}?api_key=zj7Clj46qXUz60K9BlzesRCiJXM8sxyj`
    ).then((response) => response.json());
}


let mygifos = localStorage.getItem("mygifos");
mygifos = mygifos ? JSON.parse(mygifos) : [];

function storageMyGifo(gifo) {
    mygifos.push(gifo);
    localStorage.setItem("mygifos", JSON.stringify(mygifos));
}


//------ MIS GIFOS ------------
const btnMisGifos = document.getElementById('btnMisGifos');
const miniContainerMisGifos = document.getElementById("miniContainerMisGifos");

btnMisGifos.addEventListener('click', e => {
    clickMisGifos(e)
    if (localStorage.getItem('mygifos')) {
        mygifos = JSON.parse(localStorage.getItem('mygifos'));
        console.log(mygifos)
        createGifos()
    }

    if (mygifos.length) {
        console.log(mygifos.length)
        miniContainerMisGifos.classList.remove('header-misgifos-empty')
        createGifos(miniContainerMisGifos, mygifos, { type: "mygifo", original: true });
    } else {
        miniContainerMisGifos.innerHTML = `
          <img
              src="imagenes/icon-mis-gifos-sin-contenido.svg"
              alt="busqueda-sin-resultado"
          >
          <p class="no-result-text">¡Anímate a crear tu primer GIFO!</p>
        `;
        miniContainerMisGifos.classList.add('header-misgifos-empty')
    }
})


const clickMisGifos = e => {
    e.preventDefault();
    main.classList.add('activeMisGifos');
    main.classList.remove('activeFavs');
    main.classList.remove('activeCrear');
}

function createGifos(container, gifos, options) {
    if (!container) return;
    container.innerHTML = '';
    gifos.forEach(gifo => {

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("mis-gifos");

        const img = document.createElement("img");
        img.setAttribute(
            "src",
            gifo.images.fixed_width.url
        )
        img.classList.add("imgResultado");
        img.setAttribute("alt", gifo.title);

        const overlayMygif = document.createElement("div");
        overlayMygif.classList.add("overlay");
        overlayMygif.classList.add("overlayFade");

        overlayMygif.innerHTML = `
         <div class="textOverlay text">
            <h3>${gifo.username}</h3>
            <h1>${gifo.title}</h1>
         </div>
         <div class="iconos-overlay" id="iconosOverlay">
            <img class="iconos icon-trash" id="iconTrash" src="imagenes/icon-trash-normal.svg">
            <img class="iconos icon-fav" id="" src="imagenes/slider/icon-fav.svg">
            <img class="iconos icon-max" id="iconMax" src="imagenes/slider/icon-max.svg">
         </div>
        `;
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlayMygif)
        container.appendChild(imageContainer);
    });
}

// TIMER
let timer = document.getElementById('timer');
var cronometro;

function stopTimer() {
    clearInterval(cronometro);
}

function initTimer() {

    contador_s = 00;
    contador_m = 00;
    contador_h = 00;
    s = document.getElementById('segundos');
    m = document.getElementById('minutos');
    h = document.getElementById('horas');

    cronometro = setInterval(
        function() {
            if (contador_s == 60) {
                contador_s = 00;
                contador_m++;
                m.innerHTML = contador_m;

                if (contador_m == 60) {
                    contador_m++;
                    contador_h++;
                    h.innerHTML = contador_h;
                }
            }
            if (contador_s < 10) {
                s.innerHTML = '0' + contador_s;
                contador_s++;
            } else {
                s.innerHTML = contador_s;
                contador_s++;
            }
            if (contador_m < 10) {
                m.innerHTML = '0' + contador_m;
            } else {
                m.innerHTML = contador_m;
            }
        }, 1000)
};