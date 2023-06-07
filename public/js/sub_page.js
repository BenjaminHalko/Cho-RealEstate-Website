addEventListener("load", (event) => {
    const panels = document.querySelectorAll('.panel, .floating-btn, .floating-img');

    for (let i = 0; i < panels.length; i++) {
        panels[i].style.animationName = 'fade_in';
        panels[i].style.animationDelay = `${i * 0.2}s`;
    }
    
    document.querySelector('.intro').classList.remove('intro');
});