const nodemailer = require('nodemailer');
const {configs} = require('../configs/configs');
const mailgunTransport = require('nodemailer-mailgun-transport')


const Mailer = (recipient, subject, message, cb) => {
    //Mailgun transport
    const gunTransport = mailgunTransport({
        auth: {
            api_key: configs().MAILGUN_ACTIVE_API_KEY,
            domain: configs().MAILGUN_DOMAIN,
          }        
    });
    // Creates SMTP transporter
    let transporter = nodemailer.createTransport(gunTransport);
    
    let mailOptions = {
        from: 'Amigo Secreto <amigo.secreto@amigo.com.br>', // sender address
        to: recipient, // list of receivers
        subject: subject,
        html: `<p>${message}</p>`
    };
    //return Promise
    transporter.sendMail(mailOptions, (error, email) => {
        if (error)
            cb(500, { error, email });
        else
            cb(null, { error, email });
    });
};

module.exports = Mailer;