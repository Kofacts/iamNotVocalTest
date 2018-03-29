const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
var name = 'Ajah';
var emailAddress = 'talk2ajah@gmail.com';
var id = 'hello2929aaek3';
   var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: 'talk2ajah@gmail.com',
            pass: 'CRUCIBLE96'
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"I-AMVOCAL Team 👻" <talk2ajah@gmail.com>', // sender address
        to: emailAddress, // list of receivers
        subject: 'I-AMVOCAL signup', // Subject line
        html: '<b>Hello '+name+'</b><p> Thanks for signing up to be part of the I-AMVOCAL community. To complete the sign up process, please click on the link that follows to confirm that it\'s you: <a href="www.i-amvocal.xyz/signup/confirmation/'+id+'"> Confirmation link </a></p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });