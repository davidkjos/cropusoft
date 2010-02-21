



var MapDisplay = function(pDivId){

	var icon = new GIcon();
	icon.image = "http://labs.google.com/ridefinder/images/mm_20_red.png";
	icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
	icon.iconSize = new GSize(12, 20);
	icon.shadowSize = new GSize(22, 20);
	icon.iconAnchor = new GPoint(6, 20);
	icon2 = new GIcon();
	icon2.image = "http://labs.google.com/ridefinder/images/mm_20_blue.png";
	icon2.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
	icon2.iconSize = new GSize(12, 20);
	icon2.shadowSize = new GSize(22, 20);
	icon2.iconAnchor = new GPoint(6, 20);
	
	
	
	//*****************************
	var divId = pDivId;
	var displayedFields;
	var selectedFields;
	var newField;
	var firstPegVertex;
	var secondPegVertex;
	
	if (!pDivId) {
		divId = "map_box";
	}
	var map = new GMap2(document.getElementById(divId));
	map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 15);
	map.setUIToDefault();
	map.disableDoubleClickZoom();
	map.disableInfoWindow();
	map.disableDragging();
	map.disableGoogleBar();
	map.disableScrollWheelZoom();
	
	var sectionPoly;
	this.displaySection = function(section){
		sectionPoly = createPolygon(section.vertices);
		var centerLatLng = getCenter(sectionPoly);
		map.setCenter(centerLatLng, 15);
		map.addOverlay(sectionPoly);
	}
	this.satelliteMode = function(){
		map.setMapType(G_SATELLITE_MAP);
	}
	this.mapMode = function(){
		map.setMapType(G_NORMAL_MAP);
	}
	
	var firstMarker;
	var secondMarker;
	var markers;
	var newFieldPolygon;
	var newFieldLabel;
	var blueIndex;
	
	this.removePolygons = function(){
		map.clearOverlays();
	}
	
	
	this.getNewField = function(){
		var field = new FieldEntity();
		for (var i=0; i<newFieldPolygon.getVertexCount(); i++){
			var vertex = new Vertex();
			vertex.lat = newFieldPolygon.getVertex(i).lat();
			vertex.lng = newFieldPolygon.getVertex(i).lng();
			field.vertices.push(vertex);
		}
		return field;
	}
	
	this.enableAddPegsListener = function(func){
		GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
		
			if (overlay == sectionPoly) {
			
				firstMarker = new GMarker(latlng, {
					icon: icon,
					draggable: false
				});
				secondMarker = new GMarker(latlng, {
					icon: icon,
					draggable: true
				});
				map.addOverlay(firstMarker);
				map.addOverlay(secondMarker);
				
				//create new poly
				var newPolyPts = [];
				for (var i = 0; i < 4; i++) {
					newPolyPts.push(latlng);
				}
				newFieldPolygon = new GPolygon(newPolyPts, "#000000", 1.5, 1.0, "#eeeeee", 0.4, {
					clickable: true
				});
				map.addOverlay(newFieldPolygon);
				
				func();
			}
		});
	}
	this.disableListeners = function(){
		GEvent.clearListeners(map, 'click');
		GEvent.clearListeners(map, 'drag');
	}
	this.removeMarkers = function(){
		disableMarkers();
		$.each(markers, function(){
			map.removeOverlay(this);
		});
	}
	
	this.enableMovePegListener = function(func){
		$("#text_box").text("Now move the cursor to another edge of the new field.");
		GEvent.addListener(map, 'mousemove', function(ev){
			secondMarker.setPoint(ev);
			var newPolyPts = getVerts();
			if (newFieldPolygon) {
				map.removeOverlay(newFieldPolygon)
			};
			newFieldPolygon = new GPolygon(newPolyPts, "#000000", 1.5, 1.0, "#eeeeee", 0.4, {
				clickable: true
			});
			map.addOverlay(newFieldPolygon);
			updateLabel();
		});
		
		//this disables the moving of a peg and adds pegs to all corners
		GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
			
			GEvent.clearListeners(map, 'click');
			GEvent.clearListeners(map, 'mousemove');
			map.removeOverlay(firstMarker);
			map.removeOverlay(secondMarker);
			
			
			mapDisplay.initiateMarkers(func);
		});
	}
	
	this.initiateMarkers = function(func){
		markers = [];
		markers.length = 0;
		for (var i = 0; i < newFieldPolygon.getVertexCount() - 1; i++) {
				var marker = new GMarker(newFieldPolygon.getVertex(i), {
					icon: icon,
					draggable: true
				});
				markers.push(marker);
				map.addOverlay(marker);
			}
		mapDisplay.enableMovePegsListener(func);
	}
	
	this.enableMovePegsListener = function(func){
		
		
		$("#text_box").text("Drag any peg to a more accurate location or click existing peg in order to add a new peg.");
		GEvent.clearListeners(map, 'drag');
		GEvent.clearListeners(map, 'click');
		for (var i = 0; i < markers.length; i++) {
				GEvent.addListener(markers[i], 'drag', function(ev){
					var pts = [];
					for (var j = 0; j < markers.length; j++) {
						pts.push(markers[j].getPoint());
					}
					pts.push(markers[0].getPoint());
					
					map.removeOverlay(newFieldPolygon);
					newFieldPolygon = new GPolygon(pts, "#000000", 1.5, 1.0, "#eeeeee", 0.4, {
						clickable: true
					});
					map.addOverlay(newFieldPolygon);
					updateLabel();
				});
		}
		
		GEvent.addListener(map, 'click', function(overlay){
			for (var i=0; i<markers.length; i++){
					if (overlay == markers[i]){
						selectedMarker = i;
						
						disableMarkers();
						turnBlue(i);
						blueIndex = i;
						addNewPegListener();
					}
			}
		});
		func();
	}
	
	function addNewPegListener(func){
			$("#text_box").text("Click one of the two pegs joined to the blue peg.");
			GEvent.clearListeners(map, 'drag');
			GEvent.clearListeners(map, 'click');
			GEvent.addListener(map, 'click', function(overlay){
				for (var i=0; i<markers.length; i++){
						if (markers[i] == overlay) {
							
							if ((blueIndex == 0 && i == markers.length - 1) ||
							(i == 0 && blueIndex == markers.length - 1) ||
							(Math.abs(blueIndex - i) == 1)) {
								var blueMarker = markers[selectedMarker];
								turnRed();
								
								var newLatLng = midPoint(markers[i], markers[blueIndex]);
								var newMarker = new GMarker(newLatLng, {
									icon: icon,
									draggable: true
								});
								map.addOverlay(newMarker);
								
								var newIndex;
								if (Math.abs(blueIndex - i)!=1){
									newIndex = 0;
								}
								else {
									newIndex = Math.max(i, blueIndex);
								}
								markers.splice(newIndex,0,newMarker);
								map.removeOverlay(newFieldPolygon);
								newFieldPolygon.insertVertex(newIndex, newLatLng);
								map.addOverlay(newFieldPolygon);
								enableMarkers();
								
								mapDisplay.enableMovePegsListener();
							}
						}
				}
			});
			
	}
	
	
	
	
	function turnBlue(index){	
				var point = markers[index].getPoint();
				map.removeOverlay(markers[index]);
				markers[index] = new GMarker(point, {
						icon: icon2,
						draggable: false
							});
				map.addOverlay(markers[index]);
	}
	
	function turnRed(){	
				
				map.removeOverlay(markers[blueIndex]);
				markers[blueIndex] = new GMarker(markers[blueIndex].getPoint(), {
						icon: icon,
						draggable: true
							});
				map.addOverlay(markers[blueIndex]);
	}
	
	
	function disableMarkers(){
		for (var i = 0; i < markers.length; i++) {
			markers[i].disableDragging();
		}
	}
	function enableMarkers(){
		for (var i=0; i<markers.length; i++){
			markers[i].enableDragging();
		}
	}
	function updateLabel(){
		if(newFieldLabel){map.removeOverlay(newFieldLabel)};
		var acreage = (Math.floor(100*newFieldPolygon.getArea()/4046.8252519)/100);
		newFieldLabel = new ELabel(getLeft(newFieldPolygon), acreage+" Acres", "white");
		map.addOverlay(newFieldLabel);
	}
	
	function getVerts(){
		var west = Math.min(firstMarker.getPoint().lng(), secondMarker.getPoint().lng());
		var east = Math.max(firstMarker.getPoint().lng(), secondMarker.getPoint().lng());
		var north = Math.max(firstMarker.getPoint().lat(), secondMarker.getPoint().lat());
		var south = Math.min(firstMarker.getPoint().lat(), secondMarker.getPoint().lat());
		
		var rPoints= [];
		rPoints.push(new GLatLng(north, west));
		rPoints.push(new GLatLng(north, east));
		rPoints.push(new GLatLng(south, east));
		rPoints.push(new GLatLng(south, west));
		rPoints.push(new GLatLng(north, west));
	
		return rPoints;
	}
	
	function midPoint(point1, point2){

		var westPoint = Math.min(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));
		var eastPoint = Math.max(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));
		var southPoint = Math.min(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));
		var northPoint = Math.max(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));
		return new GLatLng(westPoint+(eastPoint-westPoint)/2, southPoint+(northPoint-southPoint)/2);
	}
	
	
	this.moveToSection = function(section){
		
	}

	
	this.getTotalAcreage = function(){
		
	}
	this.getSelectedAcreage = function(){
		
	}
	this.getNewFieldAcreage = function(){
		
	}
	this.getNewFieldVertices = function(){
		
	}
	
	
	
var totalAcreage = 0;	
	this.getTotalAcreage = function(){
		return totalAcreage;
	}
	
	
	
	
	this.showFields = function(pFields, isSection) {
		fields = pFields;
		totalAcreage = 0;
		map.clearOverlays();
		//#$
		var furthestWest = 1000;
		var furthestEast = -1000;
		var furthestNorth = -1000;
		var furthestSouth = 1000;
		var points1 = [];
		$.each(fields, function(){
			
				totalAcreage += parseInt(this.acreage);
				
				var polygon = createPolygon(this);
				var eastLng = polygon.getBounds().getNorthEast().lng();
				
				if (eastLng > furthestEast) {
					furthestEast = eastLng;
				}
				
				var westLng = polygon.getBounds().getSouthWest().lng();
				if (westLng < furthestWest) {
					furthestWest = westLng;
				}
				
				var northLat = polygon.getBounds().getNorthEast().lat();
				if (northLat > furthestNorth) {
					furthestNorth = northLat;
				}
				
				
				var southLat = polygon.getBounds().getSouthWest().lat();
				
				if (southLat < furthestSouth) {
					furthestSouth = southLat;
				}
				
				var label = new ELabel(getLeft(polygon), this.name, "label_style");
				label.pixelOffset = new GSize(6, 6);
				map.addOverlay(label);
				
				map.addOverlay(polygon);
				points1[0] = new GLatLng(furthestNorth, furthestWest);
				points1[1] = new GLatLng(furthestNorth, furthestEast);
				points1[2] = new GLatLng(furthestSouth, furthestEast);
				points1[3] = new GLatLng(furthestSouth, furthestWest);
				points1[4] = new GLatLng(furthestNorth, furthestWest);
			
			

		});
		var width = Math.max(furthestNorth-furthestSouth, furthestEast-furthestWest);

		var zoom;
		if (isSection){
			zoom=14;
		}
		else if (width <  0.04){
			zoom=13;
		}
		else if (width < 0.09){
			zoom=12;
		}


		else if (width < 0.15){

			zoom=11;

		}
		else {
			zoom=9;
		}
		
		var poly = new GPolygon(points1,"#000000",1.5,1.0,"#000000",0.2,{clickable:true});
		map.setCenter(getCenter(poly),zoom);
		
		
	}


	
	//enable user to selected multiple fields
	this.enableFieldSelectionListener = function(){
		
	}
	
	//disable user's ability to select fields
	this.disableFieldSelectionListener = function(){
		
	}
	
	this.clearSelectedFields = function(){
		
	}
	this.clearAddField = function(){
		
	}
	
	//allow user to place a peg indicating the corner of a new field
	this.enableFirstPegAddListener = function(){
		
	}
	
	//disable user's ability to add a peg indicating first field peg
	this.disableFirstPegAddListener = function(){
		
	}
	
	//allow user to add a second new field peg
	this.enableSecondPegAddListener = function(){
		
	}
	
	//disable user's ability to add a second peg for a new field
	this.disableSecondPegAddListener = function(){
		
	}
	
	this.enablePegDragListener = function(){
		
	}
	this.disablePegDragListener = function(){
		
	}
	
	//for turning peg blue and setting up for new peg
	this.enablePegSelectListener = function(){
		
	}
	//called when peg is turned blue
	this.disablePegSelectListener = function(){
		
	}
	//called when new peg is added
	this.enableNewPegListener = function(){
		
	}
	this.disableNewPegListener = function(){
		
	}
	
	function getCenter(polygon){
	
		try {
			var eastLng = polygon.getBounds().getNorthEast().lng();
			var westLng = polygon.getBounds().getSouthWest().lng();
			var northLat = polygon.getBounds().getNorthEast().lat();
			var southLat = polygon.getBounds().getSouthWest().lat();
			var lat = southLat + (northLat - southLat) / 2;
			var lng = westLng + (eastLng - westLng) / 2;
			return new GLatLng(lat, lng);
		}
		catch (e){
			return new GLatLng(0, 0);
		}
	}	
	
	function createPolygon(vertices){
		var polygonPts = [];
		$.each(vertices, function(i){
			polygonPts.push(new GLatLng(this.lat, this.lng));
		});
		var polygon = new GPolygon(polygonPts,"#000000",1.5,1.0,"#FFDA5B",0.4,{clickable:true});
		return polygon;
	}
	
	function getLeft(polygon){
		var eastLng = polygon.getBounds().getNorthEast().lng();
		var westLng = polygon.getBounds().getSouthWest().lng();		
		var northLat = polygon.getBounds().getNorthEast().lat();
		var southLat = polygon.getBounds().getSouthWest().lat();
		var lat = southLat+(northLat-southLat)/2.5;
		var lng = westLng + (eastLng - westLng) / 2.9;
		return new GLatLng(lat, lng);
	}
}
