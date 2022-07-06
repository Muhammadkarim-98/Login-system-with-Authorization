const JWT = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const optons = {
                expiresIn: "1h",
                issuer: "saudimontana.com",
                audience: userId,
            };
            JWT.sign(payload, secret, optons, (err, token) => {
                if (err) {
                    return reject(createError.InternalServerError(err.message));
                }
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers["authorization"]) return next(createError.Unauthorized());
        const authHeader = req.headers["authorization"];
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },

    refreshAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = "secret";
            const optons = {
                expiresIn: "1h",
                issuer: "saudimontana.com",
                audience: userId,
            };
            JWT.sign(payload, secret, optons, (err, token) => {
                if (err) return reject(createError.InternalServerError(err.message));
                resolve(token);
            });
        });
    },

    verifyRefreshAccessToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_ACCESS_TOKEN,
                (err, payload) => {
                    if (err) return reject(createError.Unauthorized());
                    const userId = payload.aud;
                    resolve(userId);
                }
            );
        });
    },
};