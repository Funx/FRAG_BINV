var PieChart = {
	init: function(pieData, $scope) {
		var paper = Snap("#pieChart");
		var diameter = 400;
		var radius = diameter / 2;
		var center = {
			x: (diameter / 2)
			, y: (diameter / 2)
		};
		var numbers = [];
		var arc;
		var colorArr = ["#46764e", "#9eb353", "#FFB03B", "#B64926", "#8E2800"];
		var sectorAngleArr = [];
		var total = 0;
		var startAngle = endAngle = -90;
		var x1, x2, y1, y2 = 0;

		this.data = pieData;
		this.title = pieData.title;
		this.name = pieData.name;
		this.arcs = [];


		for (var i = 0; i < pieData.length; i++) {
			var sector = pieData[i];
			console.log($scope);
			numbers.push($scope.getValueOf(sector));
		}

		//CALCULATE THE TOTAL
		for (var k = 0; k < numbers.length; k++) {
			total += numbers[k];
		}
		//CALCULATE THE ANGLES THAT EACH SECTOR SWIPES AND STORE IN AN ARRAY
		for (var i = 0; i < numbers.length; i++) {
			var angle = Math.ceil(360 * numbers[i] / total);
			sectorAngleArr.push(angle);
		}


		for (var i = 0; i < sectorAngleArr.length; i++) {
			startAngle = endAngle;
			endAngle = startAngle + sectorAngleArr[i];

			x1 = parseInt(center.x + radius * Math.cos(Math.PI * startAngle / 180));
			y1 = parseInt(center.y + radius * Math.sin(Math.PI * startAngle / 180));

			x2 = parseInt(center.x + radius * Math.cos(Math.PI * endAngle / 180));
			y2 = parseInt(center.y + radius * Math.sin(Math.PI * endAngle / 180));

			var large_arc_flag = 0;
			if (sectorAngleArr[i] > 180) {
				large_arc_flag = 1;
			}
			var d = "M" + center.x + " " + center.y + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 " + large_arc_flag + " 1 " + x2 + " " + y2 + " z"; //1 means clockwise
			arc = paper.path(d);

			arc.data = this.data[i];
			var colorFill = this.data[i].color || colorArr[i];
			arc.attr("fill", colorFill);

			arc.hover(
											//hover in
																			function() {
																				var self = this;
																				$scope.$apply(function() {
																					$scope.notifyStart(self.data);
																				});
																			}
											//hover out
											, function() {
												var self = this;
												$scope.$apply(function() {
													$scope.notifyEnd(app.notification);
												});
											});


											this.arcs.push(arc);
										}
	}
};