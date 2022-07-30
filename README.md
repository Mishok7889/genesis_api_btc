#API for BTC to UAN exchange rate

The app is written with node.js and express. For sending letters nodemailer is used.

Exchange rate is taken from https://btc-trade.com.ua/api/ticker.

There is a problem with email accounts as now a lot of mail providers forbid using their services with unknown applications
Here is used gmx.com.

Also you can run this app in docker.
Port 3000 is exposing.

Just build an image from project folder.
```
docker build --tag rate-server .
```

And run with preferable ports . 
```
docker -p 3000:3000 run rate-server
```