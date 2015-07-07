
var Compare = function(output) {
    output = output || Compare.Output.STDOUT;

    this.output = require('./output/' + output);
};

Compare.Output = {
    STDOUT: 'stdout'
};

Compare.Type = {
    CHANGED: 1,
    DELETED: 2,
    INSERTED: 3,
    EQUALS: 4
};

/**
 * Compare two sets and return the diff
 * @param {Array} a
 * @param {Array} b
 */
Compare.prototype.process = function(a, b) {
    var matrix = this.lcs(a, b);
    return this._diff(matrix, a, b);
};

/**
 * Output the result with given output provider
 * @param data
 */
Compare.prototype.print = function(data) {
    this.output.print(data);
};

/**
 * Calculate LCS
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */
Compare.prototype.lcs = function(a, b) {
    var matrix = [],
        i, j;

    matrix[b.length] = [];

    for (j = a.length; 0 <= j; j--) {
        matrix[b.length][j] = a.length - j;
    }

    for (i = b.length; 0 <= i; i--) {
        matrix[i] = matrix[i] || [];
        matrix[i][a.length] = b.length - i;
    }

    matrix[b.length][a.length] = 0;

    // fill the matrix
    for (j = a.length - 1; 0 <= j; j--) {
        for (i = b.length - 1; 0 <= i; i--) {
            this._backtrack(matrix, a, b, j, i);
        }
    }

    return matrix;
};

/**
 * Sets the value for given index
 * @private
 */
Compare.prototype._backtrack = function(matrix, a, b, j, i) {
    if (a[j] == b[i]) {
        matrix[i][j] = matrix[i + 1][j + 1];
    } else if (matrix[i][j + 1] < matrix[i + 1][j]) {
        matrix[i][j] = matrix[i][j + 1] + 1;
    } else {
        matrix[i][j] = matrix[i + 1][j] + 1;
    }
};

/**
 * Returns diff array
 * @param {Array} matrix
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 * @private
 */
Compare.prototype._diff = function(matrix, a, b) {
    var i = 0,
        j = 0,
        x, y,
        result = [];

    while (i < b.length || j < a.length) {
        if (a[j] == b[i]) {
            result.push({
                type: Compare.Type.EQUALS,
                value: a[j]
            });
            i++;
            j++;
        } else {

            x = matrix[i][j] > matrix[i][j + 1];
            y = matrix[i][j] > matrix[i + 1][j];

            if (x && y) {
                result.push({
                    type: Compare.Type.CHANGED,
                    value: [a[j], b[i]]
                });
                i++;
                j++;
            } else if (x) {
                result.push({
                    type: Compare.Type.DELETED,
                    value: a[j]
                });
                j++;
            } else {
                result.push({
                    type: Compare.Type.INSERTED,
                    value: b[i]
                });
                i++;
            }
        }
    }

    return result;
};

module.exports = Compare;