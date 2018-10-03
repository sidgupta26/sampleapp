const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Business Schema
 */
const BusinessSchema = new mongoose.Schema({
    businessName: String,
    description: String,
    location: {
        addressLine: String,
        landmark: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        geocoordinates: {
            lng: Number,
            lat: Number
        }
    },
    geospatialdata: {
        'type': { type: String },
        coordinates: { type: [Number], default: [0, 0] }
    },
    foodoptions: {},
    dishes: [],
    contactdetails: {},
    createdAt: {
        type: Date,
        default: Date.now
    },
    hours: {
        monday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },
            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        },

        tuesday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },

            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }

        },
        wednesday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },

            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        },
        thursday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },
            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        },
        friday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },

            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        },
        saturday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },
            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        },
        sunday: {
            from: {
                hour: { type: String, default: '00' },
                minute: { type: String, default: '00' },
            },
            to: {
                hour: { type: String, default: '23' },
                minute: { type: String, default: '59' },
            },
            closed: { type: Boolean, default: false },
            userProvidedTime: { type: Boolean, default: false }
        }
    },
    imageUrls: [{
        desc: String,
        url: String

    }]

});

BusinessSchema.index({ geospatialdata: '2dsphere' });
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
BusinessSchema.method({
});

/**
 * Statics
 */
BusinessSchema.statics = {
    /**
     * Get Business
     * @param {ObjectId} id - The objectId of Business.
     * @returns {Promise<Vendor, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((business) => {
                if (business) {
                    return business;
                }
                const err = new APIError('No such business exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List businesses in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of businesses to be skipped.
     * @param {number} limit - Limit number of businesses to be returned.
     * @returns {Promise<Vendor[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

/**
 * @typedef Business
 */
module.exports = mongoose.model('Business', BusinessSchema);
