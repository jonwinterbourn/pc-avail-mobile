// JavaScript Document

// Wait for cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var mapElem,
cachedLocations = [];

// Cordova is ready
function onDeviceReady() {
    
    //getLocation();
    navigator.splashscreen.hide();
    
    
    getInitialCampusesData();
    campusesData.init();
	campusesData.campuses.bind("change", writeIntoLocalStorage);
    
    //check online status
    window.addEventListener("offline", function() {
        $(".offlineMessage").show();
    });
    window.addEventListener("online", function() {
        $(".offlineMessage").hide();
    }); 
}


//======================= News etc ==========================================//

var newsTestData = [
	{ title: "Main Library 3rd floor closed", description: "3rd floor of Main Library closed due to an infestation of pumpkin-flavoured cupcakes.", url: "images/holiday.png" }
    
];


var newsDataSource = new kendo.data.DataSource({
                        transport: {
                            // specify the XML file to read. The same as read: { url: "books.xml" }
                            read: "http://www.birmingham.ac.uk/webteam/pcavailability/news/index.aspx?Listing_SyndicationType=1"
                        },
                        schema: {
                            // specify the the schema is XML
                            type: "xml",
                            // the XML element which represents a single data record
                            data: "/rss/channel/item",
                            // define the model - the object which will represent a single data record
                            model: {
                                // configure the fields of the object
                                fields: {
                                    title: "title/text()",
                                    description: "description/text()"
                                }
                            }
                        }

                    });

function announcementListViewTemplatesInit() {
	$("#announcements-listview").kendoMobileListView({
		dataSource: newsDataSource,
        template: $("#announcement-listview-template").html()
	});
}

//======================= Campus/Buildings ===============================//

var buildingsData = kendo.observable({
	init:function(campusId) {
		
		this._buildingIds = {};
        
        var buildings=[];
      
        getBuildingsForMaps(campusId, function(buildings) {
        
            buildingsData.set("buildings", buildings);
        });

	},

	buildings : []
});

var clustersData = kendo.observable({
	init:function(buildingId) {
		
		this._clusterIds = {};

        var clusters = [];
        
        getClustersForBuildings(buildingId, function(clusters) {
        
            clustersData.set("clusters", clusters);
        });
        
	},

	clusters : []
});

function getInitialCampusesData(){

        $.getJSON("http://www.birmingham.ac.uk/web_services/Clusters.svc/maps", function(data) {
            
            localStorage.setItem("campuses",JSON.stringify(data));
        });

}

var campusesData = kendo.observable({
	init:function() {
		
		this._campusIds = {};
        var campuses=[];
		//if (window.localStorage.getItem("campuses") !== null) {
  //          campuses = JSON.parse(window.localStorage.getItem("campuses"));
		//    alert(JScampuses);
  //      }
        
        getMaps(function(campuses) {
                    
				campusesData.set("campuses", campuses);
			});
        
	},

	campuses : []
});

function writeIntoLocalStorage(e) {
	var dataToWrite = JSON.stringify(buildingsData.buildings);
	window.localStorage.setItem("buildings", dataToWrite);
    var dataToWriteC = JSON.stringify(campusesData.campuses);
	window.localStorage.setItem("campuses", dataToWriteC);
}

function listViewBuildingsInit() {
   
}

function listViewCampusesInit() {
   
}


function listViewBuildingsShow(arguments) {
    var campusId = arguments.view.params.campusId;
    
    buildingsData.init.call(buildingsData, campusId);
	
}

function listViewClustersShow(arguments) {
    var buildingId = arguments.view.params.buildingId;
    
    clustersData.init.call(clustersData, buildingId);

}


//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation

function getLocation(){
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);

}

function onGeolocationSuccess(position) {
    // Use Google API to get the location data for the current coordinates
    
    clustersShow();
    
   
}

function getPosition(handler) {
	navigator.geolocation.getCurrentPosition(handler, onGeolocationError, { enableHighAccuracy: true });
}

function getClusterLocations(position, handler) {
    
    $.getJSON("http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc?lat=" + position.coords.latitude + "&long=" + position.coords.longitude,
			function(data) {
                var locations = [];
                $.each(data, function() {
                    
	                locations.push(
		                {    
                        address: this.FacilityName, 
                        distance: Math.ceil(this.DistanceTo),
                        roombooked: this.RoomBooked,
                        pcsavailable: this.NoOfPcsFree,
                        latlng: new google.maps.LatLng(Number(this.CoordinatesArray[0]), Number(this.CoordinatesArray[1]))
		            });                
	            });
	            handler(locations);   
            }).error(function(error) {
				  alert(error.message);
			});
}

function getMaps(handler) {
     $.getJSON("http://www.birmingham.ac.uk/web_services/Clusters.svc/maps",
			function(data) {
                var campuses = [];
                $.each(data, function() {
                    
	                campuses.push(
		                {    
                        campusId: this.ContentId, 
                        campusName: this.MapName
		            });                
	            });
	            handler(campuses);   
            }).error(function(error) {
				  alert(error.message);
			});
}

function getBuildingsForMaps(map, handler) {
     $.getJSON("http://www.birmingham.ac.uk/web_services/Clusters.svc/maps/" + map + "/buildings",
			function(data) {
                var buildings = [];
                $.each(data, function() {
                    
	                buildings.push(
		                {    
                        buildingCode: this.BuildingCode, 
                        buildingName: this.BuildingName,
                        buildingId: this.ContentId
		            });                
	            });
	            handler(buildings);   
            }).error(function(error) {
				  alert(error.message);
			});
}

function getClustersForBuildings(building, handler) {
     $.getJSON("http://www.birmingham.ac.uk/web_services/Clusters.svc/buildings/" + building + "/clusters",
			function(data) {
                var clusters = [];
                $.each(data, function() {
                    
	                clusters.push(
		                {    
                        FacilityName: this.FacilityName,
                        RoomId: this.RoomId,
                        RoomBooked: this.RoomBooked,
                        NoOfPcsFree: this.NoOfPcsFree,
                        RbRoomId: this.RbRoomId
		            });                
	            });
	            handler(clusters);   
            }).error(function(error) {
				  alert(error.message);
			});
}


function clustersShow(e) {
        
	google.maps.event.trigger(map, "resize");
			
    var iteration = function() {
		getPosition(function(position) {
			// Use Google API to get the location data for the current coordinates
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
			var myOptions = {
				zoom: 16,
				center: latlng,
				mapTypeControl: false,
				navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			mapElem = new google.maps.Map(document.getElementById("map"), myOptions);
			var marker = new google.maps.Marker({
				position: latlng,
				map: mapElem,
				title: "Your Location",
                zIndex:google.maps.Marker.MAX_ZINDEX
			});
        
			getClusterLocations(position, function(locations) {
                    
				cachedLocations = locations;
				setClustersViews(locations);
			});
        			
		});
	};
	iteration();
    
}

function nearestShow(e) {
    
    var iteration = function() {
		getPosition(function(position) {
			// Use Google API to get the location data for the current coordinates
            
			getClusterLocations(position, function(locations) {
                    
				cachedLocations = locations;
				setClustersViews(locations);
			});
			
		});
	};
	iteration();
    
}

function onGeolocationError(error) {

    $(".offlineMessage").html("<span class='err'>" + error.message + "</span>");
}

function setClustersViews(locations) {
	var pinColor = "66CCFF";

    var pinImageGood = new google.maps.MarkerImage("images/computers.png");
    var pinImageWarning = new google.maps.MarkerImage("images/computers_amber.png");
    var pinImageBad = new google.maps.MarkerImage("images/computers_red.png");
    
	var marker,
    currentMarkerIndex = 0;
    function createMarker(index){
        if(index<locations.length)
        marker = new google.maps.Marker({
			map: mapElem,
			animation: google.maps.Animation.DROP,
			position: locations[index].latlng,
			title: locations[index].address.replace(/(&nbsp)/g," ") + " (" + locations[index].pcsavailable + ")",
			icon: pinImageWarning
		});
        if (locations[index].RoomBooked == "true") {
            marker.icon = pinImageBad;
            marker.title = locations[index].address.replace(/(&nbsp)/g," ") + " (room unavailable)";
        }
        else {
            if(locations[index].pcsavailable > 4)
                marker.icon = pinImageGood;
            if(locations[index].pcsavailable <= 2)
                marker.icon = pinImageBad;
            if(locations[index].pcsavailable > 2 && locations[index].pcsavailable <= 4 )
                marker.icon = pinImageWarning;
        }
        var descripDiv = "<div class='markerInfo'><span class='markerTitle'>" + locations[index].address.replace(/(&nbsp)/g," ") + "</span>";
        descripDiv = descripDiv + "<span class='markerPcNos'>PCs available: " + locations[index].pcsavailable + "</span>";
        descripDiv = descripDiv + "<span class='markerDistance'>Distance: " + locations[index].distance + "m. </span>";
        descripDiv = descripDiv + "</div>";
        
        addInfoWindow(mapElem, marker, descripDiv)
        
        oneMarkerAtTime();
    }
    
	createMarker(0);
    function oneMarkerAtTime()
    {
        google.maps.event.addListener(marker,"animation_changed",function()
        {
           if(marker.getAnimation()==null)
            {
                createMarker(currentMarkerIndex+=1);
            }
        });
        
    }
	
	$("#clusters-listview").kendoMobileListView({
		dataSource: kendo.data.DataSource.create({ data: locations}),
		template: $("#clusters-listview-template").html()
	});
    
}

function addInfoWindow(map, marker, message) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        }


