## 🪖 Strategy
1. Mark the high and low of `9:45 to 10:00` candle.
2. If price goes above the marked high execute the `buy order`, if price goes below the marked low execute the `sell order` and don't do anything if price stayed in range.
3. For buy, `stop loss` becomes the marked low and vice versa.
4. Wait for the market end or stop loss trigger to `exit` the trade. 
5. Max one trade per day and max loss per day is 1% of capital to manage the `risk`. 

## 🧠 Logic
1. Skip the opening 30 mins due to high market volatility.
2. Trade in the direction of current day trend.
3. Wait for large profit or take small stop loss.

## 📃 Results
> [Results](https://github.com/Aman9723/morning-trend-strategy/blob/master/Results.txt) are not impressive possibly due to less win-rate. Tested over custom dates and the data of 7+ years.
