function photographerFactory(data) {
    const { name, portrait, price, tagline, city, country} = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        const h2 = document.createElement( 'h2' );
        const pprice = document.createElement( 'p' );
        const plocation = document.createElement( 'p' );
        const ptagline = document.createElement( 'p' );
        const a = document.createElement( 'a' )

        img.setAttribute("src", picture)
        h2.textContent = name;
        pprice.textContent = price;
        ptagline.textContent = tagline;
        plocation.textContent = city + ", " + country;

        article.appendChild(a);
        a.setAttribute("href", "#")
        a.appendChild(img)
        article.appendChild(h2);
        article.appendChild(pprice);
        article.appendChild(ptagline)
        article.appendChild(plocation)
        return (article);
    }
    return { name, picture, price, tagline, city, country, getUserCardDOM }
}