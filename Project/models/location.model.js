const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

exports.getAllLocations = async () => {
    try {

        return await prisma.location.findMany();

    } catch (error) {

        return error
    }
}

exports.createLocation = async(data) => {

    try {

        const location = await prisma.location.create({
            data
        });

        return location;

    } catch (error) {

        return error 
    }
}

exports.updateLocation = async(id, data) => {
    try {

        const location = await prisma.location.update({

            where: {idlocation: parseInt(id)},

            data
        })

        return location;

    } catch (error) {

        return error
    }
}

exports.setLocationSitTypePrice = async (data) => {
    try {

        const locationSitType = await prisma.location_has_sittype.create({

            data
        })

        return locationSitType

    } catch (error) {

        return error

    }
}

exports.findLocationSitTypePrice = async (locationId, sitTypeId) => {
    try {

        const locationSitType = await prisma.location_has_sittype.findUnique({

            where: {

                location_idlocation_sittype_idsitType: {

                    location_idlocation: parseInt(locationId),
                    sittype_idsitType: parseInt(sitTypeId)
                }
            }
        }) 

        return locationSitType.price

    } catch (error) {

        return error

    }
}

exports.updateSitLocationPrices = async (locationId, sitType, data) => {
    try {

        const sitLocations = await prisma.sitlocation.updateMany({

            where: {

                AND: [

                    {location_idlocation: parseInt(locationId)},

                    {sitType_idsitType: parseInt(sitType)}

                ]
            },
            
            data
        })

        return sitLocations

    } catch (error) {


    }
}