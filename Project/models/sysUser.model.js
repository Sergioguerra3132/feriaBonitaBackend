const { PrismaClient } = require("@prisma/client");
const { equal } = require("joi");
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
/*
exports.createSysUser = async (data) => {
  console.log(data);
  
  try {

    const user = await prisma.sysuser.create({
      data
    });
    return user;

  } catch (error) {
    return error;
  }
};
*/
exports.getAllSysUsers = async () => {
  return await prisma.sysuser.findMany();
};

exports.getSysUserById = async (id) => {

  return await prisma.sysuser.findUnique({
    where: {
      idsysuser: id,
    },
  });
};

exports.updateSysUser = async (id, data) => {
  return await prisma.sysuser.update({
    where: {
      idsysuser: id,
    },
    data,
  });
};

exports.deleteSysUser = async (id) => {
  return await prisma.sysuser.delete({
    where: {
      idsysUser: id,
    },
  });
};

exports.getSysUserByEmail = async (mailToEvaluate) => {

  const user=  await prisma.sysuser.findUnique({
    where: {
      email: mailToEvaluate
    }
  });

  return user;
};

exports.validateWallet = async (wallet) => {
  try {
    
      // You can use findFirst or findUnique, depending on your Prisma Client version
      // findFirst is more universal and works in both old and new versions
      const user = await prisma.sysuser.findFirst({ 
          where: { 
              walletAddress: wallet 
          } 
      });

      
      if (!user) {
       
          return null;
         
      }

      return user;
  } catch (err) {
      console.log("error: ", err);
      return err;
  }
};

exports.updateTempPasswordSysUser = async (email, data) => {
  
  return await prisma.sysuser.update({
    where: {
      email: email,
    },
   data
  });
};

exports.getUserProfile = async (userId) => {
  try {

    const user = await prisma.sysuser.findUnique({

      where: {idsysuser: parseInt(userId)},

      include: {
        rankedDivision: {

          select: {

            rankedDivisionDescription: true
          }
        }
      }

    })

    const userData = {

      userName: user.userName,
      userCups: user.sysUserCupsDecrypted,
      userSteelPoints: user.sysUserCurrentSteelDecrypted,
      userRanked: user.rankedDivision.rankedDivisionDescription,

    }

    return userData

  } catch (error) {

    return error
  }
}

exports.updateProfileInfo = async (userId, data) => {
  try {

    const userProfile = await prisma.sysuser.update({

      where: {idsysuser: parseInt(userId)},

      data: {

        userName: data.userName
      }
    })

    const userData = {

      userName: userProfile.userName
    }

    return userData;

  } catch (error) {

    return error
  }
} 

exports.createSysUser = async (data) => {
  try {
    // Add creationDate field with the current date
    const currentDate = new Date();
    const userData = {
      ...data,
      creationDate: currentDate,
    };

    const user = await prisma.sysuser.create({
      data: userData,
    });
    return user;
  } catch (error) {
    return error;
  }
};
