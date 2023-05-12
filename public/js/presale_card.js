addEventListener("load", (event) => {
    const cards = document.querySelectorAll('.presale_card');

    function map(val, minA, maxA, minB, maxB) {
        return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
    }

    function PresaleCard_MouseMove(card, ev) {
        const inner = card.querySelector('.card_inner');
        if (window.innerWidth >= 700) {
            let cardWidth = card.offsetWidth;
            let cardHeight = card.offsetHeight;
            let mouseX = ev.offsetX;
            let mouseY = ev.offsetY;
            let rotateY = map(mouseX, 0, cardWidth, -20, 20);
            let rotateX = map(mouseY, 0, cardHeight, 20, -20);
            let brightness = map(mouseY, 0, cardHeight, 1.5, 0.5);

            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            inner.style.filter = `brightness(${brightness})`;
        } else {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            inner.style.filter = 'brightness(1)';
        }
    }

    // Set up the cards
    cards.forEach((card) => {
        card.addEventListener('mousemove', (ev) => {
            PresaleCard_MouseMove(card, ev);
        });
        card.addEventListener('mouseleave', (ev) => {
            const inner = card.querySelector('.card_inner');
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            inner.style.filter = 'brightness(1)';
        });
    });
});