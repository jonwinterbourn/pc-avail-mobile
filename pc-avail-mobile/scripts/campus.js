var initialCampusData = function() {
};

initialCampusData.prototype = function() {
	var initialCampuses = [{
        "campusId":"edgbaston",
        "campusName":"Edgbaston Campus",
        "buildings": [
            {"buildingId":"ML", "buildingName":"Main library", "location":"edgbaston campus", "lat": "52.451341", "long": "-1.930321"},
            {"buildingId":"LC", "buildingName":"Learning Centre", "location":"edgbaston campus", "lat": "52.450632", "long": "-1.93567"}
         ]   
    },
    {
        "campusId":"sellyoak",
        "campusName":"Selly Oak Campus",
        "buildings": [
            {"buildingId":"OLRC", "buildingName":"Orchard Learning Resource Centre", "location":"selly oak campus", "lat": "52.434155", "long": "-1.947595"}
         ]
    }],


    getInitialCampusesData = function() {
		return JSON.stringify(initialCampuses);
	};
    
    return {
		getInitialCampusesData:getInitialCampusesData,
	};
}();


