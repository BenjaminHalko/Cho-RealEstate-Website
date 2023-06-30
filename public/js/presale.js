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

    const catagories = document.querySelector('.catagories');
    const catagoryCollapse = {};
    document.querySelectorAll('.catagory').forEach((catagory) => {
        catagoryCollapse[catagory.id] = new bootstrap.Collapse('#'+catagory.id, {toggle: false});
    });
    document.querySelectorAll('.catagoryButton').forEach((button) => {
        button.onclick = function() {
            if (button.classList.contains('selected')) return;
            history.replaceState({}, 'Title', '#'+button.id.replace('_button',''));
            document.querySelectorAll('.selected').forEach((selected) => {
                selected.classList.remove('selected');
            });
            for(const catagory in catagoryCollapse) {
                button.classList.add('selected');
                catagories.classList.add('shrink');
                if(catagory == button.id.replace('_button','')) catagoryCollapse[catagory].show();
                else catagoryCollapse[catagory].hide();
            }
        }
    });

    // Get # url
    function hashUpdate() {
        const url = window.location.href.split('#')[1];
        if (url in catagoryCollapse) {
            document.getElementById(url+'_button').classList.add('selected');
            document.getElementById(url).classList.add('show');
        } else {
            document.querySelector('.catagoryButton').classList.add('selected');
            document.querySelector('.catagory').classList.add('show');
        }
    }

    hashUpdate();
});