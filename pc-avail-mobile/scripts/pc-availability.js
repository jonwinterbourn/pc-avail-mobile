// JavaScript Document

// Wait for cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var mapElem,
cachedLocations = [];

// Cordova is ready
function onDeviceReady() {
    
    //getLocation();
    navigator.splashscreen.hide();
    
    getInitialClustersData();
    clustersData.init();
	clustersData.clusters.bind("change", writeIntoLocalStorage);
    
}

//function getLocation() {
//    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, { enableHighAccuracy: true });
//}



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

function getPosition(handler) {
	navigator.geolocation.getCurrentPosition(handler, onGeolocationError, { enableHighAccuracy: true });
}

function getLocations(position, handler) {
	$.getJSON("http://www.starbucks.com/api/location.ashx?&features=&lat=" + position.coords.latitude + "&long=" + position.coords.longitude + "&limit=10",
			  function(data) {
				  var locations = [];
				  $.each(data, function() {
					  locations.push(
						  {
						  address: this.WalkInAddressDisplayStrings[0] + ", " + this.WalkInAddressDisplayStrings[1], 
						  latlng: new google.maps.LatLng(this.WalkInAddress.Coordinates.Latitude, this.WalkInAddress.Coordinates.Longitude)
					  });                
				  });
				  handler(locations);
			  }).error(function(error) {
				  alert(error.message);
			  });
}

function clustersShow(e) {
	$("#clustersNavigate").kendoMobileButtonGroup({
		select: function() {
			if (this.selectedIndex == 0) {
				$("#sclusterswrap").hide();
				$("#mapwrap").show();
				google.maps.event.trigger(map, "resize");
			}
			else if (this.selectedIndex == 1) {
				$("#mapwrap").hide();
				$("#clusterswrap").show();
			}
		},
		index: 0
	});
    
    var iteration = function() {
		getPosition(function(position) {
			// Use Google API to get the location data for the current coordinates
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
			var myOptions = {
				zoom: 12,
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
        
			if (cachedLocations.length > 0) {
				setClustersViews(cachedLocations);
			}
			else {
            	
				getLocations(position, function(locations) {
					cachedLocations = locations;
					setClustersViews(locations);
				});
			}
		});
	};
	iteration();
    
}

function onGeolocationError(error) {
	alert(error.message);
}

function setClustersViews(locations) {
	var pinColor = "66CCFF";

     var pinImage = new google.maps.MarkerImage("../images/computers.png");
    
	var marker,
    currentMarkerIndex = 0;
    function createMarker(index){
        if(index<locations.length)
        marker = new google.maps.Marker({
			map: mapElem,
			animation: google.maps.Animation.DROP,
			position: locations[index].latlng,
			title: locations[index].address.replace(/(&nbsp)/g," "),
			icon: pinImage
		});
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


