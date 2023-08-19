(function() {
    const panels = document.querySelectorAll('.panel, .floating-btn, .floating-img');

    for (let i = 0; i < panels.length; i++) {
        panels[i].style.setProperty('--delay',`${i * 0.2}s`);
    }
    
    document.querySelector('.intro').classList.remove('intro');
})();