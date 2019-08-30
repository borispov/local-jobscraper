const nodemailer = require('nodemailer');
const fs = require('fs');
const { sender, to } = require('./config');

const fi = process.argv[2] || ''

module.exports = async (fileToSend = fi) => {

  if (!fileToSend) {
    return console.error('Please provide file to send, ie. node send file.pdf')
  }
  const content = fs.readFileSync(fileToSend);
  const receipient = to
  const smtpTransporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        auth: sender.auth
    });

  const mailOptions = {
    from: sender.from,
    to: to,
    subject: 'משרות שתיל האחרונות שביקשת',
    text: 'רשימת משרות עבורך יקירתי.. אל יאוש! :-)'
    attachments: {
      filename: fileToSend,
      content
    }
  }

  smtpTransporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


}
