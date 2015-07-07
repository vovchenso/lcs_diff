var Compare = require('./../compare');

var exports = module.exports = {};

/**
 * Outputs formatted data to stdout
 * @param {Array} data
 */
exports.print = function(data) {
    for (var i = 0; i < data.length; i++) {

        switch(data[i].type) {
            case Compare.Type.EQUALS:
                console.log('%d     %s', i + 1, data[i].value);
                break;

            case Compare.Type.CHANGED:
                console.log('%d  *  %s', i + 1, data[i].value.join('|'));
                break;

            case Compare.Type.INSERTED:
                console.log('%d  +  %s', i + 1, data[i].value);
                break;

            case Compare.Type.DELETED:
                console.log('%d  -  %s', i + 1, data[i].value);
                break;

            default:
                break;
        }
    }
};