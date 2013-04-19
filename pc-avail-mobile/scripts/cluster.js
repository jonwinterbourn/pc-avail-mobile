var initialClusterData = function() {
};

initialClusterData.prototype = function() {
	var initialClusters = [{
        "clusterId":1,
        "clusterName":"Orange Room",
        "numberOfPcs":95,
        "location":"Located on Ground Floor of the Main Library in Zone GD. ",
        "designatedUse":"Any"
    },{
        "clusterId":2,
        "clusterName":"Purple Room",
        "numberOfPcs":34,
        "location":"Located on Ground Floor of the Main Library in Zone GD. ",
        "designatedUse":"Any"
    },{
        "clusterId":3,
        "clusterName":"Green Room",
        "numberOfPcs":10,
        "location":"Located on Ground Floor of the Main Library in Zone GD. ",
        "designatedUse":"These PCs are for Printing Only"
    }],

	getInitialClustersData = function() {
		return JSON.stringify(initialClusters);
	};
    
	return {
		getInitialClustersData:getInitialClustersData,
	};
}();