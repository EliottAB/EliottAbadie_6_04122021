let urlParameters = new URLSearchParams(window.location.search)
let id = urlParameters.get("id")

async function displayPhotographer(photographers) {
    const photographersSection = document.querySelector(".photographer_section");
    const photographerHeader = document.querySelector(".photograph-header")

    photographers.forEach((photographer) => {
        if(photographer.id == id){
        const photographerModel = photographerFactory(photographer);
        const userSelfDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userSelfDOM);

        const photographerImg = photographerHeader.appendChild(document.createElement("img"))
        photographerImg.setAttribute("src", "/assets/photographers/" + photographer.portrait)
        photographerImg.setAttribute("alt", "Portrait de " + photographer.name)
    }
    });
};

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayPhotographer(photographers);
};