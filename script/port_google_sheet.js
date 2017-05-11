'use strict';

const csv = require('csvtojson');
const prepender = require('prepend-file');
const async = require('async');
const csvFile = process.argv[2];
const config = require('../config');
const mongoose = require('mongoose');
const Article = require('../models/article');
const User = require('../models/user');
const varName = ['created_at', 'company_name', 'industry', 'job_title', 'start_date', 'job_duration', 'work_hour', 'insurance', 'job_description', 'job_description_gap_score', 'job_description_gap', 'job_content', 'payment_method', 'hourly_payment', 'hourly_payment_description', 'monthly_payment', 'monthly_payment_description', 'payment', 'payment_score', 'payment_rationality', 'learn_score', 'learn', 'reward_score', 'reward', 'feeling', 'rating', 'suggestion', 'contact'];

mongoose.connect(config.mongodbUrl);

if (csvFile === undefined) {
    console.error('Missing exported google sheet file.');
    console.error('Usage: node port_google_sheet.js [file.csv]');
    process.exit();
}

async.waterfall([
    // Prepends header to csv.
    (callback) => {
        prepender(csvFile, varName.join() + '\n', (err) => {
            if (err) {
                return callback('Prepend header error!' + err);
            }
            console.log('Prepend done!');
            return callback(null);
        });
    },
    // Find anonymous user.
    (callback) => {
        User.findOne({ name: 'Anonymous' }, (err, user) => {
            if (err) {
                return callback('Find anonymous user error:' + err);
            }
            console.log('Find anonymous:', user);
            return callback(null, user);
        });
    },
    // Create anonymous user.
    (foundUser, callback) => {
        if (foundUser) {
            return callback(null, foundUser._id);
        }
        const user = new User({
            method: 'Ancient',
            name: 'Anonymous',
            nickname: 'Anonymous',
        });
        user.save((err, saved) => {
            if (err) {
                return callback('Save anonymous user error:' + err);
            }
            console.log('Create anonymous user succeed!');
            return callback(null, saved._id);
        });
    },
    // Reads file
    (anonymousId, callback) => {
        let print = 0;
        csv().fromFile(csvFile)
            .on('json', (jsonObj) => { // Read csv to json
                // Break the introduction header.
                if (print <= 4) {
                    print++;
                    return;
                }
                jsonObj.userid = anonymousId;
                jsonObj.payment_method = '時薪';
                const segs = jsonObj.work_hour.split(', ');
                jsonObj.work_hour = segs[0].split('-')[1];
                jsonObj.work_hour_description = segs[1];
                if (jsonObj.payment_score == '不合理') {
                    jsonObj.payment_score = 2;
                } else if (jsonObj.payment_score == '十分合理，綜合的獲得上已滿足') {
                    jsonObj.payment_score = 4;
                }

                const newPost = new Article(jsonObj);
                newPost.save((err, post) => {
                    if (err) {
                        console.error('Save', newPost, err);
                        process.exit();
                    }
                });
            })
            .on('done', (error) => { // Done reading
                console.log('end.');
                callback(null);
            });
    },
], (err) => {
    if (err) {
        console.error(err);
    }
});
