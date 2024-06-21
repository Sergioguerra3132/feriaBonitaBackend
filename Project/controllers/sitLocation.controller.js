const sitlocationController = require('../models/sitLocation.model')
const AnswerManager = require('../middlewares/AnswerManager')
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler')

const createSitlocationBreaker = CircuitBreakerHandler.createBreaker(sitlocationController.createSitlocation)
const updateSitlocationBreaker = CircuitBreakerHandler.createBreaker(sitlocationController.updateSitlocation)
const getAllSitlocationsBreaker = CircuitBreakerHandler.createBreaker(sitlocationController.getAllSitlocations)


exports.getAllSitlocations = async (req, res) => {
    try {

        const sitlocations = await getAllSitlocationsBreaker.fire();
        AnswerManager.handleSuccess(res, sitlocations);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}

exports.createSitlocation = async(req, res) => { 
    try {

        const data = req.body;
        const createdSitlocation = await createSitlocationBreaker.fire(data)
        
        AnswerManager.handleSuccess(res, createdSitlocation, data)

    } catch (error) {

        AnswerManager.handleError(res, error)
    }
};

exports.updateSitlocation = async(req, res) => {
    try {

        const sitlocationId = req.params.id;
        const data = req.body;

        
        const updatedSitlocation = await updateSitlocationBreaker.fire(sitlocationId, data);
        
        AnswerManager.handleSuccess(res, updatedSitlocation, data);

    } catch (error) {

        AnswerManager.handleError(res, error);

    }
}
