const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

module.exports.index = async (req, res) => {
    const { category, location } = req.query;

    let filter = {};

    if (category && category !== "all") {
        filter.category = category;
    }

    if (location) {
        filter.location = location;
    }

    let allListings = await Listing.find(filter);

    // If no results, show all listings
    if (allListings.length === 0) {
        allListings = await Listing.find({});
    }

    res.render("listings/index", {
        allListings,
        category,
        location
    });
};

module.exports.renderNewForm = (req, res) =>{

    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    let listingData = req.body.listing;
    console.log(listingData);
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews"
        , populate: { path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_150");
    res.render("listings/edit.ejs", {listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.reserveBooking = async(req, res) =>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     let { checkIn, checkOut, guests } = req.body;
     const days =
        (new Date(checkOut) - new Date(checkIn))
        / (1000 * 60 * 60 * 24);

     const subtotal = days * listing.price;
     const gst = subtotal * 0.18;
     const totalPrice = subtotal + gst;

     //check if already someone booked
     const existingBooking = await Booking.findOne({
     listing: listing._id,
     checkIn: { $lt: checkOut },
     checkOut: { $gt: checkIn }
     });

     if (existingBooking) {
        req.flash("error", "Listing already booked for these dates.");
        return res.redirect(`/listings/${listing._id}`);
     }

     let bookingData = Booking({
          listing: listing._id,
          user: req.user._id,
          checkIn, checkOut, guests,totalPrice
     });
     let booking = await bookingData.save();
     console.log(booking);
     req.flash("success", "Booking Confirmed!");
     res.redirect("/listings/bookings");
}

module.exports.renderBookings = async (req, res) => {
    const bookings = await Booking.find({
        user: req.user._id
    }).populate("listing");

    res.render("listings/bookings", { bookings });
};

