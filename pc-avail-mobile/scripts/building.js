var initialBuildingData = function() {
};

initialBuildingData.prototype = function() {
	var initialBuildings = [{
        "buildingId":1,
        "buildingName":"Main library",
        "numberOfPcs":149,
        "location":"",
        "openingHours":""
    },
    {
        "buildingId":2,
        "buildingName":"Learning Centre",
        "numberOfPcs":345,
        "location":"",
        "openingHours":""
    }],

	getInitialBuildingsData = function() {
		return JSON.stringify(initialBuildings);
	};
    
	return {
		getInitialBuildingsData:getInitialBuildingsData,
	};
}();