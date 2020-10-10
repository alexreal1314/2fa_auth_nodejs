const bcrypt = require('bcryptjs');
const pool = require('../../services/initService').pool;
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const cryptoRandomString = require('crypto-random-string');
const VerificationToken = require('../../models/verificationToken');
const verificationService = require('../../services/verificationService');

async function validateToken(user) {

    return new Promise((resolve, reject) => {
        let token = jwt.sign({ user: user }, 'secret', { expiresIn: 50000 });//TOKEN DB EXPIRED 50000

        let updateLastLogin = `UPDATE users
                                SET lastLogin = ($1)
                                WHERE username = ($2)`;

        pool.query(updateLastLogin, [new Date(), user.username], function (err, results) {
            if (err) {
                reject('An Error has occured, please try again');
            }
            else {
                resolve(JSON.stringify({
                    title: 'Successfully logged in',
                    token: token,
                    username: user.username,
                    firstname: user.firstname,
                }));
            }

        })
    });
}

module.exports = function (app) {

    app.post('/auth/v1/register', async function (req, res) {
        console.log("register ,", req.body);
        try {
            let { username, password, email } = req.body;
            //password encryption
            password = bcrypt.hashSync(password, 10);
            //user creation
            const user = await User.create({ username: username, password: password, email: email });
            //verification code generation
            const verificationToken = await VerificationToken.create({ username: user.dataValues.username, token: cryptoRandomString({ length: 20, type: 'url-safe' }), createdat: new Date(), updatedat: new Date() })
            //jwt token 
            let jwtTokenEmailVerify = jwt.sign({ email: user.dataValues.email }, 'secret', { expiresIn: "1h" });
            //sending verificaiton email
            await verificationService.sendVerificationEmail(user.dataValues.email, verificationToken.dataValues.token, jwtTokenEmailVerify)

            return res.status(200).send(`You have Registered Successfully, Activation link sent to: ${user.dataValues.email}`)

        } catch (err) {
            console.log("err1 ", err)
            return res.status(500);
        }
    })



    app.post('/auth/v1/login', async function (req, res) {
        try {
            const { username, password } = req.body;
            const results = await User.findOne({ where: { username: username } });
            if (!results) {
                return res.status(401).send('Invalid login credentials');
            }
            else {
                if (!bcrypt.compareSync(password, results.dataValues.password)) {
                    return res.status(401).send('Invalid login credentials');
                }
                else {
                    const data = await validateToken(results.dataValues);
                    return res.status(200).send(result)
                }
            }

        } catch (err) {
            return res.status(500).send((err.title));

        }
    });


};