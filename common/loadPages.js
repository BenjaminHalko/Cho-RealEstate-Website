let featured = {};

function addPage(name, template, options={}) {
    options['featured'] = featured;
    return {
        name: name,
        template: template,
        options: options
    }

}

function getPages(data) {
    // Set up pages
    featured = data.locationData.featured;
    
    // pages
    const pages = [
        // about
        addPage('bio','about/bio'),
        addPage('testimonials','about/testimonials', {reviews: data.reviews}),
        //buy
        addPage('thinking-of-buying','buy/thinking_of_buying'),
        addPage('first-time-buyers','buy/first_time_buyers'),
        addPage('cost-in-buying-a-home','buy/home_cost'),
        addPage('mortgage-payment-calculator','buy/mortgage_calc'),
        addPage('top-5-reasons-for-using-a-realtor','buy/reasons_for_realtor'),
        //sell
        addPage('thinking-of-selling','sell/thinking_of_selling'),
        addPage('my-unique-approach','sell/unique_approach'),
        //other
        addPage('newsletter','newsletter', {newsletters: data.newsletters}),
        addPage('properties','presales', {locations: data.locationData.sortedLocations})
    ];
    for (let location in data.locationData.locations) {
        pages.push(addPage(location,'location', {location: data.locationData.locations[location]}));
    }
    //errors
    const errors = [
        addPage('404','error', {message: "This page no longer exists.", code: "404"}),
        addPage('403','error', {message: "The server could not process the request, it is probably rebooting.", code: "403"})
    ]

    return {
        pages: pages,
        errors: errors
    }
}

// Export functions
module.exports = {
    getPages
};