(function() {
    const navbar = document.querySelector('#navbar-main');
    function scrollFunction() {     
        if (document.documentElement.scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('navbar-dark');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('navbar-dark');
        }
    }

    addEventListener('scroll', scrollFunction);
    scrollFunction();
})();