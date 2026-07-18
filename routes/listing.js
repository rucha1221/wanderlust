const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const Booking = require("../models/booking.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, 
     upload.single('listing[image]'),
     validateListing,
      wrapAsync(listingController.createListing))

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/bookings", isLoggedIn, wrapAsync(listingController.renderBookings));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'),
     validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn,
     isOwner, wrapAsync(listingController.renderEditForm));

router.post("/:id/book", isLoggedIn, wrapAsync( listingController.reserveBooking));

module.exports = router;
