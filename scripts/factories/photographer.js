//Prends les datas dans le fichier JSON
let data = []
let criteres = []
let headtaged = false
fetch("/data/photographers.json")
.then((res) => {
    const promesse = res.json();
    return promesse
})
.then((datas) =>{
    data = datas
    alltags = (datas.AllTags[0].tags)
    init()
})

async function getPhotographers() {
    // Penser à remplacer par les données récupérées dans le json
    photographers = data.photographers
    // et bien retourner le tableau photographers seulement une fois
    return ({
        photographers: [...photographers]})
    }
    function photographerFactory(data) {
        const { name, portrait, price, tagline, city, country, id, categories} = data;
        const picture = `assets/photographers/${portrait}`;
        
        function getUserCardDOM(page) {
            const article = document.createElement( 'article' );
            const section = document.createElement( 'section' );
            const img = document.createElement( 'img' );
            const plocation = document.createElement( 'p' );
            const ptagline = document.createElement( 'p' );
            const pprice = document.createElement( 'p' );
            const a = document.createElement( 'a' )
            const headercriteres = document.getElementById("headercriteres")
            
            img.setAttribute("src", picture)
            img.setAttribute("alt", "Portrait de " + name)
            plocation.textContent = city + ", " + country;
            ptagline.textContent = tagline;
            pprice.textContent = price + "€/jour";

            plocation.tabIndex = "0"
            ptagline.tabIndex = "0"
            pprice.tabIndex = "0"
            
            plocation.classList.add("location")
            ptagline.classList.add("tagline")
            pprice.classList.add("price")
            
            if(page == "home"){
                const h2 = document.createElement( 'h2' );
                h2.tabIndex = "0"
                h2.textContent = name;
                article.appendChild(h2);
                article.appendChild(a);
                a.setAttribute("href", "./photographer.html?id="+ id);
                a.appendChild(img);
            }else{
                const h1 = document.createElement( 'h1' );
                h1.textContent = name;
                article.appendChild(h1);
            }
            
            article.appendChild(plocation);
            article.appendChild(ptagline);
            
            if(page == "home"){
                article.appendChild(pprice);
                section.classList.add("categories")
                article.appendChild(section);
                hashtags()
            }
            
            //Ajoute les hashtags et leurs utilitées
            function hashtags(){
                for(let x = 0; x != categories.length; x++){
                    let button = section.appendChild(document.createElement("button"))
                button.innerHTML = categories[x]
                button.classList.add("categorie")
                button.tabIndex = "-1"
                buttonEvent(button)
                }
                if(headtaged == false){
                    for(let x in alltags){
                        let button = headercriteres.appendChild(document.createElement("button"))
                        button.innerHTML = alltags[x]
                        button.classList.add("categorie")
                        buttonEvent(button)
                    }
                    headtaged = true
                }
            }
            return (article);
        }
        
        return { name, picture, price, tagline, city, country, getUserCardDOM }
    }
    function applyCriteres(){
        photographers.forEach(element => {
            let isInCriteres = false
            for(let i in criteres){
                if(element.categories.indexOf(criteres[i]) > -1 == false){
                    isInCriteres = true
                }
            }
            if(isInCriteres == false){
                document.querySelectorAll(".photographer_section article")[photographers.indexOf(element)].style.display = "block"
            }else{
                document.querySelectorAll(".photographer_section article")[photographers.indexOf(element)].style.display = "none"
            }
            if(criteres.length == 0){
                document.querySelectorAll(".photographer_section article")[photographers.indexOf(element)].style.display = "block"
            }
        });
    }

    //au click d'un tag, applique les criteres et actionne les tags.
    function buttonEvent(button){
        button.addEventListener('click', function(){
                        
            if(button.classList.contains("activatetag")){
                button.classList.remove("activatetag")
                history.replaceState({}, "", window.location.href.replace("/" + button.innerHTML, ""))
                document.querySelectorAll(".categories button, #headercriteres button").forEach(element => {
                    if(element.innerHTML == button.innerHTML){
                        element.classList.remove("activatetag")
                    }
                });
                criteres.splice(criteres.indexOf(button.innerHTML), 1)
                applyCriteres()
            }else{
                criteres.push(button.innerHTML)
                applyCriteres()
                document.querySelectorAll(".categories button, #headercriteres button").forEach(element => {
                    if(element.innerHTML == button.innerHTML){
                        element.classList.add("activatetag")
                    }
                });
            }
        })
    }

