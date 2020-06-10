'use strict'
const mongoosePaginate = require('mongoose-pagination');
const Follow = require('../Models/follow');
const PublicationUtilities = require('./publication');

const FollowController = {

  saveFollow: (req, res) => {
    const params = req.body;
    let follow = new Follow();
    const { followed } = params

    follow.user = req.user.sub;
    follow.followed = followed;

    if (followed) {
      follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error to follow this user' });
        if (!followStored) return res.status(404).send({ message: 'Can`t save this follow' });
        if (followStored) return res.status(200).send({ follow: followStored });
      })
    } else return res.status(400).send({ message: 'Send user you want to follow' });
  },

  deleteFollow: (req, res) => {
    const userId = req.user.sub;
    const followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
      if (err) return res.status(500).send({ message: 'Error to unfollow user' });
      return res.status(200).send({ message: 'Succes' });
    })
  },

  getFollows: (req, res) => {
    let userId = req.user.sub;
    let page = 1;
    let itemsPerPage = 4;

    if (req.params.id && req.params.page) { userId = req.params.id }

    if (req.params.page) { page = req.params.page }
    else { page = req.params.id }

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
      if (err) return res.status(500).send({ message: 'Server request error' });
      if (!follows) return res.status(404).send({ message: 'You are´t follow any user' });
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / itemsPerPage),
        followes: follows
      });
    })
  },

  getFollowers: (req, res) => {
    let userId = req.user.sub;
    let page = 1;
    let itemsPerPage = 4;

    if (req.params.id && req.params.page) { userId = req.params.id }

    if (req.params.page) { page = req.params.page }
    else { page = req.params.id }

    Follow.find({ followed: userId }).populate('user followed').paginate(page, itemsPerPage, (err, follows, total) => {
      if (err) return res.status(500).send({ message: 'Server request error' });
      if (!follows) return res.status(404).send({ message: 'Followers is empty' });
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / itemsPerPage),
        followers: follows
      });
    })
  },

  //All list without pagination
  getFollowsList: (req, res) => {
    let userId = req.user.sub;
    let follows = req.params.follows;
    let find = Follow.find({ user: userId })

    if (follows) {
      find = Follow.find({ followed: userId })
    }

    find.populate('user followed').exec((err, follows) => {
      if (err) return res.status(500).send({ message: 'Server request error' });
      if (!follows) return res.status(404).send({ message: 'Follow list is empty' });
      return res.status(200).send({ follows })
    })
  },
}



///UTILITIES///

async function followUsersId(userId) {
  let following = await new Promise((resolve, reject) => {
    Follow.find({ 'user': userId }).select({ '_id': 0, '_v': 0, 'user': 0 }).exec((err, follows) => {
      try {
        let folowsClean = [];
        follows.forEach((follow) => {
          folowsClean.push(follow.followed);
        })
        resolve(folowsClean)
      } catch{
        reject(err);
      }
    });
  })

  let followed = await new Promise((resolve, reject) => {
    Follow.find({ 'followed': userId }).select({ '_id': 0, '_v': 0, 'followed': 0 }).exec((err, follows) => {
      try {
        let folowsClean = [];
        follows.forEach((follow) => {
          folowsClean.push(follow.user);
        })
        resolve(folowsClean)
      } catch{
        reject(err);
      }
    });
  })
  return {
    follofing: following,
    followed: followed
  }
}

async function followThisUser(identityUserId, userId, req) {
  let following = await new Promise((resolve, reject) => {
    Follow.findOne({ 'user': req.user.sub, 'followed': userId }).exec((err, follow) => {
      try {
        resolve(follow)
      } catch{
        reject(err);
      }
    });
  })

  let followed = await await new Promise((resolve, reject) => {
    Follow.findOne({ 'user': userId, 'followed': identityUserId }).exec((err, follow) => {
      try {
        resolve(follow)
      } catch{
        reject(err);
      }
    });
  })
  return {
    following: following,
    followed: followed
  }
}



async function getCountFollow(userId) {
  let following = await new Promise((resolve, reject) => {
    Follow.count({ 'user': userId }).exec((err, count) => {
      try {
        resolve(count)
      } catch{
        reject(err);
      }
    })
  })

  let followers = await new Promise((resolve, reject) => {
    Follow.count({ 'followed': userId }).exec((err, count) => {
      try {
        resolve(count)
      } catch{
        reject(err);
      }
    })
  })

  let publications = await new Promise((resolve, reject) => {
    PublicationUtilities.getPublicationsCount(userId).then(count => {
      try {
        resolve(count)
      } catch{
        reject(err);
      }
    })
  });
  return {
    followings: following,
    followers: followers,
    publications: publications
  }
}

module.exports = {
  FollowController,
  followUsersId,
  followThisUser,
  getCountFollow
};
