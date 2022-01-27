let urlParameters = new URLSearchParams(window.location.search)
let id = urlParameters.get("id")
document.querySelector(".modal form").action = location.href
const photographersSection = document.querySelector(".photographer_section");
const photographerHeader = document.querySelector(".photograph-header")
const filterlist = document.querySelector(".listtri")
const filterrow = document.querySelector(".trirow")
const filter = document.querySelectorAll(".tributton")
const firstfilter = document.querySelector(".tributton.first")
const secondfilter = document.querySelector(".tributton.second")
const thirdfilter = document.querySelector(".tributton.third")
const photographies = document.querySelector(".photographies")
const fixedinfos = document.querySelector(".fixedinfos")
const lightbox = document.querySelector(".lightbox")
const mediabox = document.querySelector(".mediabox")
const main = document.querySelector("main")
let lightboxopened = false
let likes = []
let titles = []
let dates = []
let totallikes = 0
let copymedia
let allorders = []


async function displayPhotographer(photographers) {
    
    photographers.forEach((photographer) => {
        if(photographer.id == id){
            const photographerModel = photographerFactory(photographer);
            const userSelfDOM = photographerModel.getUserCardDOM("photographer");
            photographersSection.appendChild(userSelfDOM);
            
            const photographerImg = photographerHeader.appendChild(document.createElement("img"))
            photographerImg.setAttribute("src", "/assets/photographers/" + photographer.portrait)
            photographerImg.setAttribute("alt", "Portrait de " + photographer.name)

            //affiche les medias du photographer
            data.media.forEach((media) => {
                if(media.photographerId == photographer.id){
                    let publication = document.createElement("article")
                    let underpublication = document.createElement("div")
                    let title = document.createElement("h3")
                    let hearts = document.createElement("p")
                    if(media.video){
                        let video = document.createElement("video")
                        video.src = "/assets/images/photos/" + media.video
                        video.addEventListener("click", () =>{
                            launchLightbox("initial", "0", true)
                            displayMedia("video", video.src, video.parentElement)
                        })
                        publication.appendChild(video)
                    }else{
                        let photo = document.createElement("img")
                        photo.src = "/assets/images/photos/" + media.image
                        photo.alt = media.title
                        photo.addEventListener("click", () =>{
                            launchLightbox("initial", "0", true)
                            displayMedia("img",photo.src, photo.parentElement)
                        })
                        publication.appendChild(photo)
                    }
                    totallikes += media.likes
                    title.innerHTML = media.title
                    hearts.innerHTML = media.likes + '<i class="fas fa-heart"></i>'
                    hearts.photoid = media.id
                    hearts.classList.add("publicationhearts")
                    publication.date = media.date
                    likes.push(media.likes)
                    titles.push(media.title)
                    dates.push(media.date)
                    underpublication.appendChild(title)
                    underpublication.appendChild(hearts)
                    publication.appendChild(underpublication)
                    photographies.appendChild(publication)
                    document.querySelectorAll(".publicationhearts").forEach(element => {
                        if(media.id == element.photoid){
                            element.likes = media.likes
                        }
                    })
                }
            })
            let fixedlikes = document.createElement("p")
            let fixedprice = document.createElement("p")
            fixedlikes.innerHTML = totallikes + '<i class="fas fa-heart"></i>'
            fixedlikes.classList.add("fixedlikes")
            fixedprice.innerHTML = photographer.price + "€ /jour"
            fixedinfos.appendChild(fixedlikes)
            fixedinfos.appendChild(fixedprice)

            document.querySelectorAll(".photographies article").forEach(article => {
                tri(likes, parseInt(article.querySelector("p").innerHTML.replace('<i class="fas fa-heart"></i>', "")), article)
            });

            //click sur le boutton like, ajoute ou retire 1
            document.querySelectorAll(".publicationhearts").forEach(element => {
                element.addEventListener("click", () => {
                    if(element.likes == element.innerText){
                        element.innerHTML = parseInt(element.innerHTML) + 1 + '<i class="fas fa-heart" aria-hidden="true"></i>'
                        totallikes += 1
                    }else{
                        element.innerHTML = parseInt(element.innerHTML) - 1 + '<i class="fas fa-heart" aria-hidden="true"></i>'
                        totallikes -= 1
                    }
                    document.querySelector(".fixedlikes").innerHTML = totallikes + '<i class="fas fa-heart" aria-hidden="true"></i>'
                })
            })
        }
    });

};

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayPhotographer(photographers);
};

//au click de la liste, ferme ou ouvre, et réaffiche les bouttons de tri.
    filterlist.addEventListener("click", function(){
        if(filterlist.opened == true){
            showHideFilterList("", "", "", "", "", false)
            setTimeout(() => {
                filterlist.style.transition = ""
                secondfilter.style.transition = ""
                thirdfilter.style.transition = ""
            }, 400);
            triButtonTabIndex("-1")
        }else{
            triButtonTabIndex("0")
            replaceFilters()
            setTimeout(showHideFilterList("rotate(0deg)", ".05em solid white", "translate(0, 0)", "translate(0, 0)", "11em", true), 0);

        }
    })

//au click d'un filtre, enleve les transitions(evite les transitions au windows resize), et tri.
filter.forEach((element) =>{
    element.addEventListener("click", function(e){
        if(filterlist.opened == true){
            e.stopPropagation()
            showHideFilterList("", "", "", "", "", false)
            setTimeout(() => {
                filterlist.style.transition = ""
                secondfilter.style.transition = ""
                thirdfilter.style.transition = ""
            }, 400);
            triButtonTabIndex("-1")
        }else{
            triButtonTabIndex("0")
            replaceFilters()
            setTimeout(showHideFilterList("rotate(0deg)", ".05em solid white", "translate(0, 0)", "translate(0, 0)", "11em", true), 0);
        }
        firstfilter.innerHTML = element.innerHTML
        if(element.innerHTML == "Titre"){
            document.querySelectorAll(".photographies article").forEach(article => {
                tri(titles, article.querySelector("h3").innerHTML, article)
            });
        }
        if(element.innerHTML == "Popularité"){
            document.querySelectorAll(".photographies article").forEach(article => {       
                tri(likes, parseInt(article.querySelector("p").innerHTML.replace('<i class="fas fa-heart"></i>', "")), article)
            });
        }
        if(element.innerHTML == "Date"){
            document.querySelectorAll(".photographies article").forEach(article => {
                tri(dates, article.date, article)
            });
        }
        })
})

function triButtonTabIndex(tabindex){
    filter.forEach(element => {
        element.tabIndex = tabindex
    });
}


//ouvre ou ferme le volet de tri
function showHideFilterList(rowRotation, filterOneBorder, filterTwoTrans, filterThreeTrans, filterListHeight, invert){
    filterrow.style.transform = rowRotation
    firstfilter.style.borderBottom = filterOneBorder
    secondfilter.style.transform = filterTwoTrans
    thirdfilter.style.transform = filterThreeTrans
    filterlist.style.height = filterListHeight
    filterlist.opened = invert
}

//replace le nom des filtres et debug les transitions
function replaceFilters(){
    if(firstfilter.innerHTML.includes("Date")){
        secondfilter.innerHTML = "Popularité"
        thirdfilter.innerHTML = "Titre"
    }
    if(firstfilter.innerHTML.includes("Popularité")){
        secondfilter.innerHTML = "Date"
        thirdfilter.innerHTML = "Titre"
    }
    if(firstfilter.innerHTML.includes("Titre")){
        secondfilter.innerHTML = "Popularité"
        thirdfilter.innerHTML = "Date"
    }
    filterlist.style.transition = "height .4s"
    secondfilter.style.transition = "transform .4s"
    thirdfilter.style.transition = "transform .4s"
    }

//tri les medias, puis les affiches triés
function tri(filtre, domcompare, article){
    likes.sort((a,b) => {
        return b-a
    })
    titles.sort()
    dates = dates.sort((a,b) => {
        return new Date(b) - new Date(a)
    })
    filtre.forEach(element => {
        if(element == domcompare){
            article.style.order = filtre.indexOf(element) + 1
            article.order = filtre.indexOf(element) + 1
        }
    });

    //debug pour ne pas faire stagner le swipe des photos (l226-l239)
    document.querySelectorAll(".photographies article").forEach(article => {
        function isOrderTaken(){
            if(allorders.indexOf(article.order) >-1){
                article.order += 1
                isOrderTaken()
            }
        }
        isOrderTaken()
        article.querySelectorAll("h3, p, video, img").forEach(element => {
            element.tabIndex = article.order + ""
        });
        allorders.push(article.order)
    });
    allorders = []
}

function launchLightbox(LBdisplay, mainHeight, opened){
    lightbox.style.display = LBdisplay
    main.style.height = mainHeight
    lightboxopened = opened
}

//affiche le media cliqué dans la lightbox
function displayMedia(type, src, article){
    mediabox.innerHTML = ""
    copymedia = document.createElement(type)
    copymedia.order = article.order
    copymedia.src = src
    if(type == "video"){
        copymedia.controls = true
    }
    mediabox.appendChild(copymedia)
}

function swipePhoto(side){
    let found = false
    document.querySelectorAll(".photographies article").forEach(article => {
        if(copymedia.order - side == article.order && found == false){
            if(article.querySelector("img")){
                displayMedia("img", article.querySelector("img").src, article)

            }else{
                displayMedia("video", article.querySelector("video").src, article)
            }
            found = true
        }
    });
}

function logFormContent(){
    document.querySelectorAll(".modal input, .modal textarea").forEach(input => {
        console.log(input.value)
    });
}

window.addEventListener("keydown", (e) => {
    if(e.key == "Escape" && lightboxopened == true){
        launchLightbox("", "", false)
    }
    if(e.key == "Escape" && modalopened == true){
        closeModal()
    }
    if(e.key == "Escape" && filterlist.opened == true){
        showHideFilterList("", "", "", "", "", false)
        setTimeout(() => {
            filterlist.style.transition = ""
            secondfilter.style.transition = ""
            thirdfilter.style.transition = ""
        }, 400);
        filterlist.opened = false
    }
    if(e.key == "ArrowRight" && lightboxopened == true){
        swipePhoto(-1)
    }
    if(e.key == "ArrowLeft" && lightboxopened == true){
        swipePhoto(1)
    }
})