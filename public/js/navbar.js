addEventListener("load", (event) => {
    const navbar = document.getElementById('navbar-main');

    addEventListener("scroll", (event) => {
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
});