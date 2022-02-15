async function displayData(photographers){
    const photographersSection = document.querySelector(".photographer_section")
    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer)
        const userCardDOM = photographerModel.getUserCardDOM("home")
        photographersSection.appendChild(userCardDOM)
    })
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers()
    displayData(photographers)
}

let tocontent = document.querySelector(".tocontent")
window.addEventListener("scroll", function(e) {
    if (scrollY <=10) {
        tocontent.style.display = "none"
    }else{
        tocontent.style.display = "initial"
    }
})