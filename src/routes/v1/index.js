const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const BookMarkRoute = require('./bookmark.route');
const userRoute = require('./user.route')
const settingRoute = require('./setting.route')
const docsRoute = require('./docs.route');
const notificationRoute = require('./notification.route')
const followRoute = require('./follow.route');
const categoryRoute = require('./category.route')
const collectionRoute = require('./collection.route');

const auctionRoute = require('./auction.route')
const walletRoute = require('./wallet.route')
// const auctionRoute = require('./auction.route');

const artworkRoute = require('./artwork.route');
const transactionRoute = require('./transactions.route')
const historyRoute = require('./history.route');
const analyticsRoute = require('./analytics.route')

// const auctionRoute = require('./auction.route');
const addChatRoomRoute = require("./chat.route");
const addParticipantRoute = require("./participant.route");
const messagesRoute = require('./messages.route')
const editionRoute = require('./editon.route')
const saleRoute = require('./sale.route')
const { uploadFile } = require('../../utils/fileUpload');
const marketPlace = require("./marketPlace.route")
const loginActivity = require("./loginActivity.route")
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },

  {
    path: '/bookmark',
    route: BookMarkRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/follow',
    route: followRoute
  }, {
    path: "/category",
    route: categoryRoute
  },
  {
    path: '/collection',
    route: collectionRoute,
  },
  {

    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/artwork',
    route: artworkRoute,
  },
  {
    path: '/dashboard',
    route: transactionRoute,
  },

  {
    path: '/setting',
    route: settingRoute,
  },
  {
    path: '/chat',
    route: addChatRoomRoute,
  },
  {

    path: '/wallets',
    route: walletRoute
  },
  {
    path: '/anlytics',
    route: analyticsRoute
  },
  {
    path: '/history',
    route: historyRoute
  },
  {
    path: '/participant',
    route: addParticipantRoute
  },
  {
    path: "/marketplace",
    route: marketPlace
  },
  {
    path: "/message",
    route: messagesRoute
  },
  {
    path: "/auction",
    route: auctionRoute
  },
  {
    path: "/edition",
    route: editionRoute
  },
  {
    path: "/sales",
    route: saleRoute
  },
  {
    path: "/login-activity",
    route: loginActivity
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/upload-file').post(uploadFile);


/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
