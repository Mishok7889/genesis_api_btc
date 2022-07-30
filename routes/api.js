const fs = require('fs');
const express = require('express');
const {default: axios} = require('axios');
const mailClient = require("./mailSender");

const router = express.Router();

const EMAILS_FILE_PATH = './emails.dat';

appendToFile = email => fs.appendFileSync(EMAILS_FILE_PATH, email + '\n', 'utf-8');
emailInList = email => fs.existsSync(EMAILS_FILE_PATH) && fs.readFileSync(EMAILS_FILE_PATH, 'utf-8').trim().split('\n').includes(email);
getEmails = () => fs.readFileSync(EMAILS_FILE_PATH, 'utf-8').trim().replaceAll('\n', ',');
//Use just float and not some currency object as it is quite accurate to hold the exchange rate
getCurrentBTCUAHRate = async () => Number.parseFloat((await axios.get('https://btc-trade.com.ua/api/ticker/btc_uah')).data.btc_uah.buy);

//Get current rate BTC to UAH
router.get('/rate', async (req, res, next) => {
    try {
        const rate = await getCurrentBTCUAHRate();
        console.log(rate);
        res.status(200).json(rate);
    } catch (e) {
        console.log(e);
        res.status(400).send('Invalid status value.');
    }
});

router.post('/subscribe', (req, res, next) => {
    try {
        const email = req.body.email.toLowerCase();
        if (!email || !email.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
            console.log('Invalid email: ', email);
            res.status(400).send("Email is wrong. Check it and try again.")
            return;
        }
        if (emailInList(email)) {
            console.log('Email duplication: ', email);
            res.status(409).send('There is already such email in subscribers list.');
            return;
        }
        appendToFile(email);
        console.log("Added email: ", email);
        res.status(200).send("Added");
    } catch (e) {
        console.log(e);
        res.status(400).send("Something went wrong.");
    }
});

router.post('/sendEmails', async (req, res, next) => {
    const rate = 'BTC to UAN rate : ' + (await getCurrentBTCUAHRate()).toString() + ".";
    const mailOptions = {
        from: 'genesis_rate_api@gmx.com',
        to: getEmails(),
        subject: 'BTC to UAH exchange rate',
        text: rate
    }

    console.log(mailOptions);

    mailClient.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.status(400).send('Error has happened');
            } else {
                res.status(200).send("Sent successfully");
            }
        }
    )
});

module.exports = router;