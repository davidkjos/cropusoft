


//GLOBAL VARIABLES
var cache;
var currentManager;
var mapDisplay;
//END GLOBAL VARIABLES


//BUTTON DISPLAY
var ButtonDisplay = function(){
	
	var buttonItemHTML = "<img class='button_item' src='buttons/plant.png' />";
	
	var buttons = [];
	
	/*
	 var buttons = new Array("buttons/jedit.png","buttons/plant.png",
							"buttons/jfertilize.png","buttons/spray.png",
							"buttons/jharvest.png","buttons/purchase.png",
							"buttons/sell.png","buttons/subsidize.png",
							"buttons/insure.png"
							);
	 */
	

	
	
	
	this.render = function(pButtons){
		buttons = pButtons;
		$("#button_box").empty();
		for (var i=0; i<buttons.length; i++){
			$("#button_box").append(buttonItemHTML);
		}
		$("#button_box").find(".button_item").each(function(){
			var index = $("#button_box").find(".button_item").index(this);
			$(this).attr("src", buttons[index].url);
			$(this).attr("id", buttons[index].url);
			$(this).click(function(){
				buttons[index].action();
			});
			
		});
		
		
	}
	
}
//END BUTON DISPLAY



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
		map.clearOverlays();
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
	
	
	
	this.showFields = function() {
		
		
		
		
		//#$
		var furthestWest = 1000;
		var furthestEast = -1000;
		var furthestNorth = -1000;
		var furthestSouth = 1000;
		var points1 = [];
		for (var i=0; i<fields.length; i++){
			try {
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
		if (width <  0.04){
			zoom=14;
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
//END VIEWDISPLAY************************

//DATA************************
var Cache = function(pEmail, func){
	
	//UNIVERSAL AJAX GET
	function get(url, func){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				data = textToDoc(data);	
				func(data);
			}
		});
	}
	
	//CONVERTER FROM TEXT TO XML DOCUMENT
	function textToDoc(dataText){
		var dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        dataDoc.async="false";
		dataDoc.loadXML(dataText);
		return dataDoc;
	}
	
	
	this.getFarms = function(){
		var rFarms = [];
		$(fieldDoc).find("farm").each(function(){
			rFarms.push($(this).attr("number"));
		});
		return rFarms;
	}
	
	var sections = [];;
	
	this.getFields = function(farm,north, west, number){

		var query="";
		if (farm){
			query="[farm="+farm+"]";
		}
		if (north){
			query+="[north="+north+"][west="+west+"][section="+number+"]";
		}
		sections = [];
		var rFields = [];
		$(fieldDoc).find("field"+query).each(function(){
			var field = new Field();
			field.north = $(this).attr("north");
			field.west = $(this).attr("west");
			field.section = $(this).attr("section");
			field.name = $(this).attr("name");
			field.polygon = createPolygon($(this).find("vertex"));
			rFields.push(field);
			
			//create the list of unique sections for navigation purposes
			if (!sectionsContain(sections,field.north, field.west, field.section)){
				var section = new Section();
				section.north = field.north;
				section.west = field.west;
				section.number = field.section;
				sections.push(section);
			}
			
		});
		return rFields;
	}
	
	
	this.getSections = function(){
		return sections;
	}
	
	this.getSection = function(number, north, west, func){
		get("/?action=getsection&number="+number+"&north="+north+"&west="+west, function(data){
			 func(data);
		});
			
		
	}
	this.update = function(func){
		$("#dialog_box").text("Please Wait..........");
		get("/?action=getuser&email=" + email, function(data){
			fieldDoc = data;
			func();
		});
	}

	//INSTANTIATION CODE
	var mapFilter;
	var sectionSector;
	$.ajaxSetup({ cache: false });
	this.codeFrags = new HTMLCodeFrags();
	$.ajax({
			url: "form.xml",
			type: 'GET',
			dataType: 'html',
			success: function(data){
				data = textToDoc(data);	
				cache.codeFrags.mapFilterForm = $(data).find("map-nav").text();
				cache.codeFrags.sectionSelectorForm = $(data).find("section-selection-form").text();
				cache.codeFrags.newFieldForm = $(data).find("new-field-form").text();
			}
		});
	var email = pEmail;
	var fieldDoc;
	$("#dialog_box").text("Please Wait..........");
	get("/?action=getuser&email=" + email, function(data){
		fieldDoc = data;
		func();
	});
	//END INSTANTIATE CODE
}
//END DATA************************

var HTMLCodeFrags = function(){
	this.mapFilterForm;
	this.sectionSelectorForm;
	this.newFieldForm;
}

//HOMEMANAGER***************************
var HomeManager = function() {
	
	var buttons = new Array("buttons/jedit.png","buttons/plant.png",
							"buttons/jfertilize.png","buttons/spray.png",
							"buttons/jharvest.png","buttons/purchase.png",
							"buttons/sell.png","buttons/subsidize.png",
							"buttons/insure.png"
							);
	var farms;
	var fields;
	var sections;
	
	function cleanup(){
		
	}
	
	
	this.disable = function(){
		mapDisplay.disableFarmOptionListener();
		mapDisplay.disableSectionOptionListener();
	}
	
	this.run = function(){

		$("#dialog_box").text("Welcome to Cropusoft!  Please Select an operation.");
		var buttons = [];
		var button = new Button();
		button.name="edit_map";
		button.url="images/map_farm_button1.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new EditMapManager();
			currentManager.run();
		}
		buttons.push(button);
		buttonDisplay.render(buttons);
		$("#window_under_map").html(cache.codeFrags.mapFilterForm);
		
		
		farms = cache.getFarms();
		mapDisplay.renderFarms(farms);
		fields = cache.getFields();
		mapDisplay.renderFields(fields);
		sections = cache.getSections();
		mapDisplay.renderSections(sections);
		
		mapDisplay.enableFarmOptionListener();
		mapDisplay.enableSectionOptionListener();
	}
}
//END HOMEMANAGER***************************

//EDITMAPMANAGER
var EditMapManager = function(){
	
	
	var buttons = [];
	
	var cancelButton = new Button();
		cancelButton.name="cancel_edit_map";
		cancelButton.url="images/cancel_button1.png";
		cancelButton.action = function(){
			alert("cancel");
		}
	var addButton = new Button();
		addButton.name="add_field";
		addButton.url="images/add_button1.png";
		addButton.action = function(){
			addAction();
		}

	this.addFirstPegAction = function(){
		$("#window_under_map").text("Please click the map on a corner of the new field.");
		mapDisplay.addFirstPegListener(function(){
			currentManager.addSecondPegAction();
		});
	}
	
	this.addSecondPegAction = function(){
		$("#window_under_map").text("Please click the opposing corner of the new field");
		mapDisplay.addSecondPegListener(function(){
			currentManager.addNewFieldVerticesAction();
		});
	}
	
	this.addNewFieldVerticesAction = function(){
		$("#window_under_map").html("Move pegs Around, and click adjecent pegs to add a new peg, delete peg by clicking it twice. <img src='buttons/jedit.png' />");
		
		//listen for field edits....
		mapDisplay.addPegMoveListener(function(){
			currentManager.addNewPegAction();
		});
		//listen for submit
		$("#window_under_map img").click(function(){
			mapDisplay.removePegs();
			currentManager.addFieldFormAction();
		});
		
	}
	//here
	this.addFieldFormAction = function(){
		$("#window_under_map").html(cache.codeFrags.newFieldForm);
		mapDisplay.loadFarmOptions();
		$("#window_under_map img").click(function(){
			var newField = new Field();
			newField.name = $("#new_field_form").find("input[name=field_name_input]").attr("value");
			newField.farm = $("#new_field_form").find("input[name=farm_number_input]").attr("value");
			newField.north = selectedSectionObj.north;
			newField.west = selectedSectionObj.west;
			newField.section = selectedSectionObj.number;
			newField.polygon = mapDisplay.getNewFieldText();
			newField.acreage = mapDisplay.newFieldAcreage;
			newField.cornYield = $("#new_field_form").find("input[name=corn_avg_input]").attr("value");
			newField.wheatYield = $("#new_field_form").find("input[name=wheat_avg_input]").attr("value");
			newField.soybeanYield = $("#new_field_form").find("input[name=soybean_avg_input]").attr("value");
			newField.save(function(){
				cache.update(function(){
					mapDisplay.clearMap();
					mapDisplay.setMapToNormal();
					currentManager = new HomeManager();
					currentManager.run();
				});
			});
		});
	}
	
	/*
	 * 		<div id="new_field_form" class="import_form">
			Field Name: <input name="field_name_input" type="text" maxlength="30" ></input> 
			<br/>Farm Number: <input class="shorter_input" name="farm_number_input" type="text" maxlength=4 ><select id="farm_select" class="short_input" name="previous_farms"></select></input>
			<br/>5-Year Average Yield  (Leave blank if unapplicable, can be changed later): 
			<br/>Corn: <input class="shorter_input" name="corn_avg_input" type="text"></input> Soybeans:<input class="shorter_input" name="corn_avg_input" type="text"></input> Wheat:<input class="shorter_input" name="corn_avg_input" type="text"></input>
			<br/><img src="buttons/jedit.png" />

	var Field = function() {
	this.name;
	this.north;
	this.west;
	this.section;
	this.polygon;
	this.acreage;
	this.cornYield;
	this.wheatYield;
	this.soybeanYield;
}
	 */
	
	this.addNewPegAction = function(){
		mapDisplay.addNewPegListener(function(){
			currentManager.addNewFieldVerticesAction();
		});
	}
	
	
	function addAction(){
		buttons = [];
		buttons.push(cancelButton);
		buttonDisplay.render(buttons);
		
		$("#window_under_map").html(cache.codeFrags.sectionSelectorForm);
		$("#dialog_box").text("Please enter the section where you would like to add a field, or to go back home, click cancel.");
	
		mapDisplay.loadSectionOptions();
	
				//listeners
		$("#section_selection_form img").click(function(){
			

			var numberInput = $("#section_selection_form").find("input[name=number]").attr("value");
			var northInput = $("#section_selection_form").find("input[name=north]").attr("value");
			var westInput = $("#section_selection_form").find("input[name=west]").attr("value");
			
			selectedSectionObj = new Section();
			selectedSectionObj.north = northInput;
			selectedSectionObj.west = westInput;
			selectedSectionObj.number = numberInput;
			
			cache.getSection(numberInput, northInput, westInput, function(data){
				mapDisplay.showSection(data);
				currentManager.addFirstPegAction();
			});
		});
	}
	
	var selectedSectionObj;
	
	this.run = function(){
		
		//$("#accounting_column *").addClass("disable");
		//$("#map_column *").addClass("disable");
		//$("#calendar_column *").addClass("disable");
		
		buttons = [];
		buttons.push(cancelButton);
		buttons.push(addButton);
		buttonDisplay.render(buttons);
	
		$("#dialog_box").text("Please select how you would like to alter your map ot to go back, click cancel.");
		

	}
}
//END EDITMAPMANAGER

//SETUP*************************
function setup(){

	//round all corners
	Rounded('default_box', 4, 4);

	//initialize map
	mapDisplay = new MapDisplay();
	buttonDisplay = new ButtonDisplay();
	//initialize cache and then transfer to home manager
	
	cache = new Cache("davidkjos@yahoo.com", function(){
		currentManager = new HomeManager();
		currentManager.run();
	});
	
	
}
//END SETUP***********************

//ENTITIES*************************

var Farm = function(){
	this.number;
	this.zoom;
	this.center;
}

var Field = function() {
	this.name;
	this.farm;
	this.north;
	this.west;
	this.section;
	this.polygon;
	this.acreage;
	this.cornYield;
	this.wheatYield;
	this.soybeanYield;
	this.save = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savefield",
					name: this.name,
					farm: this.farm,
					north: this.north,
					west: this.west,
					section: this.section,
					polygon: this.polygon,
					acreage: this.acreage,
					cornyield: this.cornYield,
					wheatyield: this.wheatYield,
					soybeanyield: this.soybeanYield
				},
				error: function(xhr){
					alert("failure");
				},
				success: function(){
					func();
				}
			});

	}
}

var Section = function() {
	this.township;
	this.north;
	this.west;
	this.number;
	this.center;
}

var Button = function(){
	this.name;
	this.url;
	this.action;
}


//END ENTITIES***********************




function loadEvent(){
	//document.getElementById("jan").style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
	var height = $("#calendar_column").height();
	//$("#accounting_column_inner").css("height", height +"px");
	//$("#map_column").css("height", height +"px");
	//$("#accounting_column").css("height", height +"px");
	var mapSectionOptions  = new Array("All Sections","W23-N143-12","W143-N143-6","W22-N151-2","W122-N143-21"); 
	var mapFarmOptions  = new Array("All Farms","296","1281","904","512");
	var mapCropOptions  = new Array("All Crops","Corn","Soybeans","Wheat"); 
	 
	$.get('form.xml', function(data){

			var selectedFarm = 0;
			var selectedSection = 0;
			var selectedCrop = 0;

			var dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        	dataDoc.async="false";
			dataDoc.loadXML(data);
			var val = $(dataDoc).find("map-box-options").text();
			
			
			for (var i=0; i<mapFarmOptions.length; i++){
				$("#map_farm_options").append(val);
			}
			$("#map_farm_options").find(".input_span").each(function(){
				var index = $("#map_farm_options").find(".input_span").index(this);
				$(this).find("span[class=label]").text(mapFarmOptions[index]);
				$(this).find("input").attr("value", index);
				$(this).find("input").attr("name", "map_farm_radio");

			});
			$("input[name=map_farm_radio]").click(function(){
					selectedFarm = $(this).attr("value");
			});
			
			
			
			for (var i=0; i<mapCropOptions.length; i++){
				$("#map_crop_options").append(val);
			}
			$("#map_crop_options").find(".input_span").each(function(){
				var index = $("#map_crop_options").find(".input_span").index(this);
				$(this).find("span[class=label]").text(mapCropOptions[index]);
				$(this).find("input").attr("value", index);
				$(this).find("input").attr("name", "map_crop_radio");

			});
			$("input[name=map_crop_radio]").click(function(){
					selectedCrop = $(this).attr("value");
			});
			
			
			for (var i=0; i<mapSectionOptions.length; i++){
				$("#map_section_options").append(val);
			}
			$("#map_section_options").find(".input_span").each(function(){
				var index = $("#map_section_options").find(".input_span").index(this);
				$(this).find("span[class=label]").text(mapSectionOptions[index]);
				$(this).find("input").attr("value", index);
				$(this).find("input").attr("name", "map_section_radio");

			});
			$("input[name=map_section_radio]").click(function(){
					selectedSection = $(this).attr("value");
			});
		});
	
	
	Rounded('default_box', 4, 4);
	var map = new GMap2(document.getElementById("google_map"));
	map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 14);
	map.setUIToDefault();
}


//UTILITIES
function sectionsContain(sections, north, west, number){


			var rCondition = false;
			for (var i = 0; i < sections.length; i++) {
				
				if (sections[i].north == north && sections[i].west == west && sections[i].number == number) {
					rCondition = true;
					break;
				}
			}

			return rCondition;


	}
	
function createPolygon(vertices, cropType){

	var pts = [];
	$(vertices).each(function(){
		pts.push(new GLatLng($(this).attr("lat"), $(this).attr("lng")));
	});
	var poly = new GPolygon(pts,"#000000",1.5,1.0,"#999999",0.4,{clickable:true});
	return poly;
	
}	

function getLeft(polygon){
	var eastLng = polygon.getBounds().getNorthEast().lng();
	var westLng = polygon.getBounds().getSouthWest().lng();		
	var northLat = polygon.getBounds().getNorthEast().lat();
	var southLat = polygon.getBounds().getSouthWest().lat();
	var lat = southLat+(northLat-southLat)/2;
	var lng = westLng;
	return new GLatLng(lat, lng);
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
//END UTLITIES


