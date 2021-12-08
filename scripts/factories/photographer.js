//Prends les datas dans le fichier JSON
let data = []
fetch("/data/photographers.json")
.then((res) => {
    const promesse = res.json();
    return promesse
})
.then((datas) =>{
    data = datas
    init()
})
async function getPhotographers() {
    // Penser à remplacer par les données récupérées dans le json
    const photographers = data.photographers
    // et bien retourner le tableau photographers seulement une fois
    return ({
        photographers: [...photographers]})
    }
    
    function photographerFactory(data) {
        const { name, portrait, price, tagline, city, country, id} = data;
        const picture = `assets/photographers/${portrait}`;
        
        function getUserCardDOM(page) {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        const h2 = document.createElement( 'h2' );
        const plocation = document.createElement( 'p' );
        const ptagline = document.createElement( 'p' );
        const pprice = document.createElement( 'p' );
        const a = document.createElement( 'a' )

        img.setAttribute("src", picture)
        img.setAttribute("alt", "Portrait de " + name)
        h2.textContent = name;
        plocation.textContent = city + ", " + country;
        ptagline.textContent = tagline;
        pprice.textContent = price + "€/jour";

        plocation.classList.add("location")
        ptagline.classList.add("tagline")
        pprice.classList.add("price")
        
        if(page == "home"){
            article.appendChild(a);
            a.setAttribute("href", "./photographer.html?id="+ id);
            a.appendChild(img);
        }
        
        article.appendChild(h2);
        article.appendChild(plocation);
        article.appendChild(ptagline);
        
        if(page == "home"){
            article.appendChild(pprice);
        }
        return (article);
    }

    return { name, picture, price, tagline, city, country, getUserCardDOM }
}