

//**********************************************************************
//VARIABLES
var fieldNames = [];
var fieldAcreages = [];
var cropTypes = [];
var acreages = [];
var globalI =0;
var map;
var townshipI=0;
var townshipPolys = [];
var sectionPolys = [];
var center;
var firstVertex=-1;
var secondVertex=-1;
var countiesXml;
var selectedTownshipIndex;
var selectedTownship;
var selectedSectionIndex;
var selectedSection;
var selectedSectionNumber;
var townshipVerts = [];
var townshipNames = [];
var townshipI=0;
var icon;
var icon2;
var marker=[];
var point=[];
var poly;
var line=null;
var xmlDoc;
var saveAtts = "";
var countyAtts = "";



	icon = new GIcon();
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

function mapCounty(str){
	
}

function hide(str){
	try {
		$("#" + str).css("display", "none");
	}
	catch(e){
	
	}
}
function show(str){
		$("#" + str).css("display", "block");
}

function write(str1, str2){
	$("#"+str1).text(str2);
}
function writeHTML(str1, str2){
	$("#"+str1).html(str2);
}

//VARIABLES
//**********************************************************************
//**********************************************************************
//MAP
function createPolygon(vertices, color){
	
	if (!color){
		color = "lime";
	}
	var length = $(vertices).find("vertex").length;


	var pts = [];
	for (var i = 0; i < length; i++) {
		pts[i] = new GLatLng($(vertices).find("vertex:nth(" + i + ")").attr("lat"), $(vertices).find("vertex:nth(" + i + ")").attr("lng"));
	}	
	var poly = new GPolygon(pts,"#000000",1.5,1.0,color,0.2,{clickable:true});
	//acreages[globalI]=poly.getArea()/4046.8252519;
	return poly;
}
function getCenter(polygon){
	var eastLng = polygon.getBounds().getNorthEast().lng();
	var westLng = polygon.getBounds().getSouthWest().lng();		
	var northLat = polygon.getBounds().getNorthEast().lat();
	var southLat = polygon.getBounds().getSouthWest().lat();
	var lat = southLat+(northLat-southLat)/2;
	var lng = westLng+(eastLng-westLng)/2;
	return new GLatLng(lat, lng);
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


function addMap(){
	map = new GMap2(document.getElementById("map"));
	map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 15);
	map.setUIToDefault();
}
//MAP
//**********************************************************************
//**********************************************************************
//UI

function beginWait(){
	$("#please_wait").css("display", "block");
}
function endWait(){
	$("#please_wait").css("display", "none");
}
//UI
//**********************************************************************
//**********************************************************************
//EVENTS
var sectionPolys = [];
var sectionNumbers = [];
var labels = [];
function get(method, parameter, callback){
	$.ajax({
		url: '/?action='+method+'&parameter='+parameter,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			var doc = new ActiveXObject("Microsoft.XMLDOM")
        	doc.async="false";

				doc.loadXML(data);
				var length = $(doc).find("section").length;
				for (var i=0; i<length; i++){
					var poly = createPolygon($(doc).find("section:nth("+i+")"));
					var number = $(doc).find("section:nth("+i+")").attr("number");
					map.addOverlay(poly);
					var label = new ELabel(getCenter(poly), number, "label_style");
					label.pixelOffset=new GSize(0,6);
					map.addOverlay(label);
					sectionPolys[i] = poly;
					sectionNumbers[i] = number;
					labels[i] = label;
				}
				write("message", "Please Select a section where your farm is.");
				
		}
		});
}

function loadSections(townshipName){
	selectedTownship = townshipName;
	get("getSections", townshipName, function(data){
		
	})
}

function removeTownships(){
	for (var i = 0; i < townshipPolys.length; i++) {
		map.removeOverlay(townshipPolys[i]);
		map.removeOverlay(labels[i]);
	}
	GEvent.clearListeners(map, 'click');
}
function removeSections(j){
	for (var i = 0; i < sectionPolys.length; i++) {
			map.removeOverlay(sectionPolys[i]);
			map.removeOverlay(labels[i]);
	}
	map.addOverlay(sectionPolys[j]);
	GEvent.clearListeners(map, 'click');
}
var selectedSection;
function sectionListeners(){
	GEvent.addListener(map, 'click', function(overlay, verts){	
			for (var i = 0; i < sectionPolys.length; i++) {
					if (overlay==sectionPolys[i]){
						
						selectedSection = sectionPolys[i];
						selectedSectionNumber = sectionNumbers[i];
						write("message", "Please wait.....");
						removeSections(i);
						map.setCenter(getCenter(sectionPolys[i]), 14);
						createNewField();
						break;
					}
			}
	});
}



function townshipListeners(){
		
			
			GEvent.addListener(map, 'click', function(overlay, verts){
				
				for (var i = 0; i < townshipPolys.length; i++) {
					if (overlay==townshipPolys[i]){
						write("message", "Please wait.....");
						map.setCenter(getCenter(townshipPolys[i]), 12);
						loadSections(townshipNames[i]);
						removeTownships();
						sectionListeners();
						break;
					}
				}
			});
			
		
}



var firstMarker;
function createNewField(){
	write("message", "To see fields select 'Satellite' (top of map), then add a marker at a corner of the new field");
	GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
			if (overlay == selectedSection) {
				firstMarker = new GMarker(latlng, {
					icon: icon,
					draggable: false
				});
				map.addOverlay(firstMarker);
				addSecondMarker();
			}
		});
}

var secondMarker;
function addSecondMarker(){
	write("message", "Cick the opposite corner of the field.");
	GEvent.clearListeners(map, 'click');
	GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
			if (overlay == selectedSection) {
				secondMarker = new GMarker(latlng, {
					icon: icon,
					draggable: false
				});
				map.addOverlay(secondMarker);
				addRectangleToMap();
			}
		});
}
var blueI;
function addRectangleToMap(){
	var west = Math.min(firstMarker.getPoint().lng(), secondMarker.getPoint().lng());
	var east = Math.max(firstMarker.getPoint().lng(), secondMarker.getPoint().lng());
	var north = Math.max(firstMarker.getPoint().lat(), secondMarker.getPoint().lat());
	var south = Math.min(firstMarker.getPoint().lat(), secondMarker.getPoint().lat());
	map.removeOverlay(firstMarker);
	map.removeOverlay(secondMarker);
	
	var pts = [];
	point[0] = new GLatLng(north, west);
	point[1] = new GLatLng(north, east);
	point[2] = new GLatLng(south, east);
	point[3] = new GLatLng(south, west);
	point[4] = new GLatLng(north, west);

	
	
	for (var n = 0; n < point.length-1; n++) {
		
		marker[n] = new GMarker(point[n], {
			icon: icon,
			draggable: true
		});
		map.addOverlay(marker[n]);

		marker[n].enableDragging();
		GEvent.addListener(marker[n], 'drag', function(){
			draw2()
		});
		
		
	};//for
	bluePointListener();
	
	
	
	poly=[];
	show("save_field");
	
	draw2();
	
}

function bluePointListener(){
	write("message", "Move the pegs to modify the field, to add a peg:click two adjacent pegs, to delete a peg:click peg twice.");
	GEvent.addListener(map, 'click', function(overlay){
		for (var i=0; i<point.length; i++){
			if (overlay == marker[i]){
				blueI = i;
				GEvent.clearListeners(map, 'click');
				turnBlue(i);
				addVertexListener();
				
			}
		}
			
	});
}

function turnBlue(index){	

				var point = marker[index].getPoint();
				map.removeOverlay(marker[index]);
				marker[index] = new GMarker(point, {
						icon: icon2,
						draggable: true
							});
				map.addOverlay(marker[index]);
}
function turnRed(index){	

				var point = marker[index].getPoint();
				map.removeOverlay(marker[index]);
				marker[index] = new GMarker(point, {
						icon: icon,
						draggable: true
							});
				map.addOverlay(marker[index]);
}




function addVertexListener(){
	write("message", "Click a peg adjacent to the blue peg");
	GEvent.addListener(map, 'click', function(overlay){
		for (var i=0; i<point.length; i++){
			if (overlay == marker[i]){

	
				if (Math.abs(i-blueI)==1 || Math.abs(i-blueI)==(marker.length-1)){
					var newPoint = midPoint(marker[i], marker[blueI]);
					var newMarker = new GMarker(newPoint, {
						icon: icon,
						draggable: true
							});
					addMarker(newMarker, i, blueI);
					
					
				}
				else if (i==blueI){
					deleteMarker(i);
				}
			}
		}
	});
	
}

function deleteMarker(index){
	map.removeOverlay(marker[index]);
	for (var i=index; i<marker.length; i++){
		marker[i]=marker[i+1];
	}
	marker.length=marker.length-1;
	GEvent.clearListeners(map, 'click');
	bluePointListener();
	draw2();
}

function addMarker(newMarker, i1, i2){

	
	var lowI = Math.min(i1,i2);
	var highI = Math.max(i1,i2);
	var diff = highI-lowI;

	marker.length=marker.length+1;

	if (diff == 1) {
		for (var i = marker.length; i > lowI + 1; i--) {
			var k = i - 1;
			var l = i - 2;
			marker[i - 1] = marker[i - 2];
		}
	}
	else {
		highI++;
	}
	marker[highI]=newMarker;
	map.addOverlay(newMarker);
	turnRed(blueI);
	GEvent.addListener(marker[lowI], 'drag', function(){
			draw2()
		});
		GEvent.addListener(marker[highI], 'drag', function(){
			draw2()
		});
	GEvent.clearListeners(map, 'click');
	bluePointListener();
	draw2();
}

function midPoint(point1, point2){

	
	westPoint = Math.min(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));

	eastPoint = Math.max(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));

	southPoint = Math.min(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));

	northPoint = Math.max(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));

	return new GLatLng(westPoint+(eastPoint-westPoint)/2, southPoint+(northPoint-southPoint)/2);
}


function saveField(){
	var length = line.getVertexCount();
	var polyXML = "<vertices>";
	for (var i=0; i< length; i++){
		polyXML += "<vertex lat='";
		polyXML += line.getVertex(i).lat();
		polyXML += "' lng='";
		polyXML += line.getVertex(i).lng();
		polyXML += "' />";
	}
	polyXML += "</vertices>";
	var fieldName = $("#new_field_name").attr("value");
	var farmNumber = $("#new_farm_number").attr("value");

	
	
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveField",
					name: fieldName,
					farmNumber: farmNumber,
					township: selectedTownship,
					section: selectedSectionNumber,
					polygon: polyXML
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
					removePolyEditor();
					map.removeOverlay(selectedSection);
					loadUserInfo();
					initEventListeners();
				}
		});
		
	
}
function removePolyEditor(){
	map.removeOverlay(line);
	for (var i=0; i<marker.length; i++){
		map.removeOverlay(marker[i]);
	}
}

var selectedFields = [];

function selectCrop(){
	var cropType = $("input[name='crop_type']:checked").attr("value");
	for (var i = 0; i < selectedFields.length; i++) {
		
		var j = selectedFields[i];

		
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "changeCrop",
					farm: "296",
					creator: "davidkjos@yahoo.com",
					year: "2009",
					field: fieldNames[j],
					type: cropType
		},
		error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
		success: function(){
				selectedFields.pop(j);
				initEventListeners();
				loadUserInfo();
				
				}
		});
	}
}

function deleteFields(){
	for (var i=0; i<selectedFields.length; i++){

		map.removeOverlay(fieldPolys[selectedFields[i]]);
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "deleteField",
					name: fieldNames[selectedFields[i]]
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
					
					selectedFields.pop(selectedFields[i]);
					updateSelectionList();
					loadUserInfo();
				}
		});
		
	}
}
var selectedTownships = [];
var selectedSections = [];

function updateSelectionList(){
	
					var selectedText = "Selected Fields:<br/>";
					for (var j=0; j<selectedFields.length; j++){
						selectedTownships[j] = $(fieldXMLs[j]).attr("township");
						selectedSections[j] = $(fieldXMLs[j]).attr("section");
						var name = $(fieldXMLs[j]).attr("name");
						selectedText += selectedTownships[j]+"-"+selectedSections[j]+"-"+name+"<br/>";
					}
					writeHTML("stats", selectedText);
					 
					if (selectedFields.length!=0){
						show("delete_fields");
						show("select_crop");
						show("apply");
					}
					else {
						hide("delete_fields");
						hide("apply");
					}
}
var NONE_COLOR_U = "#FAAFBE";
var SOYBEAN_COLOR_U = "	#FFFF00";
var CORN_COLOR_U = "#A0CFEC";
var WHEAT_COLOR_U = "#57E964";
var NONE_COLOR_S = "#C48189";
var SOYBEAN_COLOR_S = "#AF7817";
var CORN_COLOR_S = "#736AFF";
var WHEAT_COLOR_S = "#4CC552";

var colorConverter = [];
colorConverter[SOYBEAN_COLOR_U] = SOYBEAN_COLOR_S;
colorConverter[SOYBEAN_COLOR_S] = SOYBEAN_COLOR_U;
colorConverter[WHEAT_COLOR_U] = WHEAT_COLOR_S;
colorConverter[WHEAT_COLOR_S] = WHEAT_COLOR_U;
colorConverter[CORN_COLOR_U] = CORN_COLOR_S;
colorConverter[CORN_COLOR_S] = CORN_COLOR_U;
colorConverter[NONE_COLOR_U] = NONE_COLOR_S;
colorConverter[NONE_COLOR_S] = NONE_COLOR_U;

function isSelectedField(index){

	var rValue = false;
	for (var i=0; i<selectedFields.length; i++){

		if (index == selectedFields[i]){
			rValue = true;
			break;
		}
	}
	return rValue;
}

function initEventListeners(){
	
	show("add");
	hide("apply");
	hide("save_field");
	hide("select_crop_form");
	hide("select_crop");
	
	GEvent.addListener(map, 'click', function(overlay, verts){	
			for (var i=0; i<fieldPolys.length; i++){
				if (overlay==fieldPolys[i]){
					fieldPolys[i].color = colorConverter[fieldPolys[i].color];
		
					
					if (isSelectedField(i)){
						selectedFields.pop(i);
					}
					else {
						selectedFields.push(i);
					}
					
					/*
					 if (cropType == "soybean") 
			fieldPoly.color = "#FFFF00";
		else if (cropType == "corn") 
			fieldPoly.color = "#EDE275";
		else if (cropType == "wheat") 
			fieldPoly.color = "#CCFB5D";
					 */
					
					/*
					if (fieldPolys[i].color=="blue"){
						fieldPolys[i].color="lime";
						selectedFields.pop(i);
					}
					else {
						fieldPolys[i].color="blue";
						selectedFields.push(i);
					}
					*/
					
					fieldPolys[i].redraw(true);
					updateSelectionList(i);
				}
			}
	});
	$("#select_crop").click(function() {
		hide("delete_fields");
		hide("select_crop");
		hide("apply");
		hide("add");
		show("select_crop_form");
	});
	$("#select_crop_confirm").click(function() {
		selectCrop();
		});
	
	
	$("#add").click(function() {
		hide("add");
		
		write("message", "Please Wait......");
		
		initLoad();
		
		townshipListeners();
	});
	
	$("#delete_fields").click(function() {
		deleteFields();
	});
	$("#apply").click(function() {
		addApplicationStep1(); 
	});
	$("#traillCounty").click(function() {
		map.setCenter(traillCounty,10);
	});
	$("#lindaas").click(function() {
		map.setCenter(lindaas,12);
	});
	$("#saveTownships").click(function() {
		saveTownships();
	});
	
	$("#saveTraill").click(function() {
			
	});

	$("#add_seed").click(function() {
		$("#dialog").text("Select the fields where you want to plant crops!");
		GEvent.addListener(map, 'click', function(overlay, latlng) {
			for (var i = 0; i < fieldNames.length; i++) {
				if (overlay == fieldPolygons[i]) {
					$("#dialog").html("You selected "+fieldNames[i]+" ("+Math.round(acreages[i])+" acres) which is slated to be "+cropTypes[i]+". Continue? <span id='yes'>Yes</span> | <span id='no'>No</span>");
					$("#yes").click(function() {
						$("#add_form").css("display", "block");
						$("#dialog").html("Fill out the popup form and then click 'ok'");
						$("#cancel").click(function() {
							$("#add_form").css("display", "none");
							});
					});
				}
			}
			
			});
	});
	$("#save_field_ok").click(function() {
		write("message", "Saving field......");
		saveField();
	});
	
	$("#add_farm").click(function() {
		addTownships();
		map.setCenter(traillCounty,10);
		$("#dialog").html("Select a township where part of your farm is.");
	});
	$("#remove_vertex").click(function() {
		isAdd=false;
	});
	$("#add_vertex").click(function() {
		isAdd=true;
	});

	
}

//EVENTS
//**********************************************************************
//**********************************************************************
//DATA
var countyCenter;

//township poly array
var townshipPolys = [];
var townshipNames = [];
//township name array

function initLoad(){
	currentIngrediant = new Ingrediant();
	var countiesXml;
	$.ajax({
		url: '/?action=get_county',
		type: 'GET',
		dataType: 'html',
		success: function(data){

			var doc = new ActiveXObject("Microsoft.XMLDOM")
        	doc.async="false"
			try {
				doc.loadXML(data);
				try {
					
					var county = $(doc).find("county");
					var poly = createPolygon(county);
					countyCenter = getCenter(poly);
					map.setCenter(countyCenter, 9);
					
					
					var length = $(doc).find("township").length;
					for (var i = 0; i < length; i++) {
						poly = createPolygon($(doc).find("township:nth(" + i + ")"));
						var name = $(doc).find("township:nth(" + i + ")").attr("name");
						
						var label = new ELabel(getLeft(poly), name, "label_style");
						label.pixelOffset=new GSize(0,6);

						townshipNames[i] = name;
						townshipPolys[i] = poly;
						labels[i] = label;
						
						map.addOverlay(label);
						
						map.addOverlay(poly);
					}
					//var poly = createPolygon($(doc).find("section[number=33]"));
					//map.addOverlay(poly);
					write("message", "Please Select a township where your farm is.");
				} 
				catch (e) {
				
				}
			}
			catch(e){
			
			}
		},
		error: function(xhr){
		
		}
	});

}
//DATA
//**********************************************************************
//**********************************************************************
//INITIALIZE/FINALIZE

function initialize() {

	$.ajaxSetup({ cache: false });

	beginWait();

	addMap();

	hide("delete_fields");
	hide("apply");
	loadUserInfo("davidkjos@yahoo.com");
	
	initEventListeners();
	
	endWait();
	
}
function finalize() {
	GUnload();
}

var farms = [];
var fieldPolys = [];
var fieldNames = [];
var fieldXMLs = [];

var sectionCenters = [];
var sectionIndex = 0;
var sectionXMLs = [];
var sectionNumbers = [];
var sectionTownships = [];

function contains(township, section){
	var rVal = false;
	for (var i=0; i<sectionNumbers.length; i++){

		if ((sectionNumbers[i]==section)&&(sectionTownships[i]==township)){
			rVal = true;

			break;
		}

	}
	return rVal;
}

function Farm(pXml){
	var xml = pXml;
	var number = $(xml).attr("number");
	this.key = $(xml).attr("key");
	
	
	mapViewString += "<b>"+number+"</b></br>";
	var fields = [];
	var listing = [];
	
	var length = $(xml).find("field").length;
	
	
	for (var i=0; i<length; i++){
		var township = $(xml).find("field:nth("+i+")").attr("township");
		var section = $(xml).find("field:nth("+i+")").attr("section");
		var sectionXML = $(xml).find("section:nth("+i+")");
		if (!contains(township, section)){
			sectionTownships.push(township);
			sectionNumbers.push(section);
			sectionXMLs.push(sectionXML);
			var polygon = createPolygon(sectionXML);

			sectionCenters.push(getCenter(polygon));
			var tstr="";
			for (var j =0; j<sectionCenters.length; j++){
				tstr+=sectionCenters[j];
			}
			
			listing[i] = township+"-"+section;
			mapViewString += "<span onclick='doit("+i+")'>"+listing[i]+"</span>"+"</br>";

		}

		
		
		var fieldXml = $(xml).find("field:nth("+i+")");
		var fieldPoly = createPolygon(fieldXml);
		var cropType = $(xml).find("field:nth("+i+")").attr("crop_type");
		
		if (cropType == "soybean") 
			fieldPoly.color = SOYBEAN_COLOR_U;
		else if (cropType == "corn") 
			fieldPoly.color = CORN_COLOR_U;
		else if (cropType == "wheat") 
			fieldPoly.color = WHEAT_COLOR_U;
		else if (cropType == "none") 
			fieldPoly.color = NONE_COLOR_U;	

		
		map.addOverlay(fieldPoly);
		fieldPolys[i] = fieldPoly;
		fieldAcreages[i] = Math.floor(fieldPoly.getArea()/4046.8252519);
		fieldXMLs[i] = fieldXml;
		fieldNames[i] = $(xml).find("field:nth("+i+")").attr("name");
		

	}
	
	this.listing = listing;
	this.number = number;	
}




//ee

function doit(i){


	map.setCenter(sectionCenters[i], 14);
}

FarmTownships = function(){
	var name;
	var sections = [];
}

var mapViewString = "";
/*
<b>296</b><br/>
		Lindaas-33<br/>
		Lindaas-34<br/>
*/
var email=null;;

var sectionXMLs = []
var sectionIndex = 0;

function loadUserInfo(pEmail){
	
	sectionCenters = [];
	sectionIndex = 0;
	sectionXMLs = [];
	sectionNumbers = [];
	sectionTownships = [];
	
	
	hide("save_field");
	
	for (var i=0; i<fieldPolys.length; i++){
		map.removeOverlay(fieldPolys[i]);	
	}

	
	if (!email){
		email = pEmail;
	}
	$.ajax({
		url: '/?action=getUser&email='+email,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			
			mapViewString = "";
			var doc = new ActiveXObject("Microsoft.XMLDOM")
			doc.async="false";

			doc.loadXML(data);
			
			var length = $(doc).find("farm").length;

			for (var i=0; i<length; i++){
				var xml = $(doc).find("farm:nth("+i+")");
				var farm = new Farm(xml);
				farms[i] = farm;
				
				var fieldAppStr = "";
				for (var j = 0; j < $(doc).find("application").length; j++) {
					var app = $(doc).find("application:nth("+j+")");
					fieldAppStr += "<b>"+$(app).attr("field") + "</b><br/>";
					var ingLength = $(app).find("ingredient").length;
					for (var k = 0; k < ingLength; k++) {
						
						var product = $(app).find("ingredient:nth("+k+")").attr("product");
						var price = $(app).find("ingredient:nth("+k+")").attr("price");
						var amount = $(app).find("ingredient:nth("+k+")").attr("amount");
						fieldAppStr += amount+" Units of "+product+" at $"+price+"<br/>";
					}
					
				}
				writeHTML("applications_box", fieldAppStr);
				
			}

			$("#map_views").html("asd");
			writeHTML("map_views", mapViewString);
		}
	});
}

var farms = [];

//INITIALIZE/FINALIZE
//*****************************************************************************************
//*****************************************************************************************
//FIELD DRAWING STUFF

var count=0;
var isAdd=true;
function draw1(){


	icon = new GIcon();
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
	
	poly=[];
	// Markers
	
	for (var n = 0; n < point.length; n++) {
		marker[n] = new GMarker(point[n], {
			icon: icon,
			draggable: true
		});
		map.addOverlay(marker[n]);

		marker[n].enableDragging();
		GEvent.addListener(marker[n], 'drag', function(){
			draw2()
		});
		
	};//for
	
	GEvent.addListener(map, 'click', function(overlay){
				for (var i = 0; i < marker.length; i++) {
					if (overlay == marker[i]) {
						if (isAdd) {
							if (firstSelected == null) {
								firstSelectedIndex = i;
								firstSelected = new GLatLng(marker[i].getPoint().lat(), marker[i].getPoint().lng());
								map.removeOverlay(marker[i]);
								marker[i] = new GMarker(firstSelected, {
									icon: icon2,
									draggable: false
								});
								map.addOverlay(marker[i]);
							}
							else 
								if (Math.abs(firstSelectedIndex - i) == 1 || Math.abs(firstSelectedIndex - i) == marker.length - 1) {
									secondSelectedIndex = i;
									var middleLat = firstSelected.lat() + (marker[i].getPoint().lat() - firstSelected.lat()) / 2
									var middleLng = firstSelected.lng() + (marker[i].getPoint().lng() - firstSelected.lng()) / 2
									var middlePoint = new GLatLng(middleLat, middleLng);
									
									//change first selcted marker to red
									map.removeOverlay(marker[firstSelectedIndex]);
									marker[firstSelectedIndex] = new GMarker(firstSelected, {
										icon: icon,
										draggable: true
									});
									map.addOverlay(marker[firstSelectedIndex]);
									marker[firstSelectedIndex].enableDragging();
									GEvent.addListener(marker[firstSelectedIndex], 'drag', function(){
										draw2()
									});
									
									//add new marker
									var newIndex = marker.length;
									
									var newMarkerIndex;
									var otherMarkerIndex;

									if (firstSelectedIndex > secondSelectedIndex) {
										newMarkerIndex = firstSelectedIndex;
										otherMarkerIndex = secondSelectedIndex;
									}
									else {
										newMarkerIndex = secondSelectedIndex;
										otherMarkerIndex = firstSelectedIndex;
									}
									
									if ((newMarkerIndex == marker.length - 1) && (newMarkerIndex - otherMarkerIndex != 1)) {
									
										newMarkerIndex = 0;
									}
									
									
									for (var j = newIndex; j > newMarkerIndex; j--) {
										var k = j - 1;
										marker[j] = marker[j - 1];
									}
									
									marker[newMarkerIndex] = new GMarker(middlePoint, {
										icon: icon,
										draggable: true
									});
									map.addOverlay(marker[newMarkerIndex]);
									
									
									marker[newMarkerIndex].enableDragging();
									GEvent.addListener(marker[newMarkerIndex], 'drag', function(){
										draw2()
									});
									firstSelected = null;
									draw2();
								}//else
							break;
						}
						else {
							var deleteIndex = i;
							map.removeOverlay(marker[deleteIndex]);

							for (var j=deleteIndex; j<marker.length-1; j++){
								var k = j+1;
							
								marker[j]=marker[j+1];
							}
							marker[marker.length-1]=null;
							marker.length = marker.length-1;
							
							draw2();
						}
					}//if (overlay == marker[i]) {
					
				}//FOR
		});//click
	
	
}//draw1
// Polygon

var firstSelected=null;
var firstSelectedIndex=null;

function draw2()
{
poly.length=0; 

fieldXmlString = "<vertices>";
for(var i=0;i<marker.length;i++)
{
	fieldXmlString += "<vertex lat='"+marker[i].getPoint().lat()+"' lng='"+marker[i].getPoint().lng()+"' />";
	poly.push(marker[i].getPoint());
}
fieldXmlString += "<vertex lat='"+marker[0].getPoint().lat()+"' lng='"+marker[0].getPoint().lng()+"' />";
fieldXmlString += "</vertices>";
poly.push(marker[0].getPoint());
if(line){map.removeOverlay(line)};
line=new GPolygon(poly,'#FF0000', 3, 1,'#0000FF',0.2);
map.addOverlay(line);
};

//FIELD DRAWING STUFF
//*****************************************************************************************
//ADD APPLICATION FORM
var totalAcres = 0;
ingrediantsI=0;
function addApplicationStep1(){
	ingrediants[ingrediantI] = new Ingrediant();
	var products = getProducts();
	
	hide("app_type_options_step");
	hide("app_date_step");
	hide("app_product_step");
	hide("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");
	show("add_form");
	show("app_form_header");
	hide("add_confirm");
	var fields = "";
	for (var i=0;i<selectedFields.length;i++){
		totalAcres = totalAcres+=fieldAcreages[i];
		if (i!=0)
			fields+=", ";
		fields+=selectedTownships[i]+"-"+selectedSections[i]+"-"+fieldNames[i];
	}
	write("form_field_list", fields);
	write("form_total_acres", totalAcres+" Acres");
	$("#app_next_button").click(function(){
		
		addApplicationDate();
	});
}


function addApplicationDate(){
	show("app_date_step");
	hide("app_type_options_step");
	hide("app_product_step");
	hide("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");
	$("#app_next_button").unbind("click");
	$("#app_next_button").click(function(){
		ingrediants[ingrediantI].date = $("#app_date_input").attr("value");
		
		addApplicationType();
	});
}
var currentIngrediant;
var app_type;
var units;
function addApplicationType(){
	show("app_type_options_step");
	hide("app_product_step");
	hide("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");
	
	$("input[name=app_type]").click(function(){
		app_type = $("input[name='app_type']:checked").attr("value");
		
		ingrediants[ingrediantI].type = app_type;
		var crop = $(fieldXMLs[selectedFields[0]]).attr("crop_type");
		ingrediants[ingrediantI].crop = crop;
		
		var productOptionsXML = $(productsXML).find("product[crop="+crop+"][type="+app_type+"]");
	
		var productStr = "<select id='product_select_list'>";
			productStr += "<option value='-1'>Select</option>";
		for (var i=0; i<$(productOptionsXML).length; i++){
			products[i] = new Product();
			products[i].name = $(productOptionsXML[i]).attr("name");
			products[i].type = $(productOptionsXML[i]).attr("type");
			products[i].crop = $(productOptionsXML[i]).attr("crop");
			products[i].unit = $(productOptionsXML[i]).attr("unit");
			productStr += "<option value='"+i+"'>"+products[i].name+"</option>";
		}
		productStr += "</select>";
		writeHTML("product_select", productStr);
		
		$("#product_select_list").change(function(){

			var i = $("#product_select_list").attr("value");
			selectedProduct = products[i];
		
			ingrediants[ingrediantI].product = selectedProduct.name;
			ingrediants[ingrediantI].unit = selectedProduct.unit;
			write("app_units1", products[i].unit);
			write("app_units2", products[i].unit);
		});
		
	});
	$("#app_next_button").unbind("click");
	$("#app_next_button").click(function(){
		
		addApplicationProduct();
		});
}


/*
 <select>
				<option>Monsanto DX</option>
				<option>Synergex 90z</option>
				<option>Seedco H77</option>
			</select>
 */

var Ingrediant = function(){
	this.applicationId;
	this.date;
	this.crop;
	this.type;
	this.product;
	this.amount;
	this.price;
	this.unit;
}

function addApplicationProduct(){
	
	//for (var i=0; i<$(productsXML).find("product").length; i++){
	


	show("app_product_step");
	hide("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");
	

	
	$("#app_next_button").unbind("click");
	
	$("#app_next_button").click(function(){
		
		addApplicationAmount();
		});
}


function addApplicationAmount(){
	show("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");
	$("#app_next_button").unbind("click");
	$("#app_next_button").click(function(){
		ingrediants[ingrediantI].amount = $("#app_amount_input").attr("value");
		addApplicationPrice();
		});
}

function addApplicationPrice(){
	show("app_product_price_step");
	hide("app_confirm_step");
	$("#app_next_button").unbind("click");
	$("#app_next_button").click(function(){
		ingrediants[ingrediantI].price = $("#app_price_input").attr("value");
		addApplicationConfirm();
		});
}

var ingrediants = [];
var ingrediantI = 0;

var selectedProduct;
function addApplicationConfirm(){
	hide("app_form_header");
	hide("app_date_step");
	hide("app_type_options_step");
	hide("app_product_step");
	hide("app_amount_step");
	hide("app_product_price_step");
	hide("app_confirm_step");

	write("app_date", ingrediants[ingrediantI].date);
	write("total_acres", totalAcres);
	write("app_cost", "23,000");
	write("crop", selectedProduct.crop);
	
	
	
	for (var i=0; i<ingrediants.length; i++)
	

	


	var ingrediantsStr = "";
	
	
	for (var i=0; i<ingrediants.length; i++){
	
		var total = totalAcres * ingrediants[i].amount;
		var totalPrice = total * ingrediants[i].price;
		ingrediantsStr += total +" "+ingrediants[i].unit+"s of "+ingrediants[i].product + " at $" +
		ingrediants[i].price + "/"+ingrediants[i].unit+". Total: $"+totalPrice+"<br/>";
	}
	writeHTML("app_items",ingrediantsStr);
	
	show("add_confirm");
	
	$("#add_to_app").click(function(){
		ingrediantI++;
		ingrediants[ingrediantI] = new Ingrediant();
		addApplicationType();
	});
	$("#save_app").click(function(){
		
		$.ajax({
				url: '/?action=saveApplication&date='+ingrediants[0].date,
				type: 'GET',
				success:function(data){
					var application_key = $(data).find("application").text();
					
					for (var i=0; i<selectedFields.length; i++){
						var selectedFieldI = selectedFields[i];
						$.ajax({
							url: '/?action=saveAppField',
							type: 'POST',
							data: {
								app_key: application_key,
								farm_key: farms[0].key,
								field: fieldNames[selectedFieldI]
							},
							success: function(data){
								
							}
						});
					}
					

					for (var i=0; ingrediants.length; i++){
						var prName;
						var prAmount;
						var prPrice;
						try {
							prName = ingrediants[i].product;
							prAmount = ingrediants[i].amount;
							prPrice = ingrediants[i].price;
						}
						catch (e){
							
						}
						
						$.ajax({
							url: '/?action=saveAppProduct',
							type: 'POST',
							data: {
								app_key: application_key,
								product: prName,
								amount: prAmount,
								price: prPrice
							},
							success: function(data){
								hide("add_form");
							}
							
						});
					}
					
					
				},
				error: function(xhr){
				
						
					
				}
				
		});
	});
}
var productsXML;

var products = [];

var Product = function(){
	this.name;
	this.type;
	this.crop;
	this.unit;
	this.meta;
}
function getProducts(){
	

$.ajax({
		url: '/?action=getProducts',
		type: 'GET',
		dataType: 'html',
		success: function(data){
		
			var doc = new ActiveXObject("Microsoft.XMLDOM")
        	doc.async="false";
			doc.loadXML(data);
			productsXML = doc;
			
		}
	});

}

