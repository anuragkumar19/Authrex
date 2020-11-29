const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'yandex',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendLink(user) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Please Veriy your Account!',
            html: `    <body class="cyan lighten-5" style="-webkit-box-sizing: inherit;box-sizing: inherit;margin: 0;background-color: #e0f7fa !important;">
            <div class="container" style="margin-top: 20px;-webkit-box-sizing: inherit;box-sizing: inherit;margin: 0 auto;max-width: 1280px;width: 90%;">
                <div class="center-align" style="-webkit-box-sizing: inherit;box-sizing: inherit;text-align: center;">
                    <img style="width: 50%;-webkit-box-sizing: inherit;box-sizing: inherit;border-style: none;" src="https://anuragkumar19.github.io/Cr0/img/tick.png" alt="">
                </div>
                <h2 class="center-align" style="-webkit-box-sizing: inherit;box-sizing: inherit;font-weight: 400;line-height: 110%;font-size: 3.56rem;margin: 2.3733333333rem 0 1.424rem 0;text-align: center;">Verify account of blogify</h2>
                <p class="flow-text center-align" style="-webkit-box-sizing: inherit;box-sizing: inherit;text-align: center;">
                    Thanks! For signup to Authrex.
                </p>
                <div class="center-align" style="margin-bottom: 60px;-webkit-box-sizing: inherit;box-sizing: inherit;text-align: center;">
                    <a href='${process.env.HOST_URI}/auth/verify?id=${user.id}&secret=${user.verificationSecret}' class="btn-large blue darken-3" style="-webkit-box-sizing: inherit;box-sizing: inherit;background-color: #1565C0 !important;-webkit-text-decoration-skip: objects;color: #fff;text-decoration: none;-webkit-tap-highlight-color: transparent;-webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);border: none;border-radius: 2px;display: inline-block;height: 54px;line-height: 54px;padding: 0 28px;text-transform: uppercase;vertical-align: middle;font-size: 15px;outline: 0;text-align: center;letter-spacing: .5px;-webkit-transition: background-color .2s ease-out;transition: background-color .2s ease-out;cursor: pointer;">Activate Account</a>
                </div>
            </div>
        </body>`,
        });

        return {
            success: true,
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
        };
    }
}

module.exports = {
    sendLink,
};
