var FilterForm = function(func){
	var filterDoc;
	
	$.ajax({
				url: "form.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					filterDoc = textToDoc(data);
					$("#window_under_map").html($(filterDoc).find("map-nav").text());
					if (func) func();
				}
	});
	
	
	
	var optionItemHTML = '';
	
	var selectedFarmIndex;
	var selectedSectionIndex;
	var selectedCropIndex=-1;
	var farmOptions;
	var fieldOptions;
	var sectionOptions;
	var cropOptions;
	
	function enableCropListeners(){
		
		$("input[name=map_crop_radio]").click(function(){			
			selectedCropIndex = $(this).attr("value");
			if (selectedCropIndex == "all") {
				fieldOptions = fieldCache.getFieldsByFarm(farmOptions[selectedFarmIndex]);
				mapDisplay.showFields(fieldOptions);
				sectionOptions = fieldCache.getAllSections();
				filterForm.displaySections(sectionOptions);
			}
			else {
				fieldOptions = fieldCache.getFieldsByCrop(cropOptions[selectedCropIndex], farmOptions[selectedFarmIndex]);
				mapDisplay.showFields(fieldOptions);
				sectionOptions = fieldCache.getAllSections();
				filterForm.displaySections(sectionOptions);
				if (customListener){
					currentManager.handleCropSelect(cropOptions[selectedCropIndex]);
				}
			}
		});
		
	}
	
	function enableFarmListeners(){
		$("input[name=map_farm_radio]").click(function(){
				var index = $(this).attr("value");
				selectedFarmIndex = index;
				fieldOptions = fieldCache.getFieldsByFarm(farmOptions[index]);
				mapDisplay.showFields(fieldOptions);
				sectionOptions = fieldCache.getAllSections();
				filterForm.displaySections(sectionOptions);
				
				filterForm.displayCrops(fieldOptions);
				if (customListener){
					currentManager.handleFarmSelect(farmOptions[index]);
				}
		});
	}
	function enableSectionListeners(){
		$("input[name=map_section_radio]").click(function(){
			var index = $(this).attr("value");
			selectedSectionIndex = index;
			if (index=="all_sections"){
				selectedSectionIndex=null;
				if (selectedFarmIndex) {
					fieldOptions = fieldCache.getFieldsByFarm(farmOptions[selectedFarmIndex]);
				}
				else {
					fieldOptions = fieldCache.getAllFields();
				}
				fieldOptions = filterByCrop(fieldOptions);
				mapDisplay.showFields(fieldOptions);
				$("#total_acreage").text(mapDisplay.getTotalAcreage());
			}
			else {
				selectedSectionIndex=index;
				fieldOptions = fieldCache.getFieldsBySection(farmOptions[selectedFarmIndex], sectionOptions[index]);
				fieldOptions = filterByCrop(fieldOptions);
				mapDisplay.showFields(fieldOptions, true);
				$("#total_acreage").text(mapDisplay.getTotalAcreage());
				if (customListener){
					currentManager.handleSectionSelect(sectionOptions[index]);
				}
			}
		});
		$("#total_acreage").text(mapDisplay.getTotalAcreage());
	}
	
	this.enableListeners = function(){

	}
	
	
	function filterByCrop(fieldOptions){
		var rFieldOptions = [];
		if (cropOptions.length==0|| selectedCropIndex == -1 || cropOptions[selectedCropIndex]=="all"){
			rFieldOptions = fieldOptions;
		}
		else {
			
			$.each(fieldOptions, function(){
				if (this.crop == cropOptions[selectedCropIndex]){
					rFieldOptions.push(this);
				}
			});
			fieldOptions = rFieldOptions;
		}
		return rFieldOptions;
	}
	
	
	//*********************************************
	var selectedFarmIndex;
	var selectedSectionIndex;
	var selectedCropIndex=-1;
	var farmOptions;
	var fieldOptions;
	var sectionOptions;
	var cropOptions;
	
	this.displayOptions = function(fields){
		//filter out farms and display
		//filter out sections and display
		//filter out crops and display
		//enable listeners
	}
	//*********************************************
	
	
	
	this.displayCrops = function(fields){
		
		cropOptions = [];
		$("#map_crop_options").empty();
		if (hasCrop("corn", fields)){
			var newDoc = $('<span class="input_span"><input type=radio name="map_crop_radio" value="'+cropOptions.length+'"><span class="label">Corn</span></input></span><br/>');
			cropOptions.push("corn");
			$("#map_crop_options").append(newDoc);
		}
		if (hasCrop("soybean", fields)){
			var newDoc = $('<span class="input_span"><input type=radio name="map_crop_radio" value="'+cropOptions.length+'"><span class="label">Soybean</span></input></span><br/>');
			cropOptions.push("soybean");
			$("#map_crop_options").append(newDoc);
		}
		if (hasCrop("wheat", fields)){
			var newDoc = $('<span class="input_span"><input type=radio name="map_crop_radio" value="'+cropOptions.length+'"><span class="label">Wheat</span></input></span><br/>');
			cropOptions.push("wheat");
			$("#map_crop_options").append(newDoc);
		}
		if (hasCrop("none", fields)){
			var newDoc = $('<span class="input_span"><input type=radio name="map_crop_radio" value="'+cropOptions.length+'"><span class="label">Unplanted</span></input></span><br/>');
			cropOptions.push("none");
			$("#map_crop_options").append(newDoc);
		}
		enableCropListeners();
	}
	
	this.displayFarms = function(farms){
		farmOptions = farms;
		$.each(farms, function(index){
			if (this && this != undefined && this != "undefined") {
				var newDoc = $('<span class="input_span"><input type=radio name="map_farm_radio" value="' + index + '"><span class="label">' + this + '</span></input></span><br/>');
				$("#map_farm_options").append(newDoc);
			}
		});
		enableFarmListeners();
	}
	
	var sectionOptions;
	this.displaySections = function(sections){
		sectionOptions = sections;
		$("#map_section_options").html("");
		$.each(sections, function(index){
			//if (this.north && this.north != undefined) {
				var newDoc = $('<span class="input_span"><input type=radio name="map_section_radio" value="' + index + '"><span class="label">' + this.getLabel() + '</span></input></span><br/>');
				$("#map_section_options").append(newDoc);
			//}
		});
		enableSectionListeners();
	}
	this.enableCustomListener = function(){
		customListener = true;
	}
	this.disableCustomListener = function(){
		customListener = false;
	}
	var customListener = false;
}
