

function show(str){
			$("#" + str).css("display", "block");
	}
function hide(str){
	try {
		$("#" + str).css("display", "none");
	}
	catch(e){
	
	}
}

//DISPLAY-------------------------------------------------------------------------------------------


	var sFields = [];
	var fields = [];

var display;
var Display = function(){
	
	var sSection;
	var sections = [];

	var map;
	
	this.getSections = function(){
		return sections;
	}
	this.getMap = function(){
		return map;
	};
	
	this.fields = function(){
		return fields;
	}
	
	function write(div, html){
		$("#"+div).html(html);
	}
	
	
	
	function show(str){
			$("#" + str).css("display", "block");
	}
	
	this.cleanupState = function(){
		hide("add");
		hide("apply");
		hide("delete");
		hide("cancel");
		hide("done");
	}
	
	function addPolygon(polygon){
		map.addOverlay(polygon);
	}
	
	var townships = [];
	//#display
	this.showTownships = function(){
		data.loadTownships(function(){
			
		});
	}
	this.removeTownships = function(){
		
	}
	
	this.showFieldsOfFarm = function(farm){
		map.clearOverlays();
		for (var i=0; i<fields.length; i++){
			if (fields[i].farm == farm){
				map.addOverlay(fields[i].polygon);
			}
		}
	}
	this.initFields = function(pFields){
		fields = pFields;
		this.showFields(fields);
	}
	
	this.showFields = function(pFields) {
		
		
		
		map.clearOverlays();
		//#$
		var furthestWest = 1000;
		var furthestEast = -1000;
		var furthestNorth = -1000;
		var furthestSouth = 1000;
		var points1 = [];
		for (var i=0; i<pFields.length; i++){
			var polygon = pFields[i].polygon;
			
			var eastLng = polygon.getBounds().getNorthEast().lng();
			
			if (eastLng > furthestEast){
				furthestEast = eastLng;
			}
			
			var westLng = polygon.getBounds().getSouthWest().lng();
			if (westLng < furthestWest){
				furthestWest = westLng;
			}
			
			var northLat = polygon.getBounds().getNorthEast().lat();
			if (northLat > furthestNorth){
				furthestNorth = northLat;
			}
			
			
			var southLat = polygon.getBounds().getSouthWest().lat();

			if (southLat < furthestSouth){
				furthestSouth = southLat;
			}
		
			var label = new ELabel(getLeft(pFields[i].polygon), pFields[i].name, "label_style");
			label.pixelOffset=new GSize(6,6);
			map.addOverlay(label);
			
			addPolygon(pFields[i].polygon);
			points1[0] = new GLatLng(furthestNorth, furthestWest);
			points1[1] = new GLatLng(furthestNorth, furthestEast);
			points1[2] = new GLatLng(furthestSouth, furthestEast);
			points1[3] = new GLatLng(furthestSouth, furthestWest);
			points1[4] = new GLatLng(furthestNorth, furthestWest);

		}
		var width = Math.max(furthestNorth-furthestSouth, furthestEast-furthestWest);

		var zoom;
		if (width <  0.04){
			zoom=13;
		}
		else if (width < 0.09){
			zoom=12;
		}


		if (width > 0.09){

			zoom=11;
		}
		
		var poly = new GPolygon(points1,"#000000",1.5,1.0,"yellow",0.2,{clickable:true});
		map.setCenter(getCenter(poly),zoom);
		//map.addOverlay(poly);
		
		
	}
	
	var selectAppDate;
	var selectApp;
	var formButtons;
	var seedOptions;
	var fertilizerOptions;
	var treatmentOptions;
	var chemicalOptions;
	var formText;
	
	this.showApplicationForm = function(){
		
		var formEntryIndex =0;
		var lDataDoc;
		
		data.getForm(function(dataDoc){
	
			lDataDoc = dataDoc;
			selectApp = $(dataDoc).find("select-app").text();
			formText = $(dataDoc).find("form-header").text();
			selectAppDate = $(dataDoc).find("app-date").text();
			formButtons = $(dataDoc).find("buttons").text();
				
			seedOptions = $(dataDoc).find("seed-options").text();
			fertilizerOptions = $(dataDoc).find("fertilizer-options").text();
			treatmentOptions = $(dataDoc).find("treatment-options").text();
			chemicalOptions = $(dataDoc).find("chemical-options").text();
			
			var dataText = formText + selectAppDate + selectApp;
			
			show("add_form");
			
			writeHTML("add_form", dataText);
			write("acreage", getSelectedAcreage()+" ");
			
			setupListener();
			
		});
		
		function setupListener(){
			$("#appOptions").attr("id", "appOptions"+formEntryIndex);
			
			$("#add_form").find("input[name=appTypeOption]").each(function(){
				$(this).attr("name", "appTypeOption"+formEntryIndex);
			});
			
			
			$("#add_form").find("input[name=appTypeOption0]").click(function(){
				$("#appOptions0").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
			});

			$("#add_form").find("input[name=appTypeOption1]").click(function(){
				$("#appOptions1").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
			});

			$("#add_form").find("input[name=appTypeOption2]").click(function(){
				$("#appOptions2").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
			});
	
			$("#add_form").find("input[name=appTypeOption3]").click(function(){
				$("#appOptions3").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
			});

			$("#add_form").find("input[name=appTypeOption4]").click(function(){
				$("#appOptions4").html($(lDataDoc).find($(this).attr("value")+"-options").text());
				$("#add_form").find("select[name=productSelect]").attr("name", "productSelect"+formEntryIndex);
			});
			
			
			
			//$("#add_form").find("input[value=seed]").attr("checked", "true");
			
			$("#add_form").find("input[name=appAmount]").attr("name", "appAmount"+formEntryIndex);
			$("#add_form").find("input[name=appCost]").attr("name", "appCost"+formEntryIndex);
			$("#add_form").find("div[id=buttons]").attr("id", "buttons"+formEntryIndex);
			$("#add_form").find("div").attr("id","buttons"+formEntryIndex);
			$("#add_form").find("select[name=acre_units]").attr("name","acre_units"+formEntryIndex);
			$("#add_form").find("select[name=price_units]").attr("name","price_units"+formEntryIndex);
			
			var buttonBars = $(".buttons");
			var i=0;
			$(buttonBars).each(function(){
				if (i == formEntryIndex) {
					$(this).html("<span id='more_button'>More</span> <span id='back_button'>Back</span> <span id='confirm_button'>Confirm</span>");
					if (i>0){
						$(this).append(" <span id='remove_button'>Remove</span>");
					}
				}
				else 
					$(this).html(" ");
				i++;
			});
			
			
			
			
			
			$("#more_button").click(function(){
				formEntryIndex++;
				$("#add_form").append(selectApp);
				setupListener();
			});
			$("#remove_button").click(function(){
				var formSection= $(".form_section")[formEntryIndex];
				$(formSection).remove();
				formEntryIndex--;
				setupListener();
			});
			$("#back_button").click(function(){
				$("#add_form").html("");
				hide("add_form");
				applyState();
			});
			$("#confirm_button").click(function(){
				var date = new DateEntity();
				date.day = $("select[name=day]").attr("value");
				date.month = $("select[name=month]").attr("value");
				date.year = $("select[name=year]").attr("value");
				date.note = $("input[name=appName]").attr("value");
				var apps = [];
				var cropType = $("input[name=cropOption]:checked").attr("value");
				for (var i=0; i<=formEntryIndex; i++){
					var app = new Application();
					app.appType = $("input[name=appTypeOption"+i+"]:checked").attr("value");
					app.productName = $("select[name=productSelect"+i+"]").attr("value");
					app.amount = $("input[name=appAmount"+i+"]").attr("value");
					app.price = $("input[name=appCost"+i+"]").attr("value");
					app.priceUnits = $("select[name=price_units"+i+"]").attr("value");
					app.acreUnits = $("select[name=acre_units"+i+"]").attr("value");
					app.cropType = cropType;
					apps[i] = app;
					
				}
				data.saveApplication(date, apps, function(){
	
					$("#add_form").html("");
					hide("add_form");
					display.cleanupFieldSelector();
					display.cleanupState();
					appConfirmState();

				})
				
				
				
				
				
				
				
			});
			/*
			 *	$("input[name=app_type]").click(function(){
		app_type = $("input[name='app_type']:checked").attr("value");
		
			 */
			
		}
		
		
	}
	
	/*
	 var Application = function(){
	this.appType;
	this.productName;
	this.amount;
	this.units;
	this.price;
}
	 */
	
	
	this.initSections = function(pSections){
		sections = pSections;
		this.showSections(sections);
	}
	
	this.showSections = function(pSections){
		sections = pSections;
		var htmlStr = "View Section:<br/>";
		for (var i=0; i<pSections.length; i++){

			try {
				htmlStr += "<span class='section_nav_item' onclick='display.recenter(" + sections[i].centerVertex.lat() + "," + sections[i].centerVertex.lng() + ")' >" + pSections[i].township + "-" + pSections[i].number + "</br></span>";
			}
			catch (e){}
		}
		write("map_views", htmlStr);
	}
	
	this.showIngredients = function(ingredients){
		var htmlStr = "All Scheduled spray elements:";
		
		
		for (var i = 0; i < ingredients.length; i++) {  
			var acreUnits = ingredients[i].acreUnits;
			var acres = ingredients[i].acres;
			var rate = ingredients[i].amount;
			var total = Math.floor(acres*rate*100)/100;
			var totalCost = ingredients[i].price * total;
			
			htmlStr += "<br/><span class='ing_class'><b>"+total + " " + ingredients[i].appType+ " "+ ingredients[i].cropType + " " + ingredients[i].acreUnits + " of " +ingredients[i].product + " on " + ingredients[i].field+" at $"+ingredients[i].price+" / "+ingredients[i].priceUnits + "..........$"+totalCost+"</b></span>";
		}
		writeHTML("accounting_box", htmlStr);
	}
	
	this.showApplications = function(pApplications){
		var htmlStr = "Scheduled Applications:";
		for (var i = 0; i < pApplications.length; i++) {
			htmlStr += "<span class='app_class'><br/><b>"+pApplications[i].month + " " + pApplications[i].day +", " + pApplications[i].year +"</b>.............";
			htmlStr += pApplications[i].note+"</span>";
		}
		writeHTML("applications_box", htmlStr);
	}
	
	
	this.addMap = function(){
		map = new GMap2(document.getElementById("map"));
		//map.setCenter(new GLatLng(47.505330535932295, -97.29432106018066), 14);
		map.setUIToDefault();
	}
	this.recenter = function(lat, lng){
		map.setCenter(new GLatLng(lat, lng), 14);
	}
	this.homeButtons = function(){
		show("add");
		show("apply");
		show("delete");
		hide("cancel");
		hide("done");
		hide("select_crop_form");
		hide("save_field");
		hide("select_crop");
		hide("add_form2");
	}
	this.showCancel = function(){
		show("cancel");
	}
	this.showDone = function(){
		show("done");
	}
	this.hideDone = function(){
		hide("done");
	}
	this.showApplyForm = function(){
		show("add_form");
	}
	this.removeListeners = function(){
		GEvent.clearListeners(map, "click") ;
	}
	
	this.cleanupFieldSelector =function(){
		for (var i=0; i<sFields.length; i++){
			j = sFields[i];
			fields[j].polygon.color = fields[j].cropType;
			fields[j].polygon.redraw(true);		
		}
		sFields = [];
		GEvent.clearListeners(map, "click") ;

	}
	
	this.fieldListener = function() {
		GEvent.addListener(map, 'click', function(overlay, verts){	
			for (var i=0; i<fields.length; i++){
				if (overlay==fields[i].polygon){
					
					
					if (arrayContains(sFields, i)){
						
						
						
						var val = indexOf(sFields, i);
					
					
						sFields.splice(val, 1);
						fields[i].polygon.color = fields[i].cropType;
						fields[i].polygon.redraw(true);
						if (sFields.length==0){
							display.hideDone();
						}
					}
					else {
			
						sFields.push(i);
						fields[i].polygon.color = "red";
						fields[i].polygon.redraw(true);
						if (sFields.length==1){
							display.showDone();
						}
					}
					
					var str = "You selected:";
					for (var j=0; j<sFields.length; j++){
						str += sFields[j];//fields[sFields[j]].name;
						str += ", ";
					}
					write("message", str);	
				}
			}
		});
	}
	
	
	this.mapNavListener = function(){
		
	}
	
	function getSelectedAcreage(){
		var sAcreage = 0;
		for (var i=0; i<sFields.length; i++){
			sAcreage += fields[sFields[i]].acreage;
		}
		return Math.floor(sAcreage*100)/100;
	}
	
}

function arrayContains(array, value){
	var rValue = false;
	for (var i=0; i<array.length; i++){
		
		
		if (value == array[i]){
			rValue = true;
			break;
		}
	}
	return rValue;
}

function indexOf(array, value){
	var rValue=null;
	for (var i=0; i<array.length; i++){
		
		
		if (value == array[i]){
			rValue = i;
			break;
		}
	}
	return rValue;
}


//DISPLAY-------------------------------------------------------------------------------------------
//***********************************************************************************************
//DATA-------------------------------------------------------------------------------------------

var data;
var Data = function(){
	
	var dataText;
	var dataDoc;
	
	this.getForm = function(func){
		get('form28.xml', function(){

			var dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        	dataDoc.async="false";
			dataDoc.loadXML(dataText);
			func(dataDoc);
		});
	}
	
	var doc;
	this.response = function(){
		return doc;
	};
	
	var fieldIndex =0;
	var ingIndex = 0;
	this.saveIngredient = function(dateEntity, apps){
		var field = fields[sFields[fieldIndex]];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveIngredient"
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
					if (fieldIndex < sFields.length) 
						fieldIndex++;
					else {
						fieldIndex = 0;
						ingIndex++;
					}
					if (ingIndex < apps.length) {
						this.saveIngredient(dateEntity, apps);
					}
					else {
						
					}
				}
			});

	}
	
	
	
	
	this.saveIngredients = function(dateEntity, apps, func){
		
		
	}
	

	
	
this.saveApplication = function(pDate, pApps, func){
		dateEntity = pDate;
		escroIngredients = pApps;
		
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveApplication",
					name: dateEntity.note,
					day: dateEntity.day,
					month: dateEntity.month,
					year: dateEntity.year,
					email: email
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
					saveIngredients(func);
				}
		});

	}
	
	//sFields
	var escroIngredients;
	var dateEntity;
	var fieldIndex =0;
	var ingIndex = 0;
	//here
	function saveIngredients(func){
		var lField = fields[sFields[fieldIndex]];
		$.ajax({
			url: '/',
			type: 'POST',
			data: {
				action: "saveIngredient",
				application: dateEntity.note,
      			email: email,
			    field: lField.name,
	     		rate: escroIngredients[ingIndex].amount,
      			product:escroIngredients[ingIndex].productName,
      			acres:lField.acreage,
      			acre_units:escroIngredients[ingIndex].acreUnits,
      			cost:escroIngredients[ingIndex].price,
      			cost_units:escroIngredients[ingIndex].priceUnits,
      			crop_type:escroIngredients[ingIndex].cropType,
				type:escroIngredients[ingIndex].appType
			},
			error: function(xhr){
				if (xhr.status == 200) {
				
				}
			},
			success: function(){
				if (fieldIndex < sFields.length-1) {

					fieldIndex++;
				}
				else {
					fieldIndex = 0;
					ingIndex++;
				}
				if (ingIndex < escroIngredients.length) {
					saveIngredients(func);
				}
				else {
					func();
				}
			}
		});
	}
	
	this.deleteApplication = function(appName, func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "deleteApplication",
					name: appName
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
					func();
				}
		});
	}
	
	this.deleteField = function(fieldName, func){

		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "deleteField",
					name: fieldName
				},
				error: function(xhr){
					if (xhr.status == 200) {
						
					}
				},
				success: function(){
	
					func();
				}
		});
	}
	
		
	this.saveField = function(farm, fieldName, township, number, polyXML, func){
		$.ajax({
			url: '/',
			type: 'POST',
			data: {
				action: "saveField",
				name: fieldName,
				farmNumber: farm,
				township: township,
				section: number,
				polygon: polyXML
			},
			error: function(xhr){
				if (xhr.status == 200) {
				
				}
			},
			success: function(){
				func();
			}
		});
	}
	
	
	this.saveFarm = function(farm, email, func){
		$.ajax({
			url: '/',
			type: 'POST',
			data: {
				action: "saveFarm",
				farm_number: farm,
				email: email
			},
			error: function(xhr){
				if (xhr.status == 200) {
				
				}
			},
			success: function(){
				func();
			}
		});
	}
	
	
	
	
	
	
	
	
	
	//#data
	this.loadTownships = function(func){
		$.ajax({
		url: '/?action=get_county',
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = new ActiveXObject("Microsoft.XMLDOM")
        	doc.async="false"
			doc.loadXML(data);
			func();
		},
		error: function(xhr){
		
		}
	});
	}
	//#data
	this.loadSections = function(township, func){
		$.ajax({
		url: "/?action=getSections&parameter="+township.name,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = new ActiveXObject("Microsoft.XMLDOM")
        	doc.async="false"
			doc.loadXML(data);
			func(doc);
		},
		error: function(xhr){
		
		}
	});
	}
	

	
	
	/*
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
 */

	this.getForm2 = function(){
		
		
		get2('form28.xml', function(){
			var dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        		dataDoc.async="false";
				dataDoc.loadXML(dataText);
				
				display.showApplyForm();
				writeHTML("add_form", "<div id='add_form0'>"+dataText+"</div>");
				
				$("#acreage").text(display.getSelectedAcreage());
				
				for (var k=0; k<$("#add_form0").find("input[type=radio]").length; k++){		
					$("#add_form0").find("input[type=radio]:nth("+k+")").attr("name", "app_type0");
				}
				
				$("#add_form").find("span:nth(1)").html(sOptions);
				//writeHTML("product_select", sOptions);
				var index =1;
				$("input[name=app_type0]").click(function(){
					index=1;
					app_type = $("input[name='app_type0']:checked").attr("value");
					if (app_type=="seed")
						$("#add_form0").find("span:nth("+index+")").html(sOptions);
					else if (app_type=="treatment")
						$("#add_form0").find("span:nth("+index+")").html(tOptions);
					else if (app_type=="fertilizer")
						$("#add_form0").find("span:nth("+index+")").html(fOptions);
					else if (app_type=="chemical")
						$("#add_form0").find("span:nth("+index+")").html(cOptions);
				});
				$("#more").click(function(){
					index=0;
					$("#add_form0").append("<div id='add_form1'>"+appRadio+"</div>");
					$("#add_form1").find("span:nth("+index+")").html(sOptions);
					
					for (var k=0; k<$("#add_form1").find("input[type=radio]").length; k++){		
						$("#add_form1").find("input[type=radio]:nth("+k+")").attr("name", "app_type1");
					}
					
					$("input[name=app_type1]").click(function(){
						index=0;
						app_type = $("input[name='app_type1']:checked").attr("value");
						if (app_type=="seed")
							$("#add_form1").find("span:nth("+index+")").html(sOptions);
						else if (app_type=="treatment")
							$("#add_form1").find("span:nth("+index+")").html(tOptions);
						else if (app_type=="fertilizer")
							$("#add_form1").find("span:nth("+index+")").html(fOptions);
						else if (app_type=="chemical")
							$("#add_form1").find("span:nth("+index+")").html(cOptions);
					});
					
					
				});
				

		});
	}
	
	function get(url, func){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				dataText = data;
				func();
			}
		});
	}
	function get2(url, func){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				dataText = data;
				dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        		dataDoc.async="false";
				dataDoc.loadXML(dataText);;
				appRadio = $(dataDoc).find("select-app").text();
				formHeader = $(dataDoc).find("form-header").text();
				appDate = $(dataDoc).find("app-date").text();
				buttons = $(dataDoc).find("buttons").text();
				dataText = formHeader + appDate + appRadio + buttons;
				
				sOptions = $(dataDoc).find("seed-options").text();
				fOptions = $(dataDoc).find("fertilizer-options").text();
				tOptions = $(dataDoc).find("treatment-options").text();
				cOptions = $(dataDoc).find("chemical-options").text();
				
				func();
			}
		});
	}
	
	this.getSectionsFromFarm = function(farm){
		var rSections = [];
		var sectionsXML = $(dataDoc).find("farm[number="+farm+"]").find("section");
		$(sectionsXML).each(function(){
			var number = $(this).attr("section");
			var township = $(this).attr("township");
			var section = getSection(township, number);
			if (!sectionsContain(rSections,township, number)){
				rSections.push(section);
			}
		});
		return rSections;
	}
	
	function getSection(township, number){
		var rSection;
		for (var i=0; i<sections.length; i++){
			if (sections[i].number==number && sections[i].township==township){
				rSection = sections[i];
			}
		}
		return rSection;
	}
	
	this.getFieldsFromFarm = function(farm){
		var rFields = [];
		for (var i=0; i<fields.length; i++){
			if (fields[i].farm==farm){
				rFields.push(fields[i]);
			}
		}

		return rFields;
	}
	
	
	var sOptions;
	var fOptions;
	var tOptions;
	var cOptions;
	
	var appRadio;
	var formHeader;
	var appDate;
	var buttons;

	this.loadUser= function(func){
		get("/?action=getUser&email="+email, function(){
			dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        	dataDoc.async="false";
			dataDoc.loadXML(dataText);;
			func();
		});
	}
	
	function sectionsContain(sections, township, number){

		try {
			var rCondition = false;
			for (var i = 0; i < sections.length; i++) {
				if (township && sections[i].township == township && sections[i].number == number) {
					rCondition = true;
					break;
				}
			}
			return rCondition;
		}
		catch (e){

			return true;
		}
	}
	
	this.getFields=function(){
		var rFields = [];
	
		for (var i = 0; i < $(dataDoc).find("field").length; i++) {
			var fieldDoc = $(dataDoc).find("field:nth("+i+")");
			var cField = new Field();	
			cField.name = $(fieldDoc).attr("name");
			cField.cropType = "#827839";
			var cropType;
			try {
				var lIngredients = $(dataDoc).find("ingredient[field="+cField.name+"][type=seed]");
				if (lIngredients.length>0){
					var z = $(lIngredients).get(0);
					z = $(z).attr("crop_type");
					if (z=="Corn")
						cField.cropType = "#E56717";
					else if (z=="Soybeans")
						cField.cropType = "#FFFF00";
					else if (z=="Wheat")
						cField.cropType = "#4CC552";
					
				}
				
			}
			catch (e) {
				
			}
			cField.polygon = createPolygon($(fieldDoc).find("vertices"), cField.cropType);
			cField.acreage = cField.polygon.getArea()/4046.8252519;
			cField.farm = $(fieldDoc).parent().attr("number");
			rFields[i] = cField;
		}
		return rFields;
		
	}
	
	
	this.getFarms = function(){
		$("#farm_views").html("View Farm:<br/><span id='all_farms'>Show All</span><br/>");
		for (var i=0; i<$(dataDoc).find("farm").length; i++){
			farms[i] = $(dataDoc).find("farm:nth("+i+")").attr("number");
			$("#farm_views").append("<span id='"+farms[i]+"'>"+farms[i]+"</span>"+"<br/>");
			$("#"+farms[i]).click(function(){
				var farm = $(this).attr("id");
				var theseFields = data.getFieldsFromFarm(farm);
				display.showFields(theseFields);
				
				var farmSections = data.getSectionsFromFarm(farm);
				display.showSections(farmSections);
			});
			$("#all_farms").click(function(){
				display.showFields(fields);
				display.showSections(sections);
			});
		}
		return farms;
	}
	
							/*
					 * ingredient.application = self.request.get('application')
      ingredient.email = self.request.get('email')
      ingredient.field = self.request.get('field')
      ingredient.product = self.request.get('product')
      ingredient.acres = self.request.get('acres')
      ingredient.acre_units = self.request.get('acre_units')
      ingredient.cost = self.request.get('cost')
      ingredient.cost_units = self.request.get('cost_units')
      
	this.appType;
	this.productName;
	this.amount;
	this.acreUnits;
	this.priceUnits;
	this.price;
					 */
	
	this.getIngredients = function(){
		var rIngredients = [];
		$(dataDoc).find("ingredient").each(function(){
			var ingredient = new Application();
			
			ingredient.appType = $(this).attr("type");
			ingredient.cropType = $(this).attr("crop_type");
			ingredient.field = $(this).attr("field");
			ingredient.amount = $(this).attr("rate");
			ingredient.product = $(this).attr("product");
			ingredient.acres = $(this).attr("acres");
			ingredient.acreUnits = $(this).attr("acre_units");
			ingredient.price = $(this).attr("cost");
			ingredient.priceUnits = $(this).attr("cost_units");
			rIngredients.push(ingredient);
		});
		return rIngredients;
	}
	//!!
	this.getApplications = function(){
		var rApplications = [];
		$(dataDoc).find("application").each(function(){
			var dateEntity = new DateEntity();
			dateEntity.note = $(this).attr("name");
			dateEntity.day = $(this).attr("day");
			dateEntity.month = $(this).attr("month");
			dateEntity.year = $(this).attr("year");
			rApplications.push(dateEntity);
		});
		return rApplications;
		
	}
	
	this.getSections = function(){
		var rSections = [];
		for (var i=0; i<$(dataDoc).find("section").length; i++){
			var sectionDoc = $(dataDoc).find("section:nth("+i+")");
			var township = $(sectionDoc).attr("township");

			var section = $(sectionDoc).attr("section");
			
			if (!sectionsContain(rSections,township, section)){
				var cSection = new Section(); 
				cSection.township = township;
				cSection.number = section;
				cSection.polygon = createPolygon($(dataDoc).find("section:nth("+i+")"), "red");
				cSection.centerVertex = getCenter(cSection.polygon);
				rSections.push(cSection);
			}
			
			
		}
		pSections = rSections;
		return rSections;
	}
	
	
	var fertilizerForm;
	var seedForm;
	var chemicalForm;
	var treatmentForm;
	var formButtons;
	

}
var pSections = [];
//DATA-------------------------------------------------------------------------------------------
//***********************************************************************************************
//ENTITY DEFS-------------------------------------------------------------------------------------------

var Field = function(){
	this.name;
	this.farm;
	this.cropType;
	this.section;
	this.township;
	this.acreage;
	this.polygon;
}

var Section = function(){
	this.number;
	this.township;
	this.polygon;
	this.centerVertex;
}

var Township = function(){
	this.name;
	this.polygon;
}


var Application = function(){
	this.name;
	this.appType;
	this.productName;
	this.amount;
	this.acreUnits;
	this.priceUnits;
	this.price;
	this.cropType;
}

var DateEntity = function(){
	this.note;
	this.day;
	this.month;
	this.year;
}


//ENTITY DEFS-------------------------------------------------------------------------------------
//***********************************************************************************************
//INIT-------------------------------------------------------------------------------------------

function getCookie(val){
	var start = document.cookie.indexOf('email');
	var end=document.cookie.indexOf(";",start);
	if (end==-1) end=document.cookie.length;
	var str = document.cookie.substring(start,end);
	str = str.split("=")[1];
	return str;
}

function getQueryParam(){
	var qsParm = new Array();
	var query = window.location.search.substring(1);
	var parms = query.split('=');
	return parms[1];
}

function loadEvent(){
		email = getQueryParam();
		var cookieEmail = getCookie('email');
 		if (email==null || email==""){
			if (cookieEmail == null || cookieEmail == "none"){
				window.location = "signin.htm";
			}
			else {
				email = cookieEmail
				init();
			}
		}
		
 		else {
			init();
		}
	}

var farms;
var applications;
var ingredients;

function init(){

	$.ajaxSetup({ cache: false });
	
	

	
	$("#signout_button").click(function(){
		$.ajax({
			url: '/?action=signout&email='+email,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				window.location = "signin.htm";
			}
		});
		
	});
	
	data = new Data();
	display = new Display();
	display.addMap();
	initEventListeners();
	var map = display.getMap();
	data.loadUser(function(){
		
		
		
		
		GEvent.clearListeners(map, 'click');
		
		farms = [];
		pSections = [];
		fields = [];

		ingredients = data.getIngredients();
		display.showIngredients(ingredients);
		farms = data.getFarms();
		sections = data.getSections();
		applications = data.getApplications();
		display.showApplications(applications);	
		display.initSections(sections);	
		
		var fields = data.getFields();
		
		map.clearOverlays();
		display.initFields(fields);
		
		homeState();
		
	});
	
}

//INIT-------------------------------------------------------------------------------------
//***********************************************************************************************
//HOME STATE-------------------------------------------------------------------------------------------

function homeState(){
	
		write("message", "Please Select from the following:");	
		display.homeButtons();
}

var currentHighlightedSection = null;
function addFieldState(){
	$("#message").html("Please select a section left of the map or to select a new section click <span id='new_section'>here</span>");	
	
	//section_nav_item
	var sectionNavItems = $(".section_nav_item");
	var map = display.getMap();
	
	var i=-1;

		$(sectionNavItems).each(function(){
			
			$(this).click(function(){
				var index = $(sectionNavItems).index(this);
				if (currentHighlightedSection != null)
					map.removeOverlay(currentHighlightedSection);
				currentHighlightedSection = pSections[index].polygon;
				addFieldFirstVertexState(pSections[index]);
			});
			
		});

	
	$("#new_section").click(function(){
		selectTownshipState();
	});
	$("#new_section").click(function(){
		selectTownshipState();
	});
	display.showCancel();
	$("#cancel").click(function(){
		 cancelAddField();
	});
}

function cancelAddField(){
		var map = display.getMap();
		if (firstMarker)
			map.removeOverlay(firstMarker);
		for (var j=0; j<sections.length; j++){
			map.removeOverlay(sections[j].polygon);
		}
		for (var i = 0; i < marker.length; i++) {
			map.removeOverlay(marker[i]);
		}
		marker = [];
		if (line)
			map.removeOverlay(line);
		line = null;
		display.cleanupState();
		
		$("#cancel").unbind("click");
		homeState();
}


function selectSectionState(township){
	$("#message").html("Please wait.....");	
	data.loadSections(township, function(doc){
		var length = $(doc).find("section").length;		
		var townshipCenter = getCenter(township.polygon);
		var map = display.getMap();
		map.setCenter(townshipCenter, 12);
		var sections = [];
		
		for (var i=0; i<length; i++){
			var section = new Section();
			
			section.polygon = createPolygon($(doc).find("section:nth(" + i + ")"));
			section.number = $(doc).find("section:nth(" + i + ")").attr("number");
			section.township = township.name;
			var label = new ELabel(getLeft(section.polygon), section.number, "label_style");
			label.pixelOffset=new GSize(6,6);
			map.addOverlay(label);			
			map.addOverlay(section.polygon);
			currentHighlightedSection = section.polygon;
			sections[i] = section;
		}
		
		GEvent.addListener(map, 'click', function(overlay, verts){
				
				for (var i = 0; i < sections.length; i++) {
					if (overlay==sections[i].polygon){
						GEvent.clearListeners(map, "click");
						for (var j=0; j<sections.length; j++){
							map.removeOverlay(sections[j].polygon);
						}
						addFieldFirstVertexState(sections[i]);
					}
				}
			});
		
		
		$("#message").html("Select a section");
	});
}
var firstMarker;

function addFieldFirstVertexState(section){
	var sectionCenter = getCenter(section.polygon);
	
	gSection = section;
	var map = display.getMap();
	map.addOverlay(section.polygon);
	map.setCenter(sectionCenter, 14);
	$("#message").html("Click on a corner of your new field.");	
	
	GEvent.addListener(map, 'click', function(overlay, dunno, latlng){
			if (overlay == section.polygon) {
				firstMarker = new GMarker(latlng, {
					icon: icon,
					draggable: false
				});
				map.addOverlay(firstMarker);
				addFieldVerticesState(section);
			}
		});
}
var gSection;

var secondMarker;
function addFieldVerticesState(section){
	var map = display.getMap();
	write("message", "Cick the opposite corner of the field.");
	GEvent.clearListeners(map, 'click');
	GEvent.addListener(map, 'click', function(overlay, dunno, latlng){

			if (overlay == section.polygon) {

				secondMarker = new GMarker(latlng, {
					icon: icon,
					draggable: false
				});

				map.addOverlay(secondMarker);
				addRectangleToMap();
				GEvent.clearListeners(map, 'click');
				moveFieldVertexState();
			}
		});
}

function disableMarkers(){
	for (var i=0; i<marker.length; i++){
		marker[i].disableDragging();
	}
}
function moveFieldVertexState(){
	var map = display.getMap();
	$("#message").html("Move pegs around or click peg to add more <br/>Total Acreage:<span id='acres_selected'></span> <span id='save_field2'>Save Field</span>");	
	listenToMarkerDrags();
	GEvent.addListener(map, 'click', function(overlay){
		for (var i=0; i<marker.length; i++){
			if (overlay == marker[i]){
				blueI = i;
				GEvent.clearListeners(map, 'click');
				GEvent.clearListeners(map, 'drag');
				turnBlue(i);
				disableMarkers();
				addFieldVertexState();
			}
		}	
	});
	$("#save_field2").click(function(){
		GEvent.clearListeners(map, 'click');
		GEvent.clearListeners(map, 'drag');
		disableMarkers();
		saveFieldFormState();
	});
	
}
//##
function saveFieldFormState(){
	
	
	show("save_field_form");
	var map = display.getMap();

	hide("new_farm_text");
	var val = "current_farm";

	hide("cancel");
	write("message", "Please fill out form provided.");	

	var farmOptionHTML = "";

	farmOptionHTML += 'Farm Id:<select name="farm_select">';

	for (var i=0; i<farms.length; i++){
		farmOptionHTML += '<option value="'+farms[i]+'">'+farms[i]+'</option>';
	}


	farmOptionHTML += '</select>';

	$("#current_farm_select").html(farmOptionHTML);

	$("input[name=farm_save_option]").click(function(){
		val = $("input[name]:checked").attr("value");
		if (val=="new_farm"){
			hide("current_farm_select");
			show("new_farm_text");
		}
		else if (val=="current_farm"){
			show("current_farm_select");
			hide("new_farm_text");
		}
	});
	
	$("#cancel_field_form").click(function(){
			hide("save_field_form");
		 	$("#save_field_form_confirm").unbind("click");
			cancelAddField();
		});
	
	$("#save_field_form_confirm").click(function(){
		var farm;
		
		if (val == "new_farm") {
			farm = $("input[id=new_farm_id]").attr("value");
			//	this.saveFarm = function(farm, email, func){
			data.saveFarm(farm, email, function(){
				saveField(farm);
			});
			
		}
		else {
			farm = $("select[name=farm_select]").attr("value");
			saveField(farm);
		}
	});
	
}
function saveField(farm){
		var fieldName = $("input[name=new_field_name]").attr("value");
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
		
		data.saveField(farm, fieldName, gSection.township, gSection.number, polyXML, function(){
			GEvent.clearListeners(map, "click") ;
			marker=[];
			point=[];
			$("#save_field_form_confirm").unbind("click");
			hide("save_field_form");

			init();
		});
}


function addFieldVertexState(){
	var map = display.getMap();
	write("message", "Click a peg adjacent to the blue peg");
	GEvent.addListener(map, 'click', function(overlay){
		
		for (var i=0; i<marker.length; i++){
			
			if (overlay == marker[i]){

				if (Math.abs(i-blueI)==1 || Math.abs(i-blueI)==(marker.length-1)){
					var newPoint = midPoint(marker[i], marker[blueI]);
					var newMarker = new GMarker(newPoint, {
						icon: icon,
						draggable: true
							});
					addMarker(newMarker, i, blueI);
					moveFieldVertexState();
				}
				else if (i==blueI){
					deleteMarker(i);
					moveFieldVertexState();
				}
				
			}
		}
	});
}
function addMarker(newMarker, i1, i2){

	var map = display.getMap();
	
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
		if (blueI == highI){

			blueI++;
		}
	}
	else {
		highI++;
	}
	marker[highI]=newMarker;
	map.addOverlay(newMarker);
	
	turnRed(blueI);
	GEvent.clearListeners(map, 'click');
	
	GEvent.addListener(marker[lowI], 'drag', function(){
			draw2()
		});
		GEvent.addListener(marker[highI], 'drag', function(){
			draw2()
		});
	
	bluePointListener();
	draw2();
	
}

//#state
function selectTownshipState(){
	$("#message").html("Please wait.....");	
	data.loadTownships(function(){
		var doc = data.response();
		var length = $(doc).find("township").length;
		
		var county = $(doc).find("county");
		var poly = createPolygon(county);
		var countyCenter = getCenter(poly);
		var map = display.getMap();
		map.setCenter(countyCenter, 9);
		var townships = [];
		
		for (var i=0; i<length; i++){
			var township = new Township();
			township.polygon = createPolygon($(doc).find("township:nth(" + i + ")"));
			township.name = $(doc).find("township:nth(" + i + ")").attr("name");
			var label = new ELabel(getLeft(township.polygon), township.name, "label_style");
			label.pixelOffset=new GSize(0,6);
			map.addOverlay(label);			
			map.addOverlay(township.polygon);
			townships[i] = township;
		}
		GEvent.addListener(map, 'click', function(overlay, verts){
				
				for (var i = 0; i < townships.length; i++) {
					if (overlay==townships[i].polygon){
						GEvent.clearListeners(map, "click");
						for (var j=0; j<townships.length; j++){
							map.removeOverlay(townships[j].polygon);
						}
						selectSectionState(townships[i]);
					}
				}
			});
		
		$("#message").html("Select a township");	
	});
	
	
}







//###
function deleteFieldState(){

	var map = display.getMap();
	write("message", "Please select a field to delete");	
	GEvent.clearListeners(map, "click") ;
	display.showCancel();
	
	$("#cancel").click(function(){
		GEvent.clearListeners(map, "click") ;
		$(".app_class").unbind("click");
		$("#cancel").unbind("click");
		homeState();
	});
	
	GEvent.addListener(map, 'click', function(overlay, verts){

		for (var i=0; i<fields.length; i++){
			if (overlay==fields[i].polygon){

				data.deleteField(fields[i].name, function(){

					init();
				});
			}
		}

	});
	$(".app_class").click(function(){
		var index = $(".app_class").index(this);
		var application = applications[index];
		data.deleteApplication(application.note, function(){
			init();
		});
	});

	
}


function applyState(){
	writeHTML("message", "Please select the fields where you would like to schedule an application");	
	display.fieldListener();
	     
	
	
	display.showCancel();
	$("#cancel").click(function() {
		display.cleanupFieldSelector();
		display.cleanupState();
		homeState();  
	});
	$("#done").click(function() {
		display.removeListeners();
		display.cleanupState();
		applyFormState();
	});
}
function applyFormState() {
	display.showApplicationForm();
	//data.getForm();
	write("message", "Please fill out the form provided");	

}

function appConfirmState(){
	write("message", "Your application has been saved!");
	init();
}

//**********************************************************************
//VARIABLES
var fieldNames = [];
var fieldAcreages = [];
var cropTypes = [];
var acreages = [];
var globalI =0;

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
function createPolygon(vertices, cropType){
	

	
	
	var length = $(vertices).find("vertex").length;


	var pts = [];
	for (var i = 0; i < length; i++) {
		pts[i] = new GLatLng($(vertices).find("vertex:nth(" + i + ")").attr("lat"), $(vertices).find("vertex:nth(" + i + ")").attr("lng"));
	}	
	
	var poly = new GPolygon(pts,"#000000",1.5,1.0,cropType,0.4,{clickable:true});
	//acreages[globalI]=poly.getArea()/4046.8252519;
	return poly;
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

function getLeft(polygon){
	var eastLng = polygon.getBounds().getNorthEast().lng();
	var westLng = polygon.getBounds().getSouthWest().lng();		
	var northLat = polygon.getBounds().getNorthEast().lat();
	var southLat = polygon.getBounds().getSouthWest().lat();
	var lat = southLat+(northLat-southLat)/2;
	var lng = westLng;
	return new GLatLng(lat, lng);
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
	var map = display.getMap();

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
		marker[n].disableDragging();
	};//for
	
	
	
	
	poly=[];
	//show("save_field");
	
	draw2();
	
}

function listenToMarkerDrags(){
	var map = display.getMap();
	for (var n = 0; n < marker.length; n++) {
		marker[n].enableDragging();
		GEvent.addListener(marker[n], 'drag', function(){
			draw2()
		});
	}
	bluePointListener();
}



function bluePointListener(){
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
				var map = display.getMap();
				var point = marker[index].getPoint();
				map.removeOverlay(marker[index]);
				marker[index] = new GMarker(point, {
						icon: icon2,
						draggable: true
							});
				map.addOverlay(marker[index]);
}
function turnRed(index){	
				var map = display.getMap();
				var point = marker[index].getPoint();
				map.removeOverlay(marker[index]);
				marker[index] = new GMarker(point, {
						icon: icon,
						draggable: true
							});
				map.addOverlay(marker[index]);
}






function deleteMarker(index){
	var map = display.getMap();
	map.removeOverlay(marker[index]);
	for (var i=index; i<marker.length; i++){
		marker[i]=marker[i+1];
	}
	marker.length=marker.length-1;
	GEvent.clearListeners(map, 'click');
	draw2();
	moveFieldVertexState();
	
}



function midPoint(point1, point2){

	
	westPoint = Math.min(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));

	eastPoint = Math.max(point1.getPoint().lat(), Math.max(point2.getPoint().lat()));

	southPoint = Math.min(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));

	northPoint = Math.max(point1.getPoint().lng(), Math.max(point2.getPoint().lng()));

	return new GLatLng(westPoint+(eastPoint-westPoint)/2, southPoint+(northPoint-southPoint)/2);
}


function saveField3(){
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
					creator: email,
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
	
	$("#add").click(function() {
		display.cleanupState();
		addFieldState();
	});
	$("#apply").click(function() {
		display.cleanupState();
		applyState();
	});
	$("#delete").click(function() {
		display.cleanupState();
		deleteFieldState();
	});

	
	/*
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
					 
					
					
					if (fieldPolys[i].color=="blue"){
						fieldPolys[i].color="lime";
						selectedFields.pop(i);
					}
					else {
						fieldPolys[i].color="blue";
						selectedFields.push(i);
					}
					
					
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

	*/
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
	loadUserInfo(email);
	
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
var email=null;

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
var map = display.getMap();
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
$("#acres_selected").text(Math.floor(100*line.getArea()/4046.8252519)/100);
};
//Math.floor(sAcreage*100)/100;
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

