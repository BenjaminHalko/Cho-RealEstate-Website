addEventListener("load", (event) => {

    const panels = document.querySelector('.intro').children;

    for (let i = 0; i < panels.length; i++) {
        panels[i].style.transitionDelay = `${i * 0.2}s`;
    }
    
    document.querySelector('.intro').classList.remove('intro');
});