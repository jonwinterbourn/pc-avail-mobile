var initialBuildingData = function() {
};

initialBuildingData.prototype = function() {
	var initialBuildings = [{
        "buildingId":1,
        "buildingName":"Main library",
        "numberOfPcs":149,
        "location":"test location",
        "openingHours":"all day"
    },{
        "buildingId":2,
        "buildingName":"Learning Centre",
        "numberOfPcs":345,
        "location":"test data",
        "openingHours":"all day and night"
    }],

	getInitialBuildingsData = function() {
		return JSON.stringify(initialBuildings);
	};
    
	return {
		getInitialBuildingsData:getInitialBuildingsData,
	};
}();