const sgMail = require("@sendgrid/mail");

const apiKey = "";
sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: "",
        to: email,
        subject: "Welcome to Task App",
        text: `Welcome to our Task App, ${name}. How do you go along with our app?`
    })
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        from: "",
        to: email,
        subject: "Task App cancelation",
        text: `We apologize for any inconvenience, ${name}. Could you give us the reason why you left?`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}