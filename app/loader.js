var fs = require('fs');

var exports = module.exports = {};

/**
 * Read the file
 * @param {string} file Filename
 * @param {Function} callback Callback function with result
 * @private
 */
function _proceed(file, callback) {

    fs.readFile(file, function(err, data) {
        if (err) {
            throw err;
        }
        data = data.toString().split('\n');
        callback(data);
    });

};

/**
 * Load all the files
 * @returns {Promise}
 */
exports.load = function(files) {

    return new Promise(function(resolve) {

        var count = files.length;
        var result = [];

        files.forEach(function(file, index) {

            (function(file, index) {
                
                _proceed(file, function(data) {

                    result[index] = {
                        file: file,
                        content: data
                    };

                    if (count == result.length) {
                        resolve(result);
                    }

                });

            })(file, index);

        });

    });

};