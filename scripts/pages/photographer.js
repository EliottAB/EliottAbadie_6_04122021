let urlParameters = new URLSearchParams(window.location.search)
let id = urlParameters.get("id")
document.querySelector(".modal form").action = location.href
const photographersSection = document.querySelector(".photographer_section");
const photographerHeader = document.querySelector(".photograph-header")
const filterlist = document.querySelector(".listtri")
const filterscontainer = document.querySelector(".filtres ul")
const filterrow = document.querySelector(".trirow")
const filter = document.querySelectorAll(".tributton")
const firstfilter = document.querySelector(".tributton.first")
const secondfilter = document.querySelector(".tributton.second")
const thirdfilter = document.querySelector(".tributton.third")
const photographies = document.querySelector(".photographies")
const fixedinfos = document.querySelector(".fixedinfos")
const lightbox = document.querySelector(".lightbox")
const mediabox = document.querySelector(".mediabox")
const LBarrowleft = document.querySelector(".prevrow")
const LBarrowright = document.querySelector(".nextrow")
const LBclose = document.querySelector(".lightbox .croix")
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
            photographerImg.setAttribute("src", "assets/photographers/" + photographer.portrait)
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
                        video.src = "assets/images/photos/" + media.video
                        video.classList.add("displayedmedia")
                        video.addEventListener("click", () =>{
                            launchLightbox("initial", "none", true)
                            displayMedia("video", video.src, video.parentElement)
                        })
                        video.addEventListener("keydown", (e) =>{
                            if(e.key == " " || e.key == "Enter"){
                                launchLightbox("initial", "none", true)
                                displayMedia("video", video.src, video.parentElement)
                            }
                        })
                        video.role = "button"
                        publication.appendChild(video)
                    }else{
                        let photo = document.createElement("img")
                        photo.src = "assets/images/photos/" + media.image
                        photo.classList.add("displayedmedia")
                        photo.alt = media.title
                        photo.addEventListener("click", () =>{
                            launchLightbox("initial", "none", true)
                            displayMedia("img",photo.src, photo.parentElement)
                        })
                        photo.addEventListener("keydown", (e) =>{
                            if(e.key == " " || e.key == "Enter"){
                                launchLightbox("initial", "none", true)
                                displayMedia("img",photo.src, photo.parentElement)
                            }
                        })
                        photo.role = "button"
                        publication.appendChild(photo)
                    }
                    totallikes += media.likes
                    title.innerHTML = media.title
                    hearts.innerHTML = media.likes + '<img src="assets/icons/redheart.png" class="redheart" alt="redheart"></img>'
                    hearts.photoid = media.id
                    hearts.setAttribute("role", "button")
                    hearts.setAttribute("aria-label", media.likes + "likes")
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
            fixedlikes.innerHTML = totallikes + '<img src="assets/icons/blackheart.png" alt="blackheart"></img>'
            fixedlikes.classList.add("fixedlikes")
            fixedprice.innerHTML = photographer.price + "€ /jour"
            fixedinfos.appendChild(fixedlikes)
            fixedinfos.appendChild(fixedprice)

            document.querySelectorAll(".photographies article").forEach(article => {
                tri(likes, parseInt(article.querySelector("p").innerHTML.replace('<img src="assets/icons/redheart.png" class="redheart" alt="redheart"></img>', "")), article)
            });

            //click sur le boutton like, ajoute ou retire 1
            document.querySelectorAll(".publicationhearts").forEach(element => {
                element.addEventListener("click", () => {
                    heartchange(element)
                })
            })
        
            document.querySelectorAll(".publicationhearts").forEach(element => {
                element.addEventListener("keydown", (e) => {
                    if(e.key == " " || e.key == "Enter"){
                        heartchange(element)
                    }
                })
            });
        }
    });

};

function heartchange(element){
    if(element.likes == element.innerText){
        element.innerHTML = parseInt(element.innerHTML) + 1 + '<img src="assets/icons/redheart.png" class="redheart" alt="redheart"></img>'
        totallikes += 1
    }else{
        element.innerHTML = parseInt(element.innerHTML) - 1 + '<img src="assets/icons/redheart.png" class="redheart" alt="redheart"></img>'
        totallikes -= 1
    }
    document.querySelector(".fixedlikes").innerHTML = totallikes + '<img src="assets/icons/blackheart.png" alt="blackheart"></img>'
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayPhotographer(photographers);
};

//au click de la liste, ferme ou ouvre, et réaffiche les bouttons de tri.
    filterlist.addEventListener("click", function(){
        if(filterlist.opened == true){
            showHideFilterList("", "", false, "")
            triButtonTabIndex("-1")
            filterscontainer.ariaExpanded = "false"
        }else{
            showHideFilterList("rotate(90deg)", "11em", true, "initial")
            triButtonTabIndex("0")
            replaceFilters()
            filterscontainer.ariaExpanded = "true"
        }
    })

//au click d'un filtre tri.
filter.forEach((element) =>{
    element.addEventListener("click", function(e){
        e.stopPropagation()
        showHideFilterList("", "", false, "",)
        triButtonTabIndex("-1")
        filterscontainer.ariaExpanded = "false"
        filterlist.innerHTML = element.innerHTML
        if(element.innerHTML == "Titre"){
            document.querySelectorAll(".photographies article").forEach(article => {
                tri(titles, article.querySelector("h3").innerHTML, article)
            });
        }
        if(element.innerHTML == "Popularité"){
            document.querySelectorAll(".photographies article").forEach(article => {       
                tri(likes, parseInt(article.querySelector("p").innerHTML.replace('<img src="assets/icons/redheart.png" class="redheart" alt="redheart"></img>', "")), article)
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
function showHideFilterList(rowRotation, filterListHeight, invert, display){
    filterrow.style.transform = rowRotation
    document.querySelector(".filtres ul").style.display = display
    filterlist.style.height = filterListHeight
    filterlist.opened = invert
}

//replace le nom des filtres
function replaceFilters(){
    if(filterlist.innerHTML.includes("Date")){
        firstfilter.innerHTML = "Date"
        secondfilter.innerHTML = "Popularité"
        thirdfilter.innerHTML = "Titre"
    }
    if(filterlist.innerHTML.includes("Popularité")){
        firstfilter.innerHTML = "Popularité"
        secondfilter.innerHTML = "Date"
        thirdfilter.innerHTML = "Titre"
    }
    if(filterlist.innerHTML.includes("Titre")){
        firstfilter.innerHTML = "Titre"
        secondfilter.innerHTML = "Popularité"
        thirdfilter.innerHTML = "Date"
    }
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
        article.querySelectorAll("p, video, .displayedmedia").forEach(element => {
            element.tabIndex = article.order + ""
        });
        allorders.push(article.order)
    });
    allorders = []
}

function launchLightbox(LBdisplay, maindisplay, opened){
    document.querySelectorAll("main>*").forEach(element => {
        element.style.display = maindisplay
    });
    document.querySelector("header").style.display = maindisplay
    lightbox.style.display = LBdisplay
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
            if(article.querySelector("video")){
                displayMedia("video", article.querySelector("video").src, article)
            }else{
                if(article.querySelector(".displayedmedia")){
                displayMedia("img", article.querySelector("img").src, article)
                }
            }
            found = true
        }
    });
}

LBarrowleft.addEventListener("keydown", (e) => {
    if(e.key == " " || e.key == "Enter"){
        swipePhoto(1)
    }
})

LBarrowright.addEventListener("keydown", (e) => {
    if(e.key == " " || e.key == "Enter"){
        swipePhoto(-1)
    }
})

LBclose.addEventListener("keydown", (e) => {
    if(e.key == " " || e.key == "Enter"){
        launchLightbox('', '', false)
    }
})

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
        showHideFilterList("", "", false, "")
        filterlist.opened = false
    }
    if(e.key == "ArrowRight" && lightboxopened == true){
        swipePhoto(-1)
    }
    if(e.key == "ArrowLeft" && lightboxopened == true){
        swipePhoto(1)
    }
})