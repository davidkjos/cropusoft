




// Polygon
var icon;
var marker=[];
var point=[];
var poly;
var line=null;



function draw(center){
	GEvent.clearListeners(sectionPolys[selectedSectionIndex], 'click');
// red marker icon
icon = new GIcon();
icon.image = "http://labs.google.com/ridefinder/images/mm_20_red.png";
icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
icon.iconSize = new GSize(12, 20);
icon.shadowSize = new GSize(22, 20);
icon.iconAnchor = new GPoint(6, 20);
//icon.infoWindowAnchor = new GPoint(5, 1);
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
	
}
	



function drawbackup(){
	poly.length=0; 
	for(var i=0;i<marker.length;i++)
	{
	poly.push(marker[i].getPoint());
	}
	poly.push(marker[0].getPoint());
	if(line){map.removeOverlay(line)};
	line=new GPolygon(poly,'#FF0000', 3, 1,'#0000FF',0.2);
	map.addOverlay(line);
	};
}


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
								//alert("moving "+k+" to "+j);
								marker[j]=marker[j+1];
							}
							marker[marker.length-1]=null;
							marker.length = marker.length-1;
							//alert(marker.length);
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
//alert("length="+marker.length);
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

//*************************************************


function readXmlFile(fileName){
	xmlDoc=document.implementation.createDocument("","",null);
	xmlDoc.async=false;
	xmlDoc.load(fileName);
	return xmlDoc;
	}
function createPolygon(vertices, type){
	var length = $(vertices).find("vertex").length;
	var pts = [];
	saveAtts = "<vertices>";
	for (var i = 0; i < length; i++) {
		j=i+1;
		pts[i] = new GLatLng($(vertices).find("vertex:nth-child(" + j + ")").find("lat").text(), $(vertices).find("vertex:nth-child(" + j + ")").find("long").text());
		saveAtts += "<vertex lat='" + pts[i].lat() + "' lng='" + pts[i].lng() + "' />";
	}	
	saveAtts += "</vertices>";
	if (type=="county"){
		countyAtts = saveAtts;

	}
	return pts;
}
var saveAtts = "";
var countyAtts = "";

function createPolygonFromAtts(vertices){
	var length = $(vertices).find("vertex").length;
	var pts = [];
	for (var i = 0; i < length; i++) {
		var j = i + 1;
		pts[i] = new GLatLng($(vertices).find("vertex:nth-child(" + j + ")").attr("lat"), $(vertices).find("vertex:nth-child(" + j + ")").attr("lng"));
	}	
	var crop = $(vertices).find("crop").attr("type");
	var color;
	cropTypes[globalI]=crop;
	if (crop=="soy"){
		color = "yellow";
	}
	else 
		color = "orange";
	var poly = new GPolygon(pts,"#000000",1,1,color,0.5,{clickable:true});
	acreages[globalI]=poly.getArea()/4046.8252519;
	return poly;
}

function createPolygon2(vertices, color){
	
	if (!color){
		color = "lime";
	}
	var length = $(vertices).find("vertex").length;

	var pts = [];
	for (var i = 0; i < length; i++) {
		var j = i + 1;
		pts[i] = new GLatLng($(vertices).find("vertex:nth-child(" + j + ")").attr("lat"), $(vertices).find("vertex:nth-child(" + j + ")").attr("lng"));
	}	
	var poly = new GPolygon(pts,"#000000",1,1,color,0.5,{clickable:true});
	return poly;
}


var section33 = new GLatLng(47.505330535932295, -97.29432106018066);
var section34 = new GLatLng(47.50520007967887, -97.2726058959961);
var traillCounty = new GLatLng(47.45130843796391, -97.15484619140625);
var lindaas = new GLatLng(47.54200486783878, -97.28565216064453);
var ne33 = new GLatLng(47.50131523378352, -97.29968547821045);
var se33 = new GLatLng(47.501199263815415, -97.28835582733154);
var nw33 = new GLatLng(47.50931654292719, -97.27818489074707);
var sw33 = new GLatLng(47.509345530960225,-97.2883129119873);
var nw34 = new GLatLng(47.50946148293232, -97.29972839355469);

/*
 <county><vertices>
 <vertex lat='47.50131523378352'  lng='-97.29968547821045' />
 <vertex lat='47.501199263815415'  lng='-97.28835582733154' />
 <vertex lat='47.50931654292719'  lng='-97.27818489074707' />
 <vertex lat='47.509345530960225'  lng='-97.2883129119873' />
 <vertex lat='47.50946148293232'  lng='-97.29972839355469' />
 <vertex lat='47.50131523378352'  lng='-97.29968547821045' /></vertices><county>
 */


//********************************************************************

var fieldNames = [];
var cropTypes = [];
var acreages = [];
var globalI =0;
var map;

function initialize() {
	$("#please_wait").css("display", "block");

	map = new GMap2(document.getElementById("map"));
	map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 15);
	map.setUIToDefault();
	
	var farmsXml = readXmlFile("farms2.xml");
	var number = $(farmsXml).find("farm:first").attr("number");
	var township = $(farmsXml).find("site:first").attr("township");
	var section = $(farmsXml).find("site:first").attr("section");
	
	var countiesXml;
	$.ajax({
		url: '/',
		type: 'GET',
		data: {
			action: "getCounty",
		},
		success: function(data){
			var poly = createPolygon2(data);

			map.addOverlay(poly);
		},
		error: function(xhr){
			//alert(xhr.status+": "+xhr.statusText);
		}
	});

	
	pts = [];
	var townshipXml = $(countiesXml).find("township[name=Lindaas]").find("township-limits");
	pts = createPolygon(townshipXml);
	poly = new GPolygon(pts,"#000000",1,1,"#90f010",0.3,{clickable:false});
	map.addOverlay(poly);
	
	
	var farmsXml = readXmlFile("farms2.xml");
	var fieldsXml = $(farmsXml).find("site:first").find("field");
	var length = $(fieldsXml).length;
	
	var fieldPolygons = [];
	
	for (globalI=0; globalI<length; globalI++){
		i=globalI;
		var j=i+1;
		var fieldXml = $(farmsXml).find("site:first").find("field:nth-child("+j+")");
		fieldNames[i] = $(fieldXml).attr("name");
		fieldPolygons[i] = createPolygonFromAtts(fieldXml);
		map.addOverlay(fieldPolygons[i]);
	}
	for (var i=0; i<length; i++){
		var j=i+1;
		var fieldXml = $(farmsXml).find("site:nth-child(2)").find("field:nth-child("+j+")");
		polygon = createPolygonFromAtts(fieldXml);
		map.addOverlay(polygon);
	}
	
	
	polygon = createPolygonFromAtts(fieldXml);
	map.addOverlay(polygon);
	//alert(township+number+section);
	
	//alert($(farmsXml).find("site:nth-child(2)").attr("section"));
	$("#section33").click(function() {
		map.setCenter(section33,15);
	});
	$("#section34").click(function() {
		map.setCenter(section34,15);
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
			try {
			$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveCounty",
					polygon: countyAtts,
					name: "Traill"
				},
				dataType: 'xml',
				error: function(xhr){
					if (xhr.status==200){
						alert("saved");
					}
					else {
						//alert(xhr.status+": "+xhr.statusText);
					}
				}
			})
		}
		catch (e){
			alert(e);
		}
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
					$("#no").click(function() {
						alert("no");
					});
				}
			}
			
			});
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
	$("#save_field").click(function() {
		$("#please_wait").css("display", "block");
		var fieldName = $("#add_field_name").attr("value");
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveField",
					polygon: fieldXmlString,
					name: fieldName,
					farm: "296",
					section: "296",
					township: "Lindaas",
					
				},
				dataType: 'xml',
				error: function(xhr){
					if (xhr.status == 200) {
						$.ajax({
						url: '/',
						type: 'GET',
						data: {
							action: "getFields",
							township: "Lindaas"
						},
						success: function(data){
							for (var i=0; i<$(data).find("field").length; i++){
								var xml = $(data).find("field:nth("+i+")");
								var poly = createPolygon2(xml, "blue");
								map.addOverlay(poly);
							}
							map.removeOverlay(line);
							for (var i=0; i<marker.length; i++){
								map.removeOverlay(marker[i]);
							}
							$("#add_field_buttons").css("display", "none");
							$("#please_wait").css("display", "none");
						},
						error: function(xhr){
							//alert(xhr.status+": "+xhr.statusText);
						}
						});
					}
					else {
						//alert(xhr.status+": "+xhr.statusText);
					}
				}
		});		
	});
	
	$("#please_wait").css("display", "none");
}
var townshipI=0;
function saveTownships() {
			try {
			$("#please_wait").css("display", "block");
			$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveTownship",
					polygon: townshipVerts[townshipI],
					name: townshipNames[townshipI]
				},
				dataType: 'xml',
				error: function(xhr){
					if (xhr.status==200){
						townshipI++;
						if (townshipI<townshipVerts.length){
							saveTownships();
						}
						else {
							$("#please_wait").css("display", "none");
						}
					}
					else {
						//alert(xhr.status+": "+xhr.statusText);
						$("#please_wait").css("display", "none");
					}
				}
			})
		}
		catch (e){
			alert(e);
		}
	}


var townshipPolys = [];
var sectionPolys = [];
var center;
function addSections(){
	$("#please_wait").css("display", "block");
	var val = $(countiesXml).find("sections:nth("+selectedTownshipIndex+")");
	for (var i = 0; i < $(val).find("section").length; i++) {
		var pts = createPolygon($(val).find("section:nth(" + i + ")"));
		sectionPolys[i] = new GPolygon(pts, "#000000", 1, 1, "#d0f010", 0.2, {
			clickable: true
		});
		map.addOverlay(sectionPolys[i]);
	}
	GEvent.clearListeners(townshipPolys[selectedTownshipIndex], 'click');
	GEvent.addListener(map, 'click', function(overlay, latlng) {
				for (var i = 0; i < sectionPolys.length; i++) {
					if (overlay==sectionPolys[i]){
						center = getCenter(sectionPolys[i]);
						map.setCenter(center,15);
						
							
						point.push(center);
						point.push(center);
						point.push(center);
						point.push(center);
						
						draw1();
						draw2();
						$("#add_field_buttons").css("display", "block");
						
						$("#add_vertex").click(function(){
							$("#dialog").text("Select two adjacent vertices that the new vertex will be between.");
							GEvent.addListener(map, 'click', function(overlay, latlng) {


									$("#dialog").text("Selected 1 vertex");
									var hLat = point[0].lat()+(point[1].lat()-point[0].lat())/2;
									var lLng = point[0].lng()+(point[1].lng()-point[0].lng())/2;
									point[4]=GLatLng(line.getVertex(3).lat(), line.getVertex(3).lng());
									point[3]=GLatLng(line.getVertex(1).lat(), line.getVertex(1).lng());
									point[2]=GLatLng(line.getVertex(1).lat(), line.getVertex(1).lng());
									point[1]= new GLatLng(hLat,lLng);
									point[0]=GLatLng(line.getVertex(0).lat(), line.getVertex(0).lng());
									
									draw2();

								
								
								});
						});
					}
				}
	});
	$("#please_wait").css("display", "none");
}

var firstVertex=-1;
var secondVertex=-1;

var countiesXml;
var selectedTownshipIndex;
var selectedSectionIndex;
var townshipVerts = [];
var townshipNames = [];


function addTownships(){
	$("#please_wait").css("display", "block");
	countiesXml = readXmlFile("counties.xml");
	var countyLimitsXml = $(countiesXml).find("township-limits");
	var length = $(countyLimitsXml).length;
	
	/*
	for (var i=0; i<length; i++){
		var val = $(countiesXml).find("township-limits:nth("+i+")");
		var pts = createPolygon(val);
		townshipVerts[i] = saveAtts;
		townshipNames[i] = $(countiesXml).find("township:nth("+i+")").attr("name");
		townshipPolys[i] = new GPolygon(pts,"#000000",1,1,"#f0f010",0.2,{clickable:true});
		map.addOverlay(townshipPolys[i]);
	}*/
	$.ajax({
		url: '/',
		type: 'GET',
		data: {
			action: "getTownships",
		},
		success: function(data){
			for (var i = 0; i < $(data).find("township").length; i++) {
				var j = i+1;
				var val = $(data).find("township:nth("+j+")");
				townshipPolys[i] = createPolygon2(val);
				map.addOverlay(townshipPolys[i]);
			}
			$("#please_wait").css("display", "none");
			//var poly = createPolygon2(data);
			//map.addOverlay(poly);
		},
		error: function(xhr){
			//alert(xhr.status+": "+xhr.statusText);
		}
	});
	
	//township click
	GEvent.addListener(map, 'click', function(overlay, latlng) {
		for (var i = 0; i < townshipPolys.length; i++) {
			if (overlay == townshipPolys[i]) {
				selectedSectionIndex=i;
				selectedTownshipIndex=i;
				var eastLng = overlay.getBounds().getNorthEast().lng();
				var westLng = overlay.getBounds().getSouthWest().lng();
				
				var northLat = overlay.getBounds().getNorthEast().lat();
				var southLat = overlay.getBounds().getSouthWest().lat();
				var lat = southLat+(northLat-southLat)/2;
				var lng = westLng+(eastLng-westLng)/2;
				map.setCenter(new GLatLng(lat, lng),12);
				addSections();
			}
		}
		});
}


function finalize() {
	GUnload();
}

function getCenter(polygon){
	var eastLng = polygon.getBounds().getNorthEast().lng();
	var westLng = polygon.getBounds().getSouthWest().lng();		
	var northLat = polygon.getBounds().getNorthEast().lat();
	var southLat = polygon.getBounds().getSouthWest().lat();
	var lat = southLat+(northLat-southLat)/2;
	var lng = westLng+(eastLng-westLng)/2;
	return new GLatLng(lat, lng)
}



