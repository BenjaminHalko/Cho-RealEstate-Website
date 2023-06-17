addEventListener("load", (event) => {
    const mainBackground = document.querySelector('.main-background');
    document.querySelectorAll('.location_card').forEach((card) => {
        card.addEventListener('mouseenter', (ev) => {
            const fade = document.createElement('span');
            mainBackground.appendChild(fade);
            fade.classList = 'main-background fading';
            fade.style.setProperty("background-image",`url('/images/${card.style.getPropertyValue('--background')}')`);
            fade.addEventListener('animationend', (ev) => {
                mainBackground.style.setProperty('background-image',fade.style.getPropertyValue('background-image'));
                fade.remove();
            });
            
        });
    });
});