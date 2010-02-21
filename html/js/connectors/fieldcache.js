	function buildQuery(name, value){
		var rVal = "";
		if (value) {
			rVal = "[" + name + "=" + value + "]";
		}
		return rVal;
	}



function FieldCache(){
	//FIELDS
	var fields;
	var fieldsDoc;
	var filteredFields;
	var reloadFields = true;
	this.getFields = function(query, func){

		var rVals = [];
		
		var farmQuery = buildQuery("farm", query.farm);
		var sectionQuery = buildQuery("section", query.section);
		var cropQuery = buildQuery("crop", query.crop);
		
		
		//look up fields from db if dirty 
		if (reloadFields) {
			fieldsFlag = false;
			get("getfields", "email=" + email, "Getting Fields", function(result){
				fields = textToDoc(result);
				fieldsDoc = fields;
				filteredFields = $(fields).find("field" + farmQuery + sectionQuery + cropQuery);
				rVals = loadArray(docToField, filteredFields);
				func(rVals);
			});
		}
		else {
			filteredFields = query(fields);
			rVals = loadArray(docToField, filteredFields);
			func(rVals);
		}
		
	}
	this.getPlantedBushels = function(name, crop){
		var field = this.getField(name);
		return field.getYield(crop)*field.acreage;
	}
	
	
	this.getField = function(name){
		var fieldDoc = $(fieldsDoc).find("field[name="+name+"]");
		return docToField(fieldDoc);
	}
	
	
	var farms;
	var reloadFarms = true;
	this.getFarms = function(){
		if (reloadFarms) {
			farms = [];
			$.each(fields, function(){
				if (!inArray(farms, field.farm)) {
					farms.push(field.farm);
				}
			});
			return farms
		}
		else {
			return farms;
		}
	}
	
	var sections;
	var filteredSections;
	var reloadSections = true;
	
	
	
	
	this.getSections = function(farm){
	
		if (reloadSections) {
			sections = [];
			if (!inSections(sections, field)) {
				var section = new Section();
				section.north = field.north;
				section.west = field.west;
				section.number = field.section;
				sections.push(section);
			}
		}
	}
	
	var sectionsDoc = null;
	this.getSection = function(pSection, func){
		var north = pSection.n;
		var def = pSection;
		var abc = "abc";
		if (sectionsDoc == null) {
			$.ajax({
				url: "counties.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					sectionsDoc = textToDoc(data);
					var sectionIndex = parseInt(def.s)-1;
					var section = $(sectionsDoc).find("township[north="+def.n+"][west="+def.w+"]").find("section:nth("+sectionIndex+")");
					section = docToSection(section);
					func(section);
				}
			});
		}
		else {
			var sectionIndex = parseInt(def.s)-1;
			var section = $(sectionsDoc).find("township[north="+pSection.n+"][west="+pSection.w+"]").find("section:nth("+sectionIndex+")");
			section = docToSection(section);
			func(section);
		}
	}
	
	
	this.getCrops = function(farm, section){
	
	}
}