const sysUser = require('../models/sysUser.model');
const AuthManager = require('../middlewares/authMiddleware');
const EmailTemplate = require('../structs/EmailsTemplates/TemplateEmail');
const AnswerManager = require('../middlewares/AnswerManager');
const sendMail = require('../middlewares/emailMiddleware');
const passwordMiddleware = require('../middlewares/passwordMiddleware');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const errorcodesenum = require('../structs/errors/errorcodes');
const RecoveryPasswordEmailTemplate = require('../structs/EmailsTemplates/RecoveryPasswordEmailTemplate');


//Circuit braker
const createSysUserBreaker = CircuitBreakerHandler.createBreaker(sysUser.createSysUser);
const validateBreaker = CircuitBreakerHandler.createBreaker(sysUser.getSysUserByEmail);
const getProfileBreaker = CircuitBreakerHandler.createBreaker(sysUser.getUserProfile);
const updateProfileBreaker = CircuitBreakerHandler.createBreaker(sysUser.updateProfileInfo);
const updateTempPasswordSysUserBreaker = CircuitBreakerHandler.createBreaker(sysUser.updateTempPasswordSysUser);
const getAllSysUsersBreaker = CircuitBreakerHandler.createBreaker(sysUser.getAllSysUsers);
const updateSysUserBreaker = CircuitBreakerHandler.createBreaker(sysUser.updateSysUser);


let userJwtData = {
  idsysuser: 0,
  email: "",
  sysUserRole_idsysuserRole: 0,
  userStatus_iduserStatus: 0
};

exports.getUserProfile = async (req, res) => {
  try {

    const userId = req.user.idsysuser;
    console.log(userId)
    const profileInfo = await getProfileBreaker.fire(userId);

    AnswerManager.handleSuccess(res, profileInfo);

  } catch (error) {

    AnswerManager.handleError(res, error);

  }
}

exports.updateProfileInfo = async (req, res) => {
  try {

    const userId = req.user.idsysuser;
    const userName = req.body;

    console.log(req.user)
    console.log(userId)

    const profile = await updateProfileBreaker.fire(userId, userName);

    AnswerManager.handleSuccess(res, profile);

  } catch (error) {

    AnswerManager.handleError(res, error)
    console.log(error)
  }
}

exports.getAllSysUsers = async (req, res) => {
  try {

    const users = await getAllSysUsersBreaker.fire();

    AnswerManager.handleSuccess(res, users);

  } catch (error) {

    AnswerManager.handleError(res, error);
  }
}

exports.registerUser = async (req, res) => {
  try {

    const {password, email, userName, userLastName, sysUserDocument} = req.body;
    const hashedPassword = await passwordMiddleware.hashPassword(password);
    const tempCode = await passwordMiddleware.generateRandomCode(8);
    const hashedCode = await passwordMiddleware.hashPassword(tempCode);
    const existingEmail = await validateBreaker.fire(email)

    console.log(hashedCode)


    const now = new Date();
    
    const data = {
      userName,
      userLastName,
      sysUserDocument,
      email,
      password: hashedPassword,
      tempCode: hashedCode, 
      userRole_iduserRole: 5,
      userStatus_iduserStatus : 7,
      creationDate: now,
    }

    if (existingEmail) {

      const error = { status: errorcodesenum.NOT_FOUND, printMessage: "User is already registered" };
      AnswerManager.handleError(res, error);

    } else {

      const user = await createSysUserBreaker.fire(data);
  
      console.log(user);
      
      const jwtToken = passwordMiddleware.generateJWT({userId: user.idsysuser, validationCode: tempCode, mail: email}, "120m");
      const fullUrl = `${req.protocol}://${req.get('host')}/api/sysUser/activate/${jwtToken}?redirect=true`;
      
      const userMail = new EmailTemplate(email, "Welcome to Steel Shock", "", userName, fullUrl);
      await sendMail(userMail);
      
  
      AnswerManager.handleSuccess(res, user);
    }

  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};


exports.activateUser = async (req, res) => {
  const { token } = req.params;
  const { redirect } = req.query;

  try {
    AuthManager.validateJWT(token, res, async (err, decodedContent) => {
      if (err) {
        handleRedirectOrError(res, redirect, { status: errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Token Invalid" });
        return;
      }

      const data = decodedContent;

      console.log("Decrypted ",data)
      if (!data) {
        handleRedirectOrError(res, redirect, err);
        return;
      }

      const user = await sysUser.getSysUserByEmail(data.mail);

      
      if (!user) {
        handleRedirectOrError(res, redirect, err);
        return;
      }

      const passwordValidation = {
        PasswordForValidate: data.validationCode,
        storedPasswordHash: user.tempCode
      };

     
      

      AuthManager.validatePassword(passwordValidation, res, async (err) => {
        if (err) {
          handleRedirectOrError(res, redirect);
          return;
        }

        const newUserData = {
          tempCode: "",
          userStatus_iduserStatus: 8
        };
        await sysUser.updateSysUser(user.idsysuser, newUserData);

        if (redirect) {
          res.redirect('/SuccessActivate.html');
        } else {
          AnswerManager.handleSuccess(res);
        }
      });
    });
  } catch (error) {
    handleRedirectOrError(res, redirect, error);
  }
};

function handleRedirectOrError(res, redirect, error = null) {
  if (redirect) {
    res.redirect('/FailedActivation.html');
  } else if (error) {
    AnswerManager.handleError(res, error);
  }
}


exports.loginUser = async (req, res) => {
  try {

    const user = await validateBreaker.fire(req.body.email);

    console.log(user)

    console.log(req.body)

    if (!user || user.userStatus_iduserStatus === 3) {

      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }

    if (!user || user.userStatus_iduserStatus === 2) {

      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }
    

    req.PasswordForValidate = req.body.password;
    req.storedPasswordHash = user.password;

    AuthManager.validatePassword(req, res, async (err) => {
      try {
        if (err) {
          
          const passwordValidation = {
            PasswordForValidate: req.body.password,
            storedPasswordHash: user.tempPassword
          };

          AuthManager.validatePassword(passwordValidation, res, async (err2) => {
            try{
              if(err2)
              {
                AnswerManager.handleError(res, err);
              }
              else
              {
                if(user.tempPasswordExpDate.getTime() >= Date.now())
                {
                  res.IsTempPassword=true;
                  AnswerManager.handleSuccess(res, {IsTempPassword:true, email:req.body.email,tempCode:req.body.password});
                }
                else
                {
                  AnswerManager.handleError(res, err);
                }
               
              }
            }
            catch(error)
            {
              AnswerManager.handleError(res, error);
            }

          })
         
          return;
        }

        Object.assign(userJwtData, {
          idsysuser: user.idsysuser,
          email: user.email,
          userStatus_iduserStatus: user.userStatus_iduserStatus,
          sysUserRole_idsysuserRole: user.userRole_iduserRole,  
        });

        const jwt = passwordMiddleware.generateJWT(userJwtData, "15d");

        let responseData = {
          message: 'Logged in successfully',
          token: jwt,
          walletAddress: user.walletAddress,
          userName: user.userName
      };

        AnswerManager.handleSuccess(res, responseData);

      } catch (internalError) {
        
        console.log("Response ",internalError)
        AnswerManager.handleError(res, internalError);
      }
    });

  } catch (error) {
    console.log(error)
    AnswerManager.handleError(res, error);
  }
};

exports.loginSwaggerUser = async (req, res) => {
  try {

    const user = await validateBreaker.fire(req.body.email);




    if (!user || user.userStatus_iduserStatus === 7) {

      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }

    if (!user || user.userStatus_iduserStatus === 7) {

      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }
    

    req.PasswordForValidate = req.body.password;
    req.storedPasswordHash = user.password;

    AuthManager.validatePassword(req, res, async (err) => {
      try {
        if (err) {
         
          AnswerManager.handleError(res, err);
          return;
        }

        Object.assign(userJwtData, {
          idsysuser: user.idsysuser,
          email: user.email,
          userStatus_iduserStatus: user.userStatus_iduserStatus,
          sysUserRole_idsysuserRole: user.userRole_iduserRole
        });

        const jwt = passwordMiddleware.generateJWT(userJwtData, "15d");
        console.log(jwt)
        req.session.token = jwt;
        AnswerManager.handleSuccess(res, { message: 'Logged in successfully', token: jwt, userName:user.userName });

      } catch (internalError) {
        
        console.log("Response ",internalError)
        AnswerManager.handleError(res, internalError);
      }
    });

  } catch (error) {
    console.log(error)
    AnswerManager.handleError(res, error);
  }
};

exports.resendValidation = async (req, res) => {
  try {

    const {email} = req.body;
    const tempCode = await passwordMiddleware.generateRandomCode(8);
    const hashedCode = await passwordMiddleware.hashPassword(tempCode);


    const user = await validateBreaker.fire(req.body.email);
    
    const data={
      tempCode:hashedCode
    }

    await sysUser.updateSysUser(user.idsysuser,data)
    
    const jwtToken = passwordMiddleware.generateJWT({userId: user.idsysuser, validationCode: tempCode, mail: email}, "120m");
    const fullUrl = `${req.protocol}://${req.get('host')}/api/sysUser/activate/${jwtToken}?redirect=true`;
    
    const userMail = new EmailTemplate(email, "Welcome to Steel Shock", "", user.userName, fullUrl);
    await sendMail(userMail);
    

    AnswerManager.handleSuccess(res, user);
  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};


exports.registerWallet = async (req, res) => {


  try{

   const walletInDB= await sysUser.validateWallet(req.body.walletAddress);
   
   if(walletInDB)  return AnswerManager.handleError(res, { message: "Wallet registered in database" });


   const userInfo =  await sysUser.getSysUserById(req.user.idsysuser);
   
 if(userInfo.walletAddress) return AnswerManager.handleError(res, { message: "User Have Wallet " });
   
 const newUserData=
  {
    walletAddress:req.body.walletAddress
  }

  const updateUser= await sysUser.updateSysUser(req.user.idsysuser, newUserData);

  AnswerManager.handleSuccess(res, updateUser);

  }
  catch(error)
  {
    AnswerManager.handleError(res, error);
  }
  

};

exports.resetPassword = async (req, res) => {
  try {

    const { email,password,tempCode} = req.body;

    console.log("Reset Password ",email,password,tempCode)
    const hashedPassword = await passwordMiddleware.hashPassword(password);
    const user= await validateBreaker.fire(email);

    const passwordValidation = {
      PasswordForValidate: tempCode,
      storedPasswordHash: user.tempPassword
    };

    AuthManager.validatePassword(passwordValidation, res, async (err) => {
      try {
        if (err) {
         
          console.log(err)
          AnswerManager.handleError(res, err);
          return;
        }

        if (user.tempPasswordExpDate.getTime() >= Date.now()) {
          
          const newUserData = {
                  tempPassword: null,
                  tempPasswordExpDate: null,
                  password:hashedPassword
                };
                
                const response=await sysUser.updateSysUser(user.idsysuser, newUserData);
                console.log("Response of change ",newUserData,response)
                AnswerManager.handleSuccess(res, { message: 'Password Changed'});

        } else {

          AnswerManager.handleError(res, { message: 'Code Expired'});

        }    

      } catch (internalError) {
        
        console.log("Response ",internalError)
        AnswerManager.handleError(res, internalError);
      }
    });

  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};

exports.generateResetCode = async (req, res) => {
  try {

    const { email} = req.body;
    const tempCode = await passwordMiddleware.generateRandomCode(8);
    const hashedPassword = await passwordMiddleware.hashPassword(tempCode);
    const now = new Date();

    now.setMinutes(now.getMinutes() + 30);
    
    const data = {
      tempPassword: hashedPassword, 
      tempPasswordExpDate: now
    };

    const currentUser= await validateBreaker.fire(email);

    const userName=currentUser.userName;

    

    const user = await updateTempPasswordSysUserBreaker.fire(email,data);

    console.log(user);

    const userMail = new RecoveryPasswordEmailTemplate(email, "Password Recovery", "", userName, tempCode);
    await sendMail(userMail);
    

    AnswerManager.handleSuccess(res, user);
  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};

exports.getUserByGoogleToken = async (req, res) => {
  try {

    const { token, email } = req.body;

    const user = await validateBreaker.fire(email)

    if (user) {

      console.log("No pasa condicional")

      const updatedUser = await updateSysUserBreaker.fire(user.idsysuser, {sysUserTokenGoogle: token})

      AnswerManager.handleSuccess(res, updatedUser)

    } else {

      console.log("Pasa condicional")
      const data = {

        email: email,
        userStatus_iduserStatus: 1,
        sysUserTokenGoogle: token,
      }

      const createdUser = await createSysUserBreaker.fire(data);

      AnswerManager.handleSuccess(res, createdUser)

    }

    } catch (error) {

      AnswerManager.handleError(res, error)

  }
};

exports.getUserByAppleToken = async (req, res) => {
  try {

    const { token, email } = req.body;

    const user = await validateBreaker.fire(email)

    if (user) {

      console.log("No pasa condicional")

      const updatedUser = await updateSysUserBreaker.fire(user.idsysuser, {sysUserTokenApple: token})

      AnswerManager.handleSuccess(res, updatedUser)

    } else {

      console.log("Pasa condicional")
      const data = {

        email: email,
        userStatus_iduserStatus: 1,
        sysUserTokenApple: token,
      }

      const createdUser = await createSysUserBreaker.fire(data);

      AnswerManager.handleSuccess(res, createdUser)

    }

    } catch (error) {

      AnswerManager.handleError(res, error)

  }
};

exports.getUserByWallet = async (req, res) => {
  try {

    const { token, email } = req.body;

    const user = await validateBreaker.fire(email)

    if (user) {

      console.log("No pasa condicional")

      const updatedUser = await updateSysUserBreaker.fire(user.idsysuser, {codeLoginWallet: token})

      AnswerManager.handleSuccess(res, updatedUser)

    } else {

      console.log("Pasa condicional")
      const data = {

        email: email,
        userStatus_iduserStatus: 1,
        codeLoginWallet: token,
      }

      const createdUser = await createSysUserBreaker.fire(data);

      AnswerManager.handleSuccess(res, createdUser)

    }

    } catch (error) {

      AnswerManager.handleError(res, error)

  }
};

