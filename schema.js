const joi = require("joi");
const listingSchema=joi.object({
    listing : joi.object({
        title:joi.string().required(),
        description: joi.string().required(),
        location : joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image : joi.string().allow("",null),
        type: joi.string().valid('Room', 'City', 'Mountain', 'Beach', 'Pool', 'Castle', 'Camping', 'Arctic', 'Village', 'Lake', 'Apartment').required()
    }).required()
})
module.exports={listingSchema};

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required().min(1)
    }).required()
})