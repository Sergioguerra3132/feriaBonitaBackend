const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorcodesenum = require('../structs/errors/errorcodes');
const WebSocketSingleton = require('./WebSocketSingleton');


class AuthManager {
    static async validatePassword(req, result, next) {
        const {  PasswordForValidate, storedPasswordHash } = req;
        try {
            const isValid = await bcrypt.compare(PasswordForValidate, storedPasswordHash);
            if (isValid) {
                next();
            } else {
                const error={status:errorcodesenum.INTERNAL_SERVER_ERROR,printMessage:"Invalid Credentials"};
                next(error,null);
                        }
        } catch (error) {
            error.printMessage="Invalid Credentials"
            next(error,null);
        }
    }

    static authenticateJWT(req, result, next) {
        const token = req.header('authorization') ? req.header('authorization').split(' ')[1] : null;
        
        if (!token) {
            const error={status:errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED,printMessage:"Token is missing"};
            next(error,null);
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {

            if (error) {
                error.printMessage="Invalid Token"
                next(error,null);
            }
            req.user = user;
            next();
        });

    }

    static validateJWT(token,result, next) {

        const error={status: errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Token is missing"};

        if (!token) {
            next(error,null);
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedContent) => {
            if (err) {
                next(error,null);
            }
            
            next(null, decodedContent);  // pass decodedContent as second argument
        });

    }

    static getCurrencyJwtData(token) {

        return new Promise((resolve, reject) => {
            if (!token) {
                const error = { status: errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Token is missing" };
                reject(error);
            } else {
                jwt.verify(token, process.env.CURRENCY_SECRET, (err, decodedContent) => {
                    if (err) {
                        const error = { status: errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Invalid Token" };
                        reject(error);
                    } else {
                        resolve(decodedContent);
                    }
                });
            }
        });
    }

    static validateAdmin() {
       
       
        const error = { status: errorcodesenum.UNAUTHORIZED, printMessage: "You can't access this" };
        return (req, res, next) => {
            if (!req) {
                return next(error);
            }
            

            AuthManager.authenticateJWT(req, res, (err) => {  // Changed result to res
                if (err) {
                    return next(error);
                }
                if(req.user && req.user.sysUserRole_idsysuserRole != 1) {                
                    return next(error);
                }
                next();
            });
        };
    }
   


    
    static validateSwaggerAdmin() {

        const error = { status: errorcodesenum.UNAUTHORIZED, printMessage: "You can't access this" };
        return (req, res, next) => {

            if (!req) {
                return next(error);
            }
       
            const token = req.cookies.authToken;

            if(!token) { // Check if token exists in session
                return next(error);
            }
            req.headers.authorization = `Bearer ${token}`; 


            AuthManager.authenticateJWT(req, res, (err) => {  // Changed result to res
                if (err) {
                    return next(error);
                }
                console.log(req.user);
                if(req.user && req.user.sysUserRole_idsysuserRole != 4) {                
                    return next(error);
                }
                next();
            });
        };
    }
    
    
}



module.exports = AuthManager;
