function getStaticPages(locations, reviews, newsletters) {
    const pages = [
        // about
        ['bio','about/bio'],
        ['testimonials','about/testimonials', {reviews: reviews}],
        //buy
        ['thinking-of-buying','buy/thinking_of_buying'],
        ['first-time-home-buyers','buy/first_time_buyers'],
        ['cost-in-buying-a-home','buy/home_cost'],
        ['mortgage-payment-calculator','buy/mortgage_calc'],
        ['top-5-reasons-for-using-a-realtor','buy/reasons_for_realtor'],
        //sell
        ['thinking-of-selling','sell/thinking_of_selling'],
        ['my-unique-approach','sell/unique_approach'],
        //other
        ['newsletter','newsletter', {newsletters: newsletters}],
        ['properties','presales', {locations: locations.sortedLocations}]
    ];
    // properties
    for (let location in locations.locations) {
        pages.push([location, 'location', {location: locations.locations[location]}]);
    }

    return pages.map(page => {
        page[2] = page[2] || {};
        page[2]['featured'] = locations.featured;
        return {
            name: page[0],
            template: page[1],
            options: page[2]
        }
    });
}

function getErrorPages(locations) {
    const pages = [
        ['404','error', {message: "This page no longer exists.", code: "404"}],
        ['403','error', {message: "The server could not process the request, it is probably rebooting.", code: "403"}],
        ['503','error', {message: "For some reason, the server is busy... Try again later.", code: "503"}]
    ]

    return pages.map(page => {
        page[2]['featured'] = locations.featured;
        return {
            name: page[0],
            template: page[1],
            options: page[2]
        }
    });
}

module.exports = {
    getStaticPages,
    getErrorPages
}