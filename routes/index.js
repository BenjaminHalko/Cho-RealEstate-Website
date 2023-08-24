// Config
const { getStaticPages, getErrorPages } = require('../utils/getStaticPages');
const { processLocations, processReviews, processNewsletters } = require('../utils/processConfig');
const locations = processLocations();

// Routes
function dynamicRoutes(router) {
    const callAPIs = require('../utils/callAPIs');

    router.get('/', (req, res) => {
        callAPIs().then(data => {
            res.render('pages/home',{
                featured: locations.featured,
                secondary: locations.secondary,
                instagramData: data.instagramData,
                youtubeData: data.youtubeData
            });
        });
    });
}

function staticRoutes(router) {
    const reviews = processReviews();
    const newsletters = processNewsletters();
    const staticPages = getStaticPages(locations, reviews, newsletters);

    for (let page of staticPages) {
        router.get(`/${page.name}`, (req, res) => {
            res.render(`pages/${page.template}`, page.options);
        });
    }
}

function errorRoutes(router) {
    const staticErrors = getErrorPages(locations);
    const page = staticErrors.find(page => page.name === '404');

    router.get('*', (req, res) => {
        res.status(404).render(`pages/${page.template}`, page.options);
    });
}

// Load All Routes
function getRoutes(developMode) {
    const express = require('express');
    const router = express.Router();

    dynamicRoutes(router);

    if (developMode) {
        staticRoutes(router);
    } else {
        errorRoutes(router);
    }

    return router;
}

module.exports = getRoutes;