var self = function(iterable, callback) {
    for (var k in iterable) {
        if (iterable.hasOwnProperty(k)) {
            callback(iterable[k], k);
        }
    }
};

module.exports = self;
