let urlParameters = new URLSearchParams(window.location.search)
let id = urlParameters.get("id")
const photographersSection = document.querySelector(".photographer_section");
const photographerHeader = document.querySelector(".photograph-header")
const filterlist = document.querySelector(".filtres ul")
const filterrow = document.querySelector(".filtres i")
const filter = document.querySelectorAll(".filtres li")
const firstfilter = document.querySelector(".filtres li:nth-child(1)")
const secondfilter = document.querySelector(".filtres li:nth-child(2)")
const thirdfilter = document.querySelector(".filtres li:nth-child(3)")
const photographies = document.querySelector(".photographies")
const fixedinfos = document.querySelector(".fixedinfos")
let likes = []
let titles = []
let dates = []
let totallikes = 0


async function displayPhotographer(photographers) {
    
    photographers.forEach((photographer) => {
        if(photographer.id == id){
            const photographerModel = photographerFactory(photographer);
            const userSelfDOM = photographerModel.getUserCardDOM("photographer");
            photographersSection.appendChild(userSelfDOM);
            
            const photographerImg = photographerHeader.appendChild(document.createElement("img"))
            photographerImg.setAttribute("src", "/assets/photographers/" + photographer.portrait)
            photographerImg.setAttribute("alt", "Portrait de " + photographer.name)
            let fixedlikes = document.createElement("p")
            data.media.forEach((media) => {
                if(media.photographerId == photographer.id){
                    let publication = document.createElement("article")
                    let underpublication = document.createElement("div")
                    let title = document.createElement("h3")
                    let hearts = document.createElement("p")
                    if(media.video){
                        let video = document.createElement("video")
                        video.src = "/assets/images/photos/" + media.video
                        publication.appendChild(video)
                    }else{
                        let photo = document.createElement("img")
                        photo.src = "/assets/images/photos/" + media.image
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
            let fixedprice = document.createElement("p")
            fixedlikes.innerHTML = totallikes + '<i class="fas fa-heart"></i>'
            fixedlikes.classList.add("fixedlikes")
            fixedprice.innerHTML = photographer.price + "€ /jour"
            fixedinfos.appendChild(fixedlikes)
            fixedinfos.appendChild(fixedprice)

            document.querySelectorAll(".photographies article").forEach(article => {
                tri(likes, parseInt(article.querySelector("p").innerHTML.replace('<i class="fas fa-heart"></i>', "")), article)
            });

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

filterlist.addEventListener("click", function(){
    if(filterlist.opened == true){
        showHideFilterList("", "", "", "", "", false)
        setTimeout(() => {
            filterlist.style.transition = ""
            secondfilter.style.transition = ""
            thirdfilter.style.transition = ""
        }, 400);
    }else{
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
        setTimeout(showHideFilterList("rotate(0deg)", ".05em solid white", "translate(0, 0)", "translate(0, 0)", "10em", true), 0);
    }
})

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
            filterlist.opened = false
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

function showHideFilterList(rowRotation, filterOneBorder, filterTwoTrans, filterThreeTrans, filterListHeight, invert){
    filterrow.style.transform = rowRotation
    firstfilter.style.borderBottom = filterOneBorder
    secondfilter.style.transform = filterTwoTrans
    thirdfilter.style.transform = filterThreeTrans
    filterlist.style.height = filterListHeight
    filterlist.opened = invert
}


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
        }
    });
}