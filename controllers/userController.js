const crypto = require('crypto');
const User  = require('../models/useModel');
const AuthToken = require('../models/authTokenModel');
const jwt = require('jsonwebtoken');

class UserController {
    constructor() {}
    makePasswordHash(password) {
        const hash = crypto.createHmac('sha256', 'secret-hash')
                   .update(password)
                   .digest('hex');
                   return hash;
    }

    async userSignup(req, res) {
        try {
            const { uname, password } = req.body;
            if (!uname || uname === '' || !password || password === '') {
                return res.sendError(400, 'invalid input data')
            }
            // const userRegex = new RegExp('^[A-Za-z]\\w{5, 29}$', 'g');
            // if (!userRegex.test(uname)) {
            //     return res.sendError(400, 'please enter valid username')
            // }
            const pwdHash = new UserController().makePasswordHash(password)
           const data = User({username: uname, password: pwdHash });
           await data.save();
         return res.sendResponse(200,'user added sucessfully')
        } catch(e) {
            console.log(e);
            if (parseInt(e.code) === 11000) {
                return res.sendError(400, 'user name already taken. please enter differnt user name')
            }
            return res.sendError(500, 'DB error')
        }   
    }

    async userLogin(req, res) {
        try {
            const { uname, password } = req.body;
            console.log(req.headers);
            const { deviceid } = req.headers;
            if (!uname || uname === '' || !password || password === ''|| !deviceid || deviceid === '') {
                return res.sendError(400, 'invalid input data')
            }
            const pwdHash = new UserController().makePasswordHash(password)
           const data = await User.findOne({ username: uname, password: pwdHash });
           if (!data) {
            return res.sendError(404, 'no user found')
           }
           const authToken = jwt.sign({id: data._id, deviceId: deviceid},  process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
           const refreshToken = jwt.sign({id: data._id, deviceId: deviceid },  process.env.REFRESH_JWT_SECRET, { expiresIn: process.env.REFRESH_JWT_EXPIRES});
           await AuthToken.findOneAndUpdate({ userId: data.id}, {token: authToken, refreshtoken: refreshToken, deviceId: deviceid}, { upsert: true });
           return res.sendResponse(200,{ authToken, refreshToken });
        } catch(e) {
            console.log(e);
            return res.sendError(500, 'DB error')
        }   
    }

    async userGreet(req, res) {
        try {
         return res.sendResponse(200,'Greeting of the day')
        } catch(e) {
            console.log(e);
            return res.sendError(500, 'DB error')
        }   
    }

    async getNewAuthToken(req, res) {
        try {
            const { refreshtoken, deviceid } = req.headers;
            const decode = await jwt.verify(refreshtoken, process.env.REFRESH_JWT_SECRET);
            const activeUser = await AuthToken.findOne({ userId: decode.id });
            console.log(refreshtoken);
            console.log(decode)
            console.log(activeUser)
            console.log(activeUser.deviceId !== decode.deviceid);
            if (!activeUser || (deviceid !== decode.deviceId) ||(activeUser.deviceId !== decode.deviceId) || (activeUser.refreshtoken !== refreshtoken)) {
                return res.sendError(403, 'invlid token; login again');
            }
            const newauthToken = jwt.sign({id: decode.id, deviceId: decode.deviceId},  process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES });
            const newrefreshToken = jwt.sign({id: decode.id, deviceId: decode.deviceId },  process.env.REFRESH_JWT_SECRET, { expiresIn: process.env.REFRESH_JWT_EXPIRES});
            await AuthToken.findOneAndUpdate({ userId: decode.id}, {token: newauthToken, refreshtoken: newrefreshToken,  deviceId: deviceid});
            return res.sendResponse(200,{ authToken: newauthToken, refreshToken: newrefreshToken });
        } catch(e) {
            console.log(e);
            return res.sendError(500, 'DB error')
        }   
    }
}

module.exports = new UserController();