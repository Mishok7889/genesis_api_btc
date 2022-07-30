const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 587,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
    },
    debug: true,
    auth: {
        user: 'genesis_rate_api@gmx.com',
        pass: 'mnXDFKH#P#t0:f4mfBenR#D19=bzh,4e'
    }
});

module.exports = transporter;