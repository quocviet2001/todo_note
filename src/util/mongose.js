module.exports = {
    mutipleMongooseToObject: function (mongose) {
        return mongose.map(mongose => mongose.toObject());
    },
    mongooseToObject: function (mongose) {
        return mongose ? mongose.toObject() : mongose;
    }
}