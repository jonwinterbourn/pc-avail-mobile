var initialBuildingData = function() {
};

initialBuildingData.prototype = function() {
	var initialBuildings = [{
        "buildingId":"ML",
        "buildingName":"Main library",
        "location":"edgbaston campus",
        "lat", "52.451341",
        "long", "-1.930321"
    },{
        "buildingId":"LC",
        "buildingName":"Learning Centre",
        "location":"edgbaston campus",
        "lat", "52.450632",
        "long", "-1.93567"
    },{
        "buildingId":"MED",
        "buildingName":"Medical School",
        "location":"edgbaston campus",
        "lat", "52.452178",
        "long", "-1.938272"
    },{
        "buildingId":"CHEMENG",
        "buildingName":"Chemical Engineering",
        "location":"edgbaston campus",
        "lat", "52.449366",
        "long", "-1.935503"
    },{
        "buildingId":"ARTS",
        "buildingName":"Arts Building",
        "location":"edgbaston campus",
        "lat", "52.450785",
        "long", "-1.929517"
    },{
        "buildingId":"NUFF",
        "buildingName":"Nuffield Centre",
        "location":"edgbaston campus",
        "lat", "52.449474",
        "long", "-1.928852"
    },{
        "buildingId":"OLRC",
        "buildingName":"Orchard Learning Resource Centre",
        "location":"selly oak campus",
        "lat", "52.434155",
        "long", "-1.947595"
    },{
        "buildingId":"POYN",
        "buildingName":"Poynting Building",
        "location":"edgbaston campus",
        "lat", "52.449863",
        "long", "-1.929259"
    },{
        "buildingId":"SPORTEX",
        "buildingName":"Sport and Exercise Science",
        "location":"edgbaston campus",
        "lat", "52.448098",
        "long", "-1.935933"
    },{
        "buildingId":"STRATH",
        "buildingName":"Strathcona Building",
        "location":"edgbaston campus",
        "lat", "52.451541",
        "long", "-1.928197"
    },{
        "buildingId":"LINK",
        "buildingName":"The Link",
        "location":"",
        "lat", "52.453332",
        "long", "-1.92817"
    }],

	getInitialBuildingsData = function() {
		return JSON.stringify(initialBuildings);
	};
    
	return {
		getInitialBuildingsData:getInitialBuildingsData,
	};
}();