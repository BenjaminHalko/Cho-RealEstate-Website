addEventListener("load", (event) => {
    const mainBackground = document.getElementById('mainBackground');

    const cards = document.querySelectorAll('.presale_card');
    let currentBackground = "contour/contour.png";

    cards.forEach((card) => {
        card.addEventListener('mouseenter', (ev) => {
            const fade = document.createElement('span');
            mainBackground.appendChild(fade);
            fade.classList = 'main-background fading';
            fade.style.setProperty("background-image",`url('/images/presale/${Math.random() > 0.5 ? 'contour/contour.png' : 'test/test.jpeg'}'`);
            fade.addEventListener('animationend', (ev) => {
                mainBackground.style.setProperty('background-image',fade.style.getPropertyValue('background-image'));
                fade.remove();
            });
            
        });
    });
});