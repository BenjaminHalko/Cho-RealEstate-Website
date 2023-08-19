(function() {
    const form = document.querySelector('form');
    const result = document.querySelector('#results');
    const resultText = result.querySelector('p');
    form.onsubmit = function(event) {
        event.preventDefault();

        // Get Values
        const houseCost = form.querySelector('#house').value;
        const downPayment = form.querySelector('#downpayment').value;
        const interest = form.querySelector('#interest').value;
        const term = form.querySelector('#term').value;

        // loan amount
        const loanAmount = houseCost - downPayment;
        // calculate the monthly payment
        const monthlyPayment = loanAmount * (interest / 1200) / (1 - Math.pow(1 + interest / 1200, -term * 12));
        // calculate total of monthly payments
        const totalMonthlyPayments = monthlyPayment * term * 12;
        // calculate total interest
        const totalInterest = totalMonthlyPayments - loanAmount;

        // Render Results
        resultText.innerHTML = `
        <p>
        <b>Loan Amount:</b> $${loanAmount.toLocaleString("en-US")}<br>
        <b>Monthly Payment:</b> $${monthlyPayment.toLocaleString("en-US")}<br>
        <b>Number of Payments:</b> ${term * 12}<br>
        <b>Total Mortgage Payments:</b> $${totalMonthlyPayments.toLocaleString("en-US")}<br>
        <b>Total Interest:</b> $${totalInterest.toLocaleString("en-US")}<br>
        </p>
        `;

        // Remove hidden class from result
        result.classList.remove('hidden');
        return false;
    };
})();