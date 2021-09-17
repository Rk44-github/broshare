const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

async function sendMail({from, to, subject, text, html}){
    let transporter = nodemailer.createTransport({
        host: process.env.Smtp_Host ,    //smtp server
        port: process.env.smtp_port ,
        secure: false,
        auth: {
            user: process.env.Mail_User ,
            pass: process.env.App_Pass ,
        }
            
    });

    let info = await transporter.sendMail({
         from:`Bro Share <${from}>`,
         to,
         subject,
         text,
         html
    })

}


module.exports = sendMail;



// app password