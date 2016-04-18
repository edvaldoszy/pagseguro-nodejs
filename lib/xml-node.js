var foreach = require('./foreach');

var self = function(name, value) {
    this.name = name;
    this.value = value || [];

    this.add = function(node) {
        this.value.push(node);
    };

    this.size = function() {
        return (Array.isArray(this.value)) ? this.value.length : 1;
    };

    this.toString = function() {
        if (Array.isArray(this.value)) {
            var out = "<" + this.name + ">";
            foreach(this.value, function (item) {
                out += item.toString();
            });
            return out += "</" + this.name + ">";
        }

        return "<" + this.name + ">" + this.value + "</" + this.name + ">";
    };
};

module.exports = self;
