//VIEWDISPLAY************************
var MapDisplay = function(){
	
	var allFarmsCenter;
	var allFarmsZoom;
	
	var farms;
	var sections;
	var fields;
	
	var optionItemHTML = '<span class="input_span"><input type=radio name="map_column_section_radio"><span class="label"></span></input></span><br/>';
	//INSTANTIATION CODE
	var map = new GMap2(document.getElementById("map_box_map"));
	map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 14);
	map.setUIToDefault();
	map.disableDoubleClickZoom();
	map.disableInfoWindow(); 
	map.disableDragging(); 
	map.disableGoogleBar();
	map.disableScrollWheelZoom();
	//END INSTANTIATION CODE
	
	var firstMarker;
	var secondMarker;
	
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
	
	
	this.pts = [];
	var markers = [];
	this.newFieldPoly;
	
	this.newFieldAcreage;
	
	this.getFields = function(){
		return fields;
	}
	this.getAcreage = function(){
		return totalAcreage;
	}
	
	this.getNewFieldText = function(){
		var length = this.newFieldPoly.getVertexCount();
		var polyXML = "<vertices>";
		for (var i=0; i< length; i++){
			polyXML += "<vertex lat='";
			polyXML += this.newFieldPoly.getVertex(i).lat();
			polyXML += "' lng='";
			polyXML += this.newFieldPoly.getVertex(i).lng();
			polyXML += "' />";
		}
		polyXML += "</vertices>";
		return polyXML;
	}
	
	
	this.renderPlantings = function(plantings){
		if (plantings[WHEAT].length>0){
			$("#planting").removeClass("hide");
			$("#planting_options").append("Wheat:<br/>");
			$("#planting_options").append("<input type='radio' name='application_option' value='all_wheat'>All Wheat Plantings</input><br/>")
			$.each(plantings[WHEAT], function(i){
				$("#planting_options").append("<input type='radio' name='application_option'>"+this.description+": "+this.seed+"</input><br/>")
			});
		}
	}
	
	
	this.setSections = function(pSections){
		sections = pSections;
	}
	this.setFarms = function(pFarms){
		farms = pFarms;
	}
	var selectedMarker;
	this.addFirstPegListener = function(func){
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
				for (var i=0; i<4; i++){
					mapDisplay.pts.push(latlng);
				}
				mapDisplay.newFieldPoly = new GPolygon(mapDisplay.pts,"#000000",1.5,1.0,"#eeeeee",0.4,{clickable:true});
				map.addOverlay(mapDisplay.newFieldPoly);
				func();
			}
		});
	}
	this.label;
	function updateLabel(){
		if(mapDisplay.label){map.removeOverlay(mapDisplay.label)};
		mapDisplay.newFieldAcreage = (Math.floor(100*mapDisplay.newFieldPoly.getArea()/4046.8252519)/100);
		mapDisplay.label = new ELabel(getLeft(mapDisplay.newFieldPoly), mapDisplay.newFieldAcreage+" Acres", "white");
		map.addOverlay(mapDisplay.label);
	}
	this.addSecondPegListener = function(func){
		
				
				
				GEvent.addListener(map, 'mousemove', function(ev){
						secondMarker.setPoint(ev);
						mapDisplay.pts = mapDisplay.getVerts();
						if(mapDisplay.newFieldPoly){map.removeOverlay(mapDisplay.newFieldPoly)};
						mapDisplay.newFieldPoly = new GPolygon(mapDisplay.pts,"#000000",1.5,1.0,"#eeeeee",0.4,{clickable:true});
						map.addOverlay(mapDisplay.newFieldPoly);
						
						updateLabel();
						
				});
				GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
						GEvent.clearListeners(map, 'click');
						GEvent.clearListeners(map, 'mousemove');
						map.removeOverlay(firstMarker);
						map.removeOverlay(secondMarker);
						
						for (var i=0; i<mapDisplay.pts.length-1; i++){
							var marker = new GMarker(mapDisplay.pts[i], {
									icon: icon,
									draggable: true
							});
							markers.push(marker);
							map.addOverlay(marker);
						}
						func();
				});
	}
	
	this.removePegs = function(){
		GEvent.clearListeners(map, 'drag');
		GEvent.clearListeners(map, 'click');
		for (var i = 0; i < markers.length; i++) {
			map.removeOverlay(markers[i]);
		}
	}
	
	this.addPegMoveListener = function(func) {
		
		for (var i = 0; i < markers.length; i++) {
			GEvent.addListener(markers[i], 'drag', function(ev){
				for (var j=0; j<markers.length; j++){
					mapDisplay.pts[j] = markers[j].getPoint();
				}
				mapDisplay.pts[markers.length]= mapDisplay.pts[0];
				
				map.removeOverlay(mapDisplay.newFieldPoly);
				mapDisplay.newFieldPoly = new GPolygon(mapDisplay.pts,"#000000",1.5,1.0,"#eeeeee",0.4,{clickable:true});
				map.addOverlay(mapDisplay.newFieldPoly);
				updateLabel();		
			});
			
		}
		
		GEvent.addListener(map, 'click', function(overlay){
			for (var i=0; i<markers.length; i++){
					if (overlay == markers[i]){
						selectedMarker = i;
						GEvent.clearListeners(map, 'drag');
						GEvent.clearListeners(map, 'click');
						disableMarkers();
						func();
					}
			}
		});

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
	this.addNewPegListener  = function(func){
			turnBlue(selectedMarker);
			/*
			 if(!bounds.containsLatLng(latLng)) {
        return false;
    }
			 */
			GEvent.addListener(map, 'click', function(overlay){
				for (var i=0; i<markers.length; i++){
						if (markers[i] == overlay) {
							if ((selectedMarker == 0 && i == markers.length - 1) ||
							(i == 0 && selectedMarker == markers.length - 1) ||
							(Math.abs(selectedMarker - i) == 1)) {
								var blueMarker = markers[selectedMarker];
								blueMarker = turnRed(blueMarker);
								markers[selectedMarker] = blueMarker;
								map.addOverlay(blueMarker);
								
								var newLatLng = midPoint(markers[i], markers[selectedMarker]);
								var newMarker = new GMarker(newLatLng, {
									icon: icon,
									draggable: true
								});
								map.addOverlay(newMarker);
								
								var newIndex;
								if (Math.abs(selectedMarker - i)!=1){
									newIndex = 0;
								}
								else {
									newIndex = Math.max(i, selectedMarker);
								}
								markers.splice(newIndex,0,newMarker)
								mapDisplay.newFieldPoly.insertVertex(newIndex, newLatLng);
								enableMarkers();
								func();
							}
						}
				}
			});
			
	}
	
	function turnRed(marker){	
				
				map.removeOverlay(marker);
				marker = new GMarker(marker.getPoint(), {
						icon: icon,
						draggable: true
							});
				return marker;
}
	
	
	
	function midPoint(point1, point2){

		var westPoint = Math.min(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));
		var eastPoint = Math.max(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));
		var southPoint = Math.min(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));
		var northPoint = Math.max(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));
		return new GLatLng(westPoint+(eastPoint-westPoint)/2, southPoint+(northPoint-southPoint)/2);
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

this.getVerts = function(){
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
	
	
	this.loadSectionOptions = function(){
		$("#previous").append("<option value='none'>Select from list</option>");
		for (i=0; i<sections.length; i++){
			$("#previous").append("<option value='"+i+"'>"+sections[i].number+"-"+sections[i].north+"N-"+sections[i].west+"W"+"</option>");
		}
		$("#previous").change(function(){
			var selection = $("#previous").attr("value");
			$("input[name=number]").attr("value", sections[selection].number);
			$("input[name=north]").attr("value", sections[selection].north);
			$("input[name=west]").attr("value", sections[selection].west);
		});		
	}
	this.loadFarmOptions = function(){
		$("#farm_select").append("<option value='none'>Select</option>");
		for (i=0; i<farms.length; i++){
			$("#farm_select").append("<option value='"+i+"'>"+farms[i]+"</option>");
		}
		$("#farm_select").change(function(){
			var selection = $("#farm_select").attr("value");
			$("input[name=farm_number_input]").attr("value", farms[selection]);
		});		
	}
	
	this.showSection = function(sectionDoc){
		sectionPoly = createPolygon($(sectionDoc).find("vertex"));
		map.addOverlay(sectionPoly);
		map.setMapType(G_SATELLITE_MAP);
		map.setCenter(getCenter(sectionPoly),14);
	}
	this.clearMap = function(){
		map.clearOverlays();
	}
	this.setMapToNormal = function(){
		map.setMapType(G_NORMAL_MAP);
	}
	this.renderFarms = function(pFarms){
		farms = pFarms;
		for (var i=0; i<farms.length; i++){
				$("#map_farm_options").append(optionItemHTML);
			}
			$("#map_farm_options").find(".input_span").each(function(){
				var index = $("#map_farm_options").find(".input_span").index(this);
				$(this).find("span[class=label]").text(farms[index]);
				$(this).find("input").attr("value", index);
				$(this).find("input").attr("name", "map_farm_radio");
			});
	}
	
	this.renderSections = function(pSections){
		sections = pSections;
		for (var i=0; i<sections.length; i++){
				$("#map_section_options").append(optionItemHTML);
			}
			$("#map_section_options").find(".input_span").each(function(){
				
				var index = $("#map_section_options").find(".input_span").index(this);
				$(this).find("span[class=label]").text(sections[index].number+"-"+sections[index].north+"N-"+sections[index].west+"W");
				$(this).find("input").attr("value", index);
				$(this).find("input").attr("name", "map_section_radio");
			});
	}
	this.renderWheatSeedInventory = function(items) {
		$.each(items, function(index){
			var displayItem = '<tr><td>'+this.name+'</td><td class="border_left">'+this.amount+' Bushels</td></tr>';
			$(displayItem).insertAfter("#wheat_tr");
		});
	}
	
	var center;
	this.renderFields = function(pFields){
		
		fields = pFields;
		this.showFields();
	}

	var selectedFarmIndex=null;
	var selectedSectionIndex=null;
	
	this.disableFarmOptionListener = function(){
		$("input[name=map_farm_radio]").unbind("click");
	}
	this.disableSectionOptionListener = function(){
		$("input[name=map_section_radio]").unbind("click");
	}
	
	this.enableFieldSelectionListener = function(func){
		GEvent.addListener(map, 'click', function(overlay){
			$.each(fields, function(i){
				if (this.polygon==overlay){
					func(i);
				}
			});
		});
	}
	
	
	this.disableFieldSelectionListeners = function(){
		GEvent.clearListeners(map, 'click');
	}
	
	this.getField = function(i){
		return fields[i];
	}
	
	this.highlightSelection = function(i){
		fields[i].polygon.color = "#ffffff";
		fields[i].polygon.redraw(true);
	}
	
	this.enableFarmOptionListener = function(){

		$("input[name=map_farm_radio]").click(function(){
			map.clearOverlays();
			$("#map_section_options").empty();
			var index = $(this).attr("value");
			selectedFarmIndex=index;
			if (index) {
				var farm = farms[index];
				fields = cache.getFields(farm);
				sections = cache.getSections();
				mapDisplay.renderFields(fields);
				mapDisplay.renderSections(sections);
			}
			else {
				selectedFarmIndex=null;
				fields = cache.getFields();
				mapDisplay.renderFields(fields);
				mapDisplay.renderSections();
			}
			mapDisplay.enableSectionOptionListener();
				//$("#appOptions0").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				//$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
		});
	}
	
	this.enableSectionOptionListener = function(){
		
		
		$("input[name=map_section_radio]").click(function(){
			map.clearOverlays();
			var index = $(this).attr("value");
			
			if (index=="all_sections"){
				selectedSectionIndex=null;
				if (selectedFarmIndex) {
					fields = cache.getFields(farms[selectedFarmIndex]);
				}
				else {
					fields = cache.getFields();
				}
				mapDisplay.renderFields(fields);
			}
			else {
				selectedSectionIndex=index;
				fields = cache.getFields(farms[selectedFarmIndex], sections[index].north, sections[index].west,  sections[index].number);
				mapDisplay.renderFields(fields);
			}
			
			

		});
		
		
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
		for (var i=0; i<fields.length; i++){
			try {
	
				totalAcreage += parseInt(fields[i].acreage);
				var polygon = fields[i].polygon;
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
				
				var label = new ELabel(getLeft(fields[i].polygon), fields[i].name, "label_style");
				label.pixelOffset = new GSize(6, 6);
				map.addOverlay(label);
				
				map.addOverlay(polygon);
				points1[0] = new GLatLng(furthestNorth, furthestWest);
				points1[1] = new GLatLng(furthestNorth, furthestEast);
				points1[2] = new GLatLng(furthestSouth, furthestEast);
				points1[3] = new GLatLng(furthestSouth, furthestWest);
				points1[4] = new GLatLng(furthestNorth, furthestWest);
			}
			catch (e){}

		}
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

}

function createPolygon(vertices, cropType, isHarvested){
	var pts = [];
	$(vertices).each(function(){
		pts.push(new GLatLng($(this).attr("lat"), $(this).attr("lng")));
	});
	
	
	var color = "#999999";

	if (cropType=="corn"){
			color = "#FFDA5B";
	}
	if (cropType=="soybean"){
		color = "yellow";
	}

	if (cropType=="wheat"){
		color = "lime";
	}
	if (isHarvested){
		color = "#F1C2C1";
	}
	var poly = new GPolygon(pts,"#000000",1.5,1.0,color,0.4,{clickable:true});
	return poly;
	
}
//END VIEWDISPLAY************************
