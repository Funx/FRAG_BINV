var MapChart = {
	init: function(mapData, $scope) {
		var container = $("#mapChart");
		var paper = Snap("#map-background");
		var map = Snap.load("img/map.svg", function(map) {
			paper.append(map);
		});
		
		//this.data = mapData.data;
		this.title = mapData.title;
		this.name = mapData.name;
		
		this.circles = paper.select("circle.area");
		
	}
};