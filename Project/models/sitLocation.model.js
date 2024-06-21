const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

exports.getAllSitlocations = async () => {
    try {

        return await prisma.sitlocation.findMany();

    } catch (error) {

        return error
    }
}

exports.createSitlocation = async(data) => {

    try {

        const sitlocation = await prisma.sitlocation.create({
            data
        });

        return sitlocation;

    } catch (error) {

        return error 
    }
}

exports.updateSitlocation = async(id, data) => {
    try {

        const sitlocation = await prisma.sitlocation.update({

            where: {idsitLocation: parseInt(id)},

            data
        })

        return sitlocation;

    } catch (error) {

        return error
    }
}
