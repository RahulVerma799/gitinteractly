const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = '';
const authToken = '';   
const client = new twilio(accountSid, authToken);

const twilioNumber = '+17816229463';
const toPhoneNumber='+917991180409';

function makeIVRCall(toPhoneNumber, personalizedMessage) {
    client.calls
        .create({
            url: 'http:///ivr', 
            to: toPhoneNumber,
            from: +917991180409,
        })
        .then((call) => console.log(`Call initiated with SID: ${call.sid}`))
        .catch((error) => console.error(error));
}


app.post('/ivr', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    const personalizedMessage = "Hello! We noticed your interest in our job offer. If you are interested in proceeding with the interview, please press 1.";

    twiml.say(personalizedMessage);
    twiml.gather({
        numDigits: 1,
        action: '/handle-response',
        method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
});


app.post('/handle-response', (req, res) => {
    const digits = req.body.Digits;
    const twiml = new twilio.twiml.VoiceResponse();

    if (digits === '1') {
        const personalizedInterviewLink = "https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test"; 
        twiml.say(' interview link via SMS.');

      
        client.messages
            .create({
                body: `interview link: ${personalizedInterviewLink}`,
                to: req.body.From,
                from: twilioNumber,
            })
            .then((message) => console.log(`Interview link sent with SID: ${message.sid}`))
            .catch((error) => console.error(error));
    } else {
        twiml.say('Thank you for your time. Goodbye!');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

