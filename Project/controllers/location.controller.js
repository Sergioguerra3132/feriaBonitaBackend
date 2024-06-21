const locationController = require('../models/location.model')
const sitLocationController = require('../models/sitLocation.model')
const AnswerManager = require('../middlewares/AnswerManager')
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler')

const createLocationBreaker = CircuitBreakerHandler.createBreaker(locationController.createLocation)
const createSitLocationBreaker = CircuitBreakerHandler.createBreaker(sitLocationController.createSitlocation)
const updateLocationBreaker = CircuitBreakerHandler.createBreaker(locationController.updateLocation)
const getAllLocationsBreaker = CircuitBreakerHandler.createBreaker(locationController.getAllLocations)
const setLocationSitTypePriceBreaker = CircuitBreakerHandler.createBreaker(locationController.setLocationSitTypePrice)
const findLocationSitTypePriceBreaker = CircuitBreakerHandler.createBreaker(locationController.findLocationSitTypePrice)
const updateSitLocationPricesBreaker = CircuitBreakerHandler.createBreaker(locationController.updateSitLocationPrices)

function generateDescription(prefijo, numero) {
    const numeroFormateado = String(numero).padStart(5, '0');
    return `${prefijo}${numeroFormateado}`;
}


exports.getAllLocations = async (req, res) => {
    try {

        const locations = await getAllLocationsBreaker.fire();
        AnswerManager.handleSuccess(res, locations);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}

exports.createLocation = async(req, res) => { 
    try {

        const {locationDescription, prefix, sitAmount} = req.body;

        console.log(sitAmount)
        
        const locationData = {
            
            locationDescription,
            prefix
        }
        
        const createdLocation = await createLocationBreaker.fire(locationData)

        AnswerManager.handleSuccess(res, createdLocation, createdLocation)

        for (let i = 0; i < sitAmount; i ++) {

            const sitName = generateDescription(prefix, i + 1)
            
            console.log(sitName)

            const data = {

                sitLocationDescription: sitName,
                location_idlocation: createdLocation.idlocation,
                sitType_idsitType: 1,
            }

            const createdSitLocation = await createSitLocationBreaker.fire(data)


        }

    } catch (error) {

        AnswerManager.handleError(res, error)
    }
};

exports.updateLocation = async(req, res) => {
    try {

        const LocationId = req.params.id;
        const data = req.body;

        
        const updatedLocation = await updateLocationBreaker.fire(LocationId, data);
        
        AnswerManager.handleSuccess(res, updatedLocation, data);

    } catch (error) {

        AnswerManager.handleError(res, error);

    }
}

exports.setLocationSitTypePrice = async (req, res) => {
    try {

        const {location_idlocation, sittype_idsitType, price} = req.body

        const data = {

            location_idlocation,
            sittype_idsitType,
            price
        }

        const locationSitType = await setLocationSitTypePriceBreaker.fire(data)

        const updatedSitLocations = await updateSitLocationPricesBreaker.fire(location_idlocation, sittype_idsitType, {sitLocationPrice: price})

        AnswerManager.handleSuccess(res, locationSitType)

    } catch (error) {

        AnswerManager.handleError(res, error)
    }
}