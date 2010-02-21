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
