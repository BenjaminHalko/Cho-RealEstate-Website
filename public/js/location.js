addEventListener("load", (event) => {
    const panel = document.querySelector('.panel');
    const panelHeight = panel.getBoundingClientRect().height;
    const children = panel.children;

    function Resize() {
        for (var i = 0; i < children.length; i++) {
            const child = children[i];
            const bbox = child.getBoundingClientRect();
            const bottom = bbox.bottom;
            child.style.setProperty('--dist', `${bottom / panelHeight}`);
        }
    }
    
    addEventListener('resize', Resize);
    Resize();
});