//EDITMAPMANAGER
var EditMapManager2 = function(){
	
	var entity = new Field();
	var formDoc;
	var buttons = [];
	
	var cancelButton = new Button();
		cancelButton.name="cancel_edit_map";
		cancelButton.url="images/cancel_button1.png";
		cancelButton.action = function(){
			currentManager = new HomeManager();
			currentManager.run();
		}
	var addButton = new Button();
		addButton.name="add_field";
		addButton.url="images/add_button1.png";
		addButton.action = function(){
			addAction();
		}

	this.refresh = function(func){
		mapDisplay = new MapDisplay();
		mapDisplay.removePegs();
		fieldCache = new FieldCache(user.email, function(){
			var fields = fieldCache.getAllFields();
			mapDisplay.showFields(fields);
			var farms = fieldCache.getAllFarms();
			mapDisplay.setFarms(farms);
			var sections = fieldCache.getAllSections();
			mapDisplay.setSections(sections);
			filterForm = new FilterForm(function(){
				filterForm.displayCrops(fields);
				filterForm.displayFarms(farms);
				filterForm.displaySections(sections);
				filterForm.enableListeners();
				func();
			});
		});
	}

	this.run = function(){
		
		
		$.ajax({
			url: "field.xml",
			type: 'GET',
			dataType: 'html',
			success: function(data){
				formDoc = textToDoc(data);	
				//cache.codeFrags.sectionSelectorForm = $(data).find("section-selection-form").text();
				//cache.codeFrags.newFieldForm = $(data).find("new-field-form").text();
				addAction();
			}
		});

	
	}

function fieldMenuAction(){
			
		
		$("#form_box").html("Choose what to do");
		$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="handleCancel()">');
		$("#form_box").append('<img id="next" src="buttons/next.png"');
		
		$("#next").click(function(){
			addAction();
		});
}

this.handleFarmSelect = function(farm){
			entity.farm = farm;
			$("input[name=farm]").attr("value", farm);
		}

this.handleSectionSelect = function(section){
			entity.north = section.north;
			entity.west = section.west;
			entity.section = section.number;
			$("input[name=number]").attr("value", entity.section);
			$("input[name=north]").attr("value", entity.north);
			$("input[name=west]").attr("value", entity.west);
		}

function addAction(){
		$("#form_title").html("Edit Map");
		buttons = [];
		buttons.push(cancelButton);
		buttonDisplay.render(buttons);
		$("#form_box").html($(formDoc).find("section-selection-form").text());
		filterForm.enableCustomListener();
		//mapDisplay.loadSectionOptions();
	
				//listeners
		$("#next").click(function(){
			

		

			var numberInput = $("#section_selection_form").find("input[name=number]").attr("value");
			var northInput = $("#section_selection_form").find("input[name=north]").attr("value");
			var westInput = $("#section_selection_form").find("input[name=west]").attr("value");
			
			selectedSectionObj = new Section();
			selectedSectionObj.north = northInput;
			selectedSectionObj.west = westInput;
			selectedSectionObj.number = numberInput;
			
			$("#form_info").removeClass("hide");
			$("#form_info").html("<b>Farm:</b>"+entity.farm);
			$("#form_info").append("<br/><b>Section:</b>"+selectedSectionObj.getLabel());
			
			var fields = fieldCache.getFieldsBySection(entity.farm, selectedSectionObj);
			mapDisplay.showFields(fields);
			cache.getSection(numberInput, northInput, westInput, function(data){
				mapDisplay.showSection(data);
				addFirstPegAction();
			});
		});


	}
	
	function cancelListener(){
		$("#cancel").click(function(){
			mapDisplay.clearMap();
			currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
			});
		});
	}
	
	function addFirstPegAction(){
		$("#form_box").html("Please click the map on a corner of the new field. <img id='cancel' src='buttons/cancel.png'>");
		mapDisplay.addFirstPegListener(function(){
			addSecondPegAction();
		});
		cancelListener();
	}
	
	function addSecondPegAction(){
		$("#form_box").html("Please click the opposing corner of the new field <img id='cancel' src='buttons/cancel.png'>");
		mapDisplay.addSecondPegListener(function(){
			addNewFieldVerticesAction();
		});
		cancelListener();
	}
	
	function addNewFieldVerticesAction(){
		$("#form_box").html("Move pegs Around, and click adjecent pegs to add a new peg, delete peg by clicking it twice. <br/><img id='cancel' src='buttons/cancel.png'><img id='next' src='buttons/next.png' />");
		
		//listen for field edits....
		mapDisplay.addPegMoveListener(function(){
			addNewPegAction();
		});
		//listen for submit
		$("#next").click(function(){
			mapDisplay.removePegs();
			addFieldFormAction();
		});
		cancelListener();
		
	}
	
	
	//here
	function addFieldFormAction(){
		$("#form_box").html($(formDoc).find("new-field-form").text());
		$("#form_info").append("<br/><b>Acreage:</b>"+mapDisplay.newFieldAcreage);
		$("#next").click(function(){
			var newField = new Field();
			entity.name = $("#new_field_form").find("input[name=field_name_input]").attr("value");
			entity.polygon = mapDisplay.getNewFieldText();
			entity.acreage = mapDisplay.newFieldAcreage;
			entity.cornYield = $("#new_field_form").find("input[name=corn_avg_input]").attr("value");
			entity.wheatYield = $("#new_field_form").find("input[name=wheat_avg_input]").attr("value");
			entity.soybeanYield = $("#new_field_form").find("input[name=soybean_avg_input]").attr("value");
			finalSummaryAction();
		});
		cancelListener();
	}
	
		function addNewPegAction(){
		mapDisplay.addNewPegListener(function(){
			addNewFieldVerticesAction();
		});
		cancelListener();
	}
	
	function finalSummaryAction(){
		$("#form_box").html("Review details and save.<br/><img id='cancel' src='buttons/cancel.png'><img id='next' src='buttons/next.png' />");
		
		$("#form_info").append("<br/><b>Name:</b>"+entity.name);
		$("#form_info").append("<br/><b>Corn Yield:</b>"+entity.cornYield);
		$("#form_info").append("<br/><b>Wheat Yield:</b>"+entity.wheatYield);
		$("#form_info").append("<br/><b>Soybean Yield:</b>"+entity.soybeanYield);
		
		$("#next").click(function(){
			entity.save(function(){
				currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
				});
			});
		});
		cancelListener();
	}
	
	
	var selectedSectionObj;
	
	
}


	



	

	
	

	
	
	
//END EDITMAPMANAGER


var FieldCache = function(pEmail, func){
	var doc;
	var farms = [];
	var sections = [];
	//UNIVERSAL AJAX GET
	$.ajax({
		url: "/?action=getfields&email="+pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.initComposites = function(){
		this.getAllFields();
	}
	
	this.fields;
	this.farms;
	this.sections;
	
	this.getAllFields = function(){
		var rFields = [];
		$(doc).find("field").each(function(){
			var field = docToField(this);			
			rFields.push(field);
			if (!inArray(farms, field.farm)){
				farms.push(field.farm);
			}
			
			if (!inSections(sections, field)){
				var section = new Section();
				section.north = field.north;
				section.west = field.west;
				section.number = field.section;
				sections.push(section);
			}
			
			
		});
		this.fields = rFields;
		this.farms = farms;
		this.sections = sections;
		return rFields;
	}
	
	this.getFieldsByCrop = function(crop, farm){
		
		var farmQuery = "";
		if (farm){
			farmQuery='[farm="+farm+"]';
		}
		var rFields = [];
		sections = [];
		if (crop == "none") {
			var fields = this.getFieldsByFarm(farm);
			$(fields).each(function(){
				if (!plantCache.isPlanted(this))
					rFields.push(this);
			});
		}
		else {
			var fieldNames = plantCache.getFieldNamesByCrop(crop);
			$.each(fieldNames, function(){
				var field = fieldCache.getFieldByName(this, farm);
				if (field) {
					rFields.push(field);
					if (!inSections(sections, field)) {
						sections.push(fieldToSection(field));
					}
				}
			});
		}
		return rFields;
	}
	
	this.getFieldByName = function(fieldName, farm){
		var farmQuery = getFarmQuery(farm);
		var rField = $(doc).find("field[name="+fieldName+"]"+farmQuery);
		if (rField) {
			rField = docToField(rField);
			return rField;
		}
		else return null;
	}
	
	this.getFieldsByFarm = function(farm){
		var rFields = [];
		sections = [];
		var farmQuery = getFarmQuery(farm);
		$(doc).find("field"+farmQuery).each(function(i){
			var field = docToField(this);
			rFields.push(field);	
			if (!inSections(sections, field)){
				sections.push(fieldToSection(field));
			}
		});
		return rFields;
	}
	
	this.getFieldsBySection = function(farm, section){
		var rFields = [];
		var farmQuery = getFarmQuery(farm);
		$(doc).find("field"+farmQuery+"[north="+section.north+"][west="+section.west+"][section="+section.number+"]").each(function(i){
			var field = docToField(this);
			rFields.push(field);
		});
		return rFields;
	}
	
	this.getSectionsByFields = function(fields){
		
	}
	
	
	this.getAllSections = function(){
		return sections;
	}
	this.getAllFarms = function(){
		return farms;
	}
}

function inArray(array, value){
	var rVal = false;
	$.each(array, function(){
		if (this==value){
			rVal = true;
		}

	});
	return rVal;
}

function inSections(sections, value){
	var rVal = false;
	$.each(sections, function(){
		if (this.north == value.north && this.west==value.west && this.number==value.section){
			rVal = true;
		}
	});
	return rVal;
}
function fieldToSection(field){
	var rSection = new Section();
	rSection.north = field.north;
	rSection.west = field.west;
	rSection.number = field.section;
	return rSection;
}

function docToField(fieldDoc){
	var field = new Field();
	field.north = $(fieldDoc).attr("north");
	field.west = $(fieldDoc).attr("west");
	field.farm = $(fieldDoc).attr("farm");
	field.section = $(fieldDoc).attr("section");
	field.name = $(fieldDoc).attr("name");
	field.crop = plantCache.getCrop(field.name);

	
	field.isHarvested = harvestCache.isHarvested(field);
	field.polygon = createPolygon($(fieldDoc).find("vertex"), field.crop, field.isHarvested);
	field.cornYield = parseInt($(fieldDoc).attr("corn_yield"));
	field.wheatYield = parseInt($(fieldDoc).attr("wheat_yield"));
	field.soybeanYield = parseInt($(fieldDoc).attr("soybean_yield"));
	field.acreage = (Math.floor(100*field.polygon.getArea()/4046.8252519)/100);
	if (!field.cornYield){
		field.cornYield = 132;
	}
	if (!field.soybeanYield){
		field.soybeanYield = 35;
	}
	if (!field.wheatYield){
		field.wheatYield = 50;
	}
	return field;
}
function getFarmQuery(farm){
	var rVal = "";
	if (farm){
		rVal='[farm='+farm+']';
	}
	return rVal;
}


var Field = function() {
	this.name;
	this.farm;
	this.north;
	this.west;
	this.section;
	this.polygon;
	this.acreage;
	this.isHarvested;
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





