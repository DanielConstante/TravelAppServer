const express = require('express');
const Recommended = require("../models/recommended");
const authenticate = require('../ authenticate');
const cors = require('./cors');

const recommendedRouter = express.Router();

recommendedRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Recommended.find()
            .then(recommended => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recommended);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recommended.create(req.body)
            .then(recommended => {
                console.log('Recommended created ', recommended);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recommended);
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /recommended');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recommended.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

    recommendedRouter.route('/:recommendedId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Recommended.findById(req.params.recommendedId)
            .then(recommended => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recommended);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /recommended/${req.params.recommendedId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recommended.findByIdAndUpdate(req.params.recommendedId, {
            $set: req.body
        }, { new: true })
            .then(recommended => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recommended);
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Recommended.findByIdAndDelete(req.params.recommendedId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });


module.exports = recommendedRouter;