var initialCampusData = function() {
};

initialCampusData.prototype = function() {
	var initialCampuses = [{
        "campusId":"edgbaston",
        "campusName":"Edgbaston Campus",
        "buildings": [
             {
                 "buildingId":"ML", 
                 "buildingName":"Main library", 
                 "location":"edgbaston campus", 
                 "lat": "52.451341", 
                 "long": "-1.930321",
                 "clusters": [
                     {
                         "CoordinatesArray":[52.451341,-1.930321],
                         "FacilityName":"Main Library Orange Cluster",
                         "RoomId":"ISML-MLZ1",
                         "RoomBooked":false,
                         "NoOfPcsFree":16,
                         "RbRoomId":"ML-Orange"
                     },
                     {
                         "CoordinatesArray":[52.451341,-1.930321],
                         "FacilityName":"Main Library Green Cluster",
                         "RoomId":"ISML-MLZ4",
                         "RoomBooked":false,
                         "NoOfPcsFree":10,
                         "RbRoomId":"ML-Green"
                     }
                 ]
             },
             {
                 "buildingId":"LC", 
                 "buildingName":"Learning Centre", 
                 "location":"edgbaston campus", 
                 "lat": "52.450632", 
                 "long": "-1.93567",
                 "clusters": [
                     {
                         "CoordinatesArray":[52.450632,-1.93567],
                         "FacilityName":"Learning Centre LG12",
                         "RoomId":"ISLC-LG12",
                         "RoomBooked":false,
                         "NoOfPcsFree":70,
                         "RbRoomId":"LC-LG12"
                     }
                 ]
             }
         ]
    },
    {
        "campusId":"sellyoak",
        "campusName":"Selly Oak Campus",
        "buildings": [
             {
                 "buildingId":"OLRC", 
                 "buildingName":"Orchard Learning Resource Centre", 
                 "location":"selly oak campus", 
                 "lat": "52.434155", 
                 "long": "-1.947595",
                 "clusters": [
                     {
                         "CoordinatesArray":[52.434155,-1.947595],
                         "FacilityName":"OLRC G05",
                         "RoomId":"IS-OLRC-G05",
                         "RoomBooked":false,
                         "NoOfPcsFree":18,
                         "RbRoomId":"OLRC-G05"
                     }
                 ]
             }
         ]
                
    }],


    getInitialCampusesData = function() {
		return JSON.stringify(initialCampuses);
	};
    
    return {
		getInitialCampusesData:getInitialCampusesData,
	};
}();


