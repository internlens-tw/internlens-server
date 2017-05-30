const express = require('express');
const router = new express.Router();
const Article = require('../models/article.js');

module.exports = (() => {
    'use strict';

    router.post('/', (req, res) => {
        console.log('Receive:', req.body);
        const query = {};
        const sortby = req.body.sortby || 'updatedAt';
        const limit = parseInt(req.body.limit) || 20;

        if (req.body.company !== undefined) {
            query.company_name = req.body.company.toLowerCase();
        }
        if (req.body.job_title !== undefined) {
            query.job_title = req.body.job_title.toLowerCase();
        }
        if (req.body.last_id !== undefined) {
            query._id = { '$lt': req.body.last_id };
        }

        console.log('Search query:', query);

        const sortObj = { _id: -1 };
        sortObj[sortby] = -1;

        Article.find(query)
            .sort(sortObj)
            .limit(limit)
            .exec((err, posts) => {
                if (err) {
                    res.status(500).send('Find article error');
                    return console.error('Query error:', err);
                }

                res.json(posts);
            });
    });

    return router;
})();
