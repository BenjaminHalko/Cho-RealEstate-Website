addEventListener("load", (event) => {
    const mainBackground = document.querySelector('.main-background');

    const cards = document.querySelectorAll('.card3D');
    let currentBackground = 0;

    cards.forEach((card) => {
        card.addEventListener('mouseenter', (ev) => {
            const fade = document.createElement('span');
            mainBackground.appendChild(fade);
            fade.classList = 'main-background fading';
            currentBackground = 1-currentBackground;
            fade.style.setProperty("background-image",`url('/images/locations/contour/${currentBackground ? 'contour.png' : 'main_background.jpeg'}'`);
            fade.addEventListener('animationend', (ev) => {
                mainBackground.style.setProperty('background-image',fade.style.getPropertyValue('background-image'));
                fade.remove();
            });
            
        });
    });
});