addEventListener("load", (event) => {
    const cards = document.querySelectorAll('.presale_card');

    function map(val, minA, maxA, minB, maxB) {
        return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
    }

    function PresaleCard(card, ev) {
        let inner = card.querySelector('.card_inner');
        let cardWidth = card.offsetWidth;
        let cardHeight = card.offsetHeight;
        let mouseX = ev.offsetX;
        let mouseY = ev.offsetY;
        let rotateY = map(mouseX, 0, cardWidth, -20, 20);
        let rotateX = map(mouseY, 0, cardHeight, 20, -20);
        let brightness = map(mouseY, 0, cardHeight, 1.5, 0.5);

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        inner.style.filter = `brightness(${brightness})`;
    }

    // Set up the cards
    cards.forEach((card) => {
        card.addEventListener('mousemove', (ev) => {
            PresaleCard(card, ev);
        });
        card.addEventListener('mouseleave', (ev) => {
            let inner = card.querySelector('.card_inner');
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            inner.style.filter = 'brightness(1)';
        });
    });
});