addEventListener("load", (event) => {
    const form = document.querySelector('form')
    form.onsubmit = function(event) {
        event.preventDefault();
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        
        // Disable button & input
        form.querySelectorAll('input').forEach(element => {
            element.disabled = true;
        });
        form.querySelector('button').disabled = true;

        // Replace input text
        form.querySelector('button').innerHTML = 'Thank you!';

        // Send request
        const request = new XMLHttpRequest();
        request.open('POST', '/php/newsletter.php', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send('name=' + name);
        request.send('email=' + email);
        return false;
    }
});