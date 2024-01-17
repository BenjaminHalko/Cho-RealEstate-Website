(function() {
    const catagories = document.querySelector('.catagories');
    const categoryCollapse = {};
    document.querySelectorAll('.category').forEach((category) => {
        categoryCollapse[category.id] = new bootstrap.Collapse('#'+category.id, {toggle: false});
    });
    document.querySelectorAll('.categoryButton').forEach((button) => {
        button.onclick = function() {
            if (button.classList.contains('selected')) return;
            history.replaceState({}, 'Title', '#'+button.id.replace('_button',''));
            document.querySelectorAll('.selected').forEach((selected) => {
                selected.classList.remove('selected');
            });
            for(const category in categoryCollapse) {
                button.classList.add('selected');
                catagories.classList.add('shrink');
                if(category == button.id.replace('_button','')) categoryCollapse[category].show();
                else categoryCollapse[category].hide();
            }
        }
    });

    // Get # url
    function hashUpdate() {
        const url = window.location.href.split('#')[1];
        if (url in categoryCollapse) {
            document.getElementById(url+'_button').classList.add('selected');
            document.getElementById(url).classList.add('show');
        } else {
            document.querySelector('.categoryButton').classList.add('selected');
            document.querySelector('.category').classList.add('show');
        }
    }

    hashUpdate();
})();