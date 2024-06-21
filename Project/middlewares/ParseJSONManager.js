class ParseJSONManager {

    static parseJSON(jsonData, dataClass) {

        try {

            if (jsonData[dataClass] && Array.isArray(jsonData[dataClass])) {

                return jsonData[dataClass];

            } else {

                console.error(`Invalid data structure for ${dataClass}`);
                return null;

            }

        } catch (error) {

            console.error(`Error parsing JSON: ${error}`);
            return null;
            
        }
    }

    
}

module.exports = ParseJSONManager;
