'use strict'

const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');
const Publication = require('../Models/publication');
//const User = require('../Models/user');
const Follow = require('../Models/follow')


const PublicationController = {

    savePublication: (req, res) => {
        const params = req.body;
        const publication = new Publication();

        if (!params.text) return res.status(200).send({ message: 'Text is empty' })

        publication.text = params.text;
        publication.file = 'null';
        publication.user = req.user.sub;
        console.log(moment);
        publication.created_at = moment().unix();

        publication.save((err, publicationStored) => {
            if (err) return res.status(500).send({ message: 'Server request error' })
            if (!publicationStored) return res.status(404).send({ message: 'Can`t save this publication try later' })
            return res.status(200).send({ publicationStored: publicationStored })
        })
    },

    getPublications: (req, res) => {
        let page = 1;
        if (req.params.page) {
            page = req.params.page;
        }

        let itemsPerPage = 4;

        Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
            if (err) return res.status(500).send({ message: 'Server request error' })

            let follows_list = [];
            follows.forEach((follow) => {
                follows_list.push(follow.followed);
            });

            Publication.find({ user: { "$in": follows_list } }).sort('-created_at')
                .populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
                    if (err) return res.status(500).send({ message: 'Server request error' })
                    if (!publications) return res.status(404).send({ message: 'Publications is empty' })

                    res.status(200).send({
                        total_items: total,
                        pages: Math.ceil(total / itemsPerPage),
                        page: page,
                        publications: publications
                    })
                })

        })
    },

    getPublication: (req, res) => {
        const publicationId = req.params.id;

        Publication.findById(publicationId, (err, publication) => {
            if (err) return res.status(500).send({ message: 'Server request error' })
            if (!publication) return res.status(404).send({ message: 'Publications is empty' })

            return res.status(200).send({ publication })
        })
    },

    deletePublication: (req, res) => {
        const userId = req.user.sub;
        const publicationId = req.params.id;

        Publication.find({ 'user': userId, '_id': publicationId }).remove((err, publication) => {
            if (err) return res.status(500).send({ message: 'Server request error' })
            if (publication.deletedCount > 0) {
                return res.status(200).send({ message: 'Succes' })
            }
            else return res.status(400).send({ message: 'You are not the user of this publication' })

        })
    },


}

module.exports = PublicationController;