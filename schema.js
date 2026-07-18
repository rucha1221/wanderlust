const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
        url: Joi.string()
        }),
        category: Joi.string()
        .valid(
        "rooms",
        "cities",
        "mountains",
        "luxury",
        "pool",
        "lakefront",
        "historic",
        "arctic",
        "beach",
        "other"
    )
    .required()
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required(),
})

const bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required(),
        guests: Joi.number().required().min(1),
        totalPrice: Joi.number().required(),
        status: Joi.string()
        .valid(
            "Pending",
            "Confirmed"
        ).required()
    }).required()
})

module.exports = {
    listingSchema,
    reviewSchema,
    bookingSchema
};