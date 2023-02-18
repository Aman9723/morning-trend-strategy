const fs = require('fs');
const { cwd } = require('process');
const formatDate = require('./handleDate').formatDate;
const compareDate = require('./handleDate').compareDate;

let capital = 5000; // 5x margin
let mark = (trade = null);

/**
 * backtest for a time period
 * @param {string} from
 * @param {string} to
 */
function backtest(from, to) {
    from = formatDate(from);
    to = formatDate(to);

    data.forEach((candle, i) => {
        candle.date = formatDate(candle.date);

        /* date must lie between from and to */
        if (compareDate(from, candle.date) == 'greater') {
            return;
        } else {
            if (compareDate(to, candle.date) == 'lesser') {
                return;
            } else {
                /* apply strategy */
                strategy(candle);
            }
        }
    });
}

/**
 * strategy to execute and manage trade
 * @param {object} param0
 * @returns {undefined}
 */
function strategy({ high, low, close, date: { hr, min } }) {
    /* mark the high and low of 9:45 candle */
    if (hr == 9 && min == 45) {
        mark = { high, low };
        return;
    }

    /* after 9:45 candle and (trade not taken or in progress) */
    if (mark && trade != 'done for the day') {
        const max_loss_per_trade = capital * 0.01; // 1% of capital
        const sl_range = mark.high - mark.low;
        const quantity = Math.floor(max_loss_per_trade / sl_range);

        /* if trade is in progress */
        if (trade != null) {
            /* candle's low goes below the sl */
            if (trade.position == 'buy' && low <= mark.low) {
                capital -= trade.quantity * sl_range + charges(trade.quantity);
                mark = null;
                trade = 'done for the day';
            } else if (trade.position == 'sell' && high >= mark.high) {
                capital -= trade.quantity * sl_range + charges(trade.quantity);
                mark = null;
                trade = 'done for the day';
            }
        } else {
            /* trade execution */
            if (high >= mark.high) {
                /* if sl is within risk managment */
                if (quantity > 0) {
                    trade = {
                        quantity,
                        position: 'buy',
                    };

                    /* if same candle triggers both order */
                    if (low <= mark.low) {
                        capital -=
                            trade.quantity * sl_range + charges(trade.quantity);
                        mark = null;
                        trade = 'done for the day';
                    }
                } else {
                    mark = null;
                    trade = 'done for the day';
                }
            } else if (low <= mark.low) {
                /* if sl is within risk managment */
                if (quantity > 0) {
                    trade = {
                        quantity,
                        position: 'sell',
                    };

                    /* if same candle triggers both order */
                    if (high >= mark.high) {
                        capital -=
                            trade.quantity * sl_range + charges(trade.quantity);
                        mark = null;
                        trade = 'done for the day';
                    }
                } else {
                    mark = null;
                    trade = 'done for the day';
                }
            }
        }
    }

    /* square off time */
    if (hr == 15 && min == 0) {
        /* no trade executed due to range bound price */
        if (trade == null) {
            mark = null;
        } else {
            if (typeof trade == 'object') {
                if (trade.position == 'buy') {
                    capital +=
                        trade.quantity * (close - mark.high) -
                        charges(trade.quantity, mark.high, close);
                    trade = null;
                    mark = null;
                } else if (trade.position == 'sell') {
                    capital +=
                        trade.quantity * (mark.low - close) -
                        charges(trade.quantity, mark.low, close);
                    trade = null;
                    mark = null;
                }
            } else {
                trade = null;
                mark = null;
            }
        }
    }
}

/**
 * calculates the charges on turnover
 * @param {number} qty
 * @returns {number}
 */
function charges(qty, entry = mark.high, exit = mark.low) {
    return (entry * qty + exit * qty) * 0.0006; // 0.06% of turnover
}

/* read json file */
var data;
let jsonFiles = fs.readdirSync(cwd());

jsonFiles = jsonFiles.filter((fileName) => fileName.includes('data.json'));
jsonFiles.forEach((fileName) => {
    data = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }));
    capital = 1000;
    backtest('2021-02-02 09:15:00+05:30', '2022-10-02 09:15:00+05:30');
    fs.appendFileSync(
        'Results.txt',
        `${fileName.split('_')[0]} - ${capital}\n`,
        (err) => {
            if (err) console.log(err);
        }
    );
});
