// JavaScript Document

// Wait for cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var mapElem,
cachedLocations = [];

// Cordova is ready
function onDeviceReady() {
    
    getLocation();
    navigator.splashscreen.hide();
    
    getInitialClustersData();
    clustersData.init();
	clustersData.clusters.bind("change", writeIntoLocalStorage);
    
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, { enableHighAccuracy: true });
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

//======================= Clusters Operations ===============================//

function getInitialClustersData(){
    if(window.localStorage.getItem("clusters")===null)
    {
        var clusterData = new initialClusterData(),
        initialClusters = clusterData.getInitialClustersData();
        localStorage.setItem("clusters",initialClusters);
    }
}

var clustersData = kendo.observable({
	init:function() {
		var i;
		this._clusterIds = {};
        var clusters=[];
		if (window.localStorage.getItem("clusters") !== null) {
            clusters = JSON.parse(window.localStorage.getItem("clusters"));
		}
        //alert(clusters);
        //alert(clusters.length);
		for (i = 0; i < clusters.length; i+=1) {
			this._clusterIds[clusters[i].clusterId] = i;
            //alert(clusters[i].clusterId)
		}
		clustersData.set("clusters", clusters);
	},
	clusterIds: function(value) {
		if (value) {
			this._clusterIds = value;
		}
		else {
			return this._clusterIds;
		}
	},
	clusters : []
});

function writeIntoLocalStorage(e) {
	var dataToWrite = JSON.stringify(clustersData.clusters);
	window.localStorage.setItem("clusters", dataToWrite);
}

function listViewClustersInit() {
   
}



//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) {
    // Use Google API to get the location data for the current coordinates
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({ "latLng": latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if ((results.length > 1) && results[1]) {
                $("#myLocation").html(results[1].formatted_address);
            }
        }
    });

    // Use Google API to get a map of the current location
    // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
    var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
    var mapImg = '<img src="' + googleApis_map_Url + '" />';
    $("#map_canvas").html(mapImg);
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    $("#myLocation").html("<span class='err'>" + error.message + "</span>");
}



