window.onload = function() {
    const navbar = document.getElementById('navbar-main');

    window.onscroll = function() {
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
            navbar.classList.add('navbar-shrink')
        } else {
            navbar.classList.remove('navbar-shrink')
        }
    };
};