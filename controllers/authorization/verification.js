const User = require('../../models/user');
const VerificationToken = require('../../models/verificationToken');

module.exports = function (app) {

    app.get('/api/v1/verification', async function (req, res) {

        try {
            const { email, token } = req.query;
            const foundUser = await User.findOne({ where: { email: email } });
            if (foundUser.dataValues.isVerified) {
                return res.status(200).send(`You already activated you account!`);
            }
            else {
                const foundToken = await VerificationToken.findOne({ where: { token: token } });
                if (foundToken) {

                    await User.update(
                        { isVerified: true },
                        { returning: true, where: { email: email } });

                    return res.status(200).send(`Account associated with email ${email} has been Activated!`);
                }
                else {
                    return res.status(404).send('Token expired');
                }
            }

        } catch (err) {
            return res.status(404).send('Email not found');
        }
    });

};