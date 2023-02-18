/**
 * changes date format
 * @param {string} date
 * @returns {object}
 */
function formatDate(date) {
    date = date.split(' ');
    date[0] = date[0].split('-');
    date[1] = date[1].split(':');
    return {
        year: +date[0][0],
        month: +date[0][1],
        day: +date[0][2],
        hr: +date[1][0],
        min: +date[1][1],
    };
}

/**
 * compares occurence of two dates
 * @param {object} d1
 * @param {object} d2
 * @returns {string}
 */
function compareDate(d1, d2) {
    // compare year
    if (d1.year > d2.year) {
        return 'greater';
    } else if (d1.year < d2.year) {
        return 'lesser';
    } else {
        // compare month
        if (d1.month > d2.month) {
            return 'greater';
        } else if (d1.month < d2.month) {
            return 'lesser';
        } else {
            // compare day
            if (d1.day > d2.day) {
                return 'greater';
            } else if (d1.day < d2.day) {
                return 'lesser';
            } else {
                return 'equal';
            }
        }
    }
}

module.exports = { formatDate, compareDate };
