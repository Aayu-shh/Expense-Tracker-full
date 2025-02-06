const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotpasswordrequest');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: 'cgtractors1@gmail.com',
    name: 'Chhattisgarh Tractors'
}

exports.forgotPass = async (req, res) => {
    const newUuid4 = uuid.v4();
    const myUser = await User.findOne({ where: { email: req.body.email } });
    const recievers = [
        {
            email: req.body.email
        }];
    if (myUser != null) {
        const tranApi = await tranEmailApi.sendTransacEmail({
            sender,
            to: recievers,
            subject: "Reset Password link from Aayush's Expense tracker app",
            htmlContent: `<h2> Hi {{params.email1}}, click on the below link to reset your password<p>
                    <h1><a href="https://trackmyexpense.site/password/reset/${newUuid4}">Reset Password</a></h1>`, params: { email1: req.body.email }
        })
        const newfgr = await ForgotPasswordRequest.create({ id: newUuid4, isActive: true, userId: myUser.id });
        res.status(200).send({ success: true, message: 'Reset password email sent sucessfully' });
    }
    else {
        res.status(200).send({ success: false, message: 'Email Not Found in DB Reset password email NOT sent' });
    }

}

exports.resetPass = async (req, res) => {
    try {
        const reqUuid = req.params.uuid;
        if (uuid.validate(reqUuid)) {
            const fgr = await ForgotPasswordRequest.findOne({ where: { id: reqUuid } });
            if (null != fgr && fgr.isActive)
                return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password Page</title>
                <style>
                    /* General body styling */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }

                    /* Container styling */
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        width: 300px;
                        text-align: center;
                    }

                    /* Form element styling */
                    form {
                        display: flex;
                        flex-direction: column;
                    }

                    /* Form group styling */
                    .form-group {
                        margin-bottom: 15px;
                    }

                    label {
                        font-size: 14px;
                        margin-bottom: 5px;
                        display: block;
                    }

                    input[type="password"] {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 14px;
                    }

                    input[type="submit"] {
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        background-color: #4CAF50;
                        color: white;
                        font-size: 16px;
                        cursor: pointer;
                    }

                    input[type="submit"]:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Expense Tracker Password Reset</h2>
                    <form action="/password/update/${reqUuid}" method="POST">
                        <div class="form-group">
                            <label for="pass">Please enter new password:</label>
                            <input type="password" id="pass" name="pass" required>
                        </div>
                        <input type="submit" value="Update Password">
                    </form>
                </div>
            </body>
            </html>
            `)
        }
        else {
            res.status(404).send('Invalid reset request!')
        }
    }
    catch (err) {
        console.log('Something went wrong, check below\n', err);
    }
}

exports.updatePass = async (req, res) => {
    try {
        const newPass = req.body.pass;
        const requuid = req.params.uuid;
        const fgr = await ForgotPasswordRequest.findOne({ where: { id: requuid } });
        if (fgr.isActive) {
            fgr.update({ isActive: false });       //opens reset pass just once thatsy why turn to false
            const myUser = await User.findOne({ where: { id: fgr.userId } });
            const encrypass = await bcrypt.hash(newPass, 10);
            myUser.update({ Password: encrypass })
                .then(() => {
                    res.redirect('/login.html');
                    //res.send({ status: 'sucess', message: 'password updated sucessfully' })
                })
        }
        else {
            res.status(200).send({ success: "failure", message: "Reset Password link invalid" });     //Re check what statusCd to set
        }
    }
    catch (err) {
        console.log(err);
        res.send({ status: 'failure', error: err });
    }
}
