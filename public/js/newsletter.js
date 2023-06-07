addEventListener("load", (event) => {
    const form = document.querySelector('form')
    form.onsubmit = function(event) {
        event.preventDefault();
        const email = form.querySelector('input').value;
        
        // Disable button & input
        form.querySelector('input').disabled = true;
        form.querySelector('button').disabled = true;

        // Replace input text
        form.querySelector('input').value = 'Thanks for subscribing!';

        // Send request
        const request = new XMLHttpRequest();
        request.open('POST', '/php/newsletter.php', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send('email=' + email);
        return false;
    }
});