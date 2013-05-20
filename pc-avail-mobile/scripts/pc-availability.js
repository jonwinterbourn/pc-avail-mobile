// JavaScript Document

// Wait for cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var mapElem,
cachedLocations = [];

// Cordova is ready
function onDeviceReady() {
    
    //getLocation();
    navigator.splashscreen.hide();
    
    getInitialBuildingsData();
    buildingsData.init();
	buildingsData.buildings.bind("change", writeIntoLocalStorage);
     
}


//======================= News etc ==========================================//

var newsData = [
	{ title: "Main Library 3rd floor closed", description: "3rd floor of Main Library closed due to an infestation of pumpkin-flavoured cupcakes.", url: "images/holiday.png" }
    
];

function announcementListViewTemplatesInit() {
	$("#announcements-listview").kendoMobileListView({
		dataSource: kendo.data.DataSource.create({ data: newsData }),
		template: $("#announcement-listview-template").html()
	});
}

//======================= Buildings/Clusters Operations ===============================//

function getInitialBuildingsData(){
    if(window.localStorage.getItem("buildings")===null)
    {
        var buildingData = new initialBuildingData(),
        initialBuildings = buildingData.getInitialBuildingsData();
        localStorage.setItem("buildings",initialBuildings);
    }
}

var buildingsData = kendo.observable({
	init:function() {
		var i;
		this._buildingIds = {};
        var buildings=[];
		if (window.localStorage.getItem("buildings") !== null) {
            buildings = JSON.parse(window.localStorage.getItem("buildings"));
		}
        //alert(buildings);
        //alert(buildings.length);
		for (i = 0; i < buildings.length; i+=1) {
			this._buildingIds[buildings[i].buildingId] = i;
            //alert(buildings[i].buildingId)
		}
		buildingsData.set("buildings", buildings);
	},
	buildingIds: function(value) {
		if (value) {
			this._buildingIds = value;
		}
		else {
			return this._buildingIds;
		}
	},
	buildings : []
});

function writeIntoLocalStorage(e) {
	var dataToWrite = JSON.stringify(buildingsData.buildings);
	window.localStorage.setItem("buildings", dataToWrite);
}

function listViewBuildingsInit() {
   
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

function getBuildingLocations(position, handler) {
    $.getJSON("http://www.birminghamdev1.bham.ac.uk/web_services/Clusters.svc/nearestpc?lat=" + position.coords.latitude + "&long=" + position.coords.longitude,
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
        
			getBuildingLocations(position, function(locations) {
                    
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
			//var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
			getBuildingLocations(position, function(locations) {
                    
				cachedLocations = locations;
				setClustersViews(locations);
			});
			
		});
	};
	iteration();
    
}

function onGeolocationError(error) {
	alert(error.message);
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
        if (locations[index].roombooked == "true") {
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


