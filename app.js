var Loader = require('./app/loader');
var Compare = require('./app/compare');

if (process.argv.length < 4) {
    throw new Error('Wrong params');
}

var files = process.argv.slice(2);

Loader.load(files).then(function(data) {

    var compare = new Compare();

    for (var i = 1; i < data.length; i++) {
        console.log('\nCompare file %s\n', data[i].file);
        var result = compare.process(data[0].content, data[i].content);
        compare.print(result);
    }
});