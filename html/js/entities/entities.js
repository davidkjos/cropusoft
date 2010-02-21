//ENTITIES*********************************
var InsuranceEntity = function(){
	
	
	
	this.farm;
	this.crop;
	this.north;
	this.section;
	this.west;
	this.yield;
	this.price;
	this.percentage;
	this.acreage;
	this.premium;
	this.fields = [];
	
	this.getSectionLabel = function(){
		return this.section+"-N"+this.north+"-W"+this.west;
	}
	
	this.getGuaranteedAmount = function(){
		var val = truncate(this.price * this.yield * this.acreage * this.percentage / 100);
		val = addCommas(val);
		return val;
	}
	
	this.getFields = function(){
		var rVal = "";
		$.each(this.fields, function(){
			rVal += "<field name='"+this+"' />";
		});
		return rVal;
	}
	
	
	this.getInsuranceString = function(){
		return "<insurance"+
		" farm='"+this.farm+
		"' north='"+this.north+
		"' west='"+this.west+
		"' section='"+this.section+
		"' crop='"+this.crop+
		"' yield='"+this.yield+
		"' price='"+this.price+
		"' acreage='"+this.acreage+
		"' percentage='"+this.percentage+
		"' premium='"+this.premium+
		"' >"+
		"<fields>"+this.getFields()+"</fields>"+
		"</insurance>";
	}
	
	
}

function docToInsurance(itemDoc){
		var entity = new InsuranceEntity();
		entity.crop = $(itemDoc).attr("crop");
		entity.north = $(itemDoc).attr("north");
		entity.west = $(itemDoc).attr("west");
		entity.section = $(itemDoc).attr("section");
		entity.yield = $(itemDoc).attr("yield");
		entity.price = $(itemDoc).attr("price");
		entity.percentage = $(itemDoc).attr("percentage");
		if (!entity.percentage)
			entity.percentage = 65;
		entity.premium = $(itemDoc).attr("premium");
		entity.acreage = $(itemDoc).attr("acreage");
		return entity;
	}



var ChemicalEntity = function(){
	this.fields = [];
	this.date;
	this.amountPerAcre;
	this.description;
	this.product;
	this.total;
	
	this.chemicalString = function(){
		var rString = "";
		rString = "<chemical "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' total='" + this.total +
			"' product='" + this.product +
			"' >"+
			this.getFields()+
			"</chemical>";
		return rString;
	}
	this.getFields = function(){
		var rString = "";
		rString += "<fields>";
		$.each(this.fields, function(){
			rString += "<field name='"+this.name+"' />";
		});
		rString += "</fields>";
		return rString;
	}
	
}
	function docToChemical(itemDoc){
		var item = new ChemicalEntity();
		item.product = $(itemDoc).attr("product");
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = $(itemDoc).attr("total");
		item.description = $(itemDoc).attr("description");
		return item;
	}

var FertilizerEntity = function(){
	this.fields = [];
	this.date;
	this.amountPerAcre;
	this.description;
	this.product;
	this.total;
	
	this.fertilizeString = function(){
		var rString = "";
		rString = "<fertilize "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' total='" + this.total +
			"' product='" + this.product +
			"' >"+
			"<fields>"+this.getFields()+"</fields>"+
			"</fertilize>";
		return rString;
	}
	this.getFields = function(){
		var rString = "";
		rString += "<fields>";
		$.each(this.fields, function(){
			rString += "<field name='"+this.name+"' />";
		});
		rString += "</fields>";
		return rString;
	}
	
}
function docToFertilizer(itemDoc){
		var item = new FertilizerEntity();
		item.product = $(itemDoc).attr("product");
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = $(itemDoc).attr("total");
		item.description = $(itemDoc).attr("description");
		return item;
}


var SaleEntity = function(){
	this.farm;
	this.crop;
	this.source;
	this.purchaser;
	this.price;
	this.deduction;
	this.date;
	this.description;
	this.total;
	
	this.saleString = function(){
		var rString = "";
		rString = "<sale "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' price='" + this.price +
			"' crop='" + this.crop +
			"' purchaser='" + this.purchaser +
			"' farm='" + this.farm +
			"' deduction='" + this.deduction +
			"' total='" + this.total +
			"' />";	
		return rString;
	}
	
}

	function docToSale(itemDoc){
		var item = new SaleEntity();
		item.price = parseFloat($(itemDoc).attr("price"));
		item.total = parseInt($(itemDoc).attr("total"));
		item.farm = $(itemDoc).attr("farm");
		item.crop = $(itemDoc).attr("crop");
		item.deduction = $(itemDoc).attr("deduction");
		item.description = $(itemDoc).attr("description");
		return item;
	}



var UserEntity = function(){
	this.email="davidkjos@yahoo.com";
}


var Farm = function(){
	this.number;
	this.zoom;
	this.center;
}

var FieldEntity = function() {
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
	this.vertices = [];
	this.getYield = function(crop){
		if (crop=="corn")
			return this.cornYield;
		if (crop=="soybean")
			return this.soybeanYield;
		if (crop == "wheat") {
			return this.wheatYield;
		}
	}
	this.getXML = function(){
		var str = "<field ";
		 str += "name='"+this.name+"' ";
		 str += "farm='"+this.farm+"' ";
		 str += "north='"+this.north+"' ";
		 str += "west='"+this.west+"' ";
		 str += "section='"+this.section+"' ";
		 str += ">";
		 $.each(this.vertices, function(){
		 	str += "<vertex ";
			str += "lat='"+this.lat+"' ";
			str += "lng='"+this.lng+"' ";
			str += " />";
		 });
		 str += "</field>"
	}
}
function docToField(fieldDoc){
	var field = new FieldEntity();
	field.north = $(fieldDoc).attr("north");
	field.west = $(fieldDoc).attr("west");
	field.farm = $(fieldDoc).attr("farm");
	field.section = $(fieldDoc).attr("section");
	field.name = $(fieldDoc).attr("name");
	
	$(fieldDoc).find("vertex").each(function(){
		field.vertices.push({x:$(this).attr("lat"), y:$(this).attr("lng")});
	});
	field.polygon = $(fieldDoc).find("vertex");
	field.cornYield = getInt($(fieldDoc).attr("corn_yield"));
	field.wheatYield = getInt($(fieldDoc).attr("wheat_yield"));
	field.soybeanYield = getInt($(fieldDoc).attr("soybean_yield"));
	field.acreage = getInt($(fieldDoc).attr("acreage"));
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


var PlantEntity = function(){
	this.fields = [];
	this.seed;
	this.treatments = [];
	this.payment;
	
	this.date;
	this.amountPerAcre;
	this.crop;
	
	this.payment;
	this.description;
	this.acreage;
	this.treatment = "none";
	this.treatmentAmount;
	this.treatmentPrice;
	this.total;
	this.seedPrice;
	this.seedUnitAmount;
	this.purchase;
	this.conversion;
	this.unit;
	
	this.plantString = function(){
		var rString = "";
		rString = "<planting "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' acreage='" + this.acreage +
			"' seedPrice='" + this.seedPrice +
			"' seedUnitAmount='" + this.seedUnitAmount +
			"' total='" + this.total +
			"' seed='" + this.seed.name +
			"' treatment='" + this.treatment.name +
			"' crop='" + this.crop + 
			"' unit='" + this.unit + "'>" +
			this.getFields()+
			"</planting>";	
		return rString;
	}
	this.getFields = function(){
		var rString = "";
		rString += "<fields>";
		$.each(this.fields, function(){
			rString += "<field name='"+this.name+"' />";
		});
		rString += "</fields>";
		return rString;
	}
	
	this.setVal = function(attr, newVal, purchase){
		if (attr == "description"){
			this.description = newVal;
		}
		else if (attr == "seedPrice"){
			this.price = newVal;
			purchase.total = this.price*this.total/this.conversion;
			purchase.type = "plant";
		}
		else if (attr == "total"){
			this.total = newVal;
		}
		else if (attr == "seed"){
			this.seed = newVal;
		}
	}
	
}
function docToPlanting(itemDoc){
		
		var item = new PlantEntity();
		item.date = new DateEntity();
		item.total = $(itemDoc).attr("total");
		item.seed = $(itemDoc).attr("seed");
		item.treatment = $(itemDoc).attr("treatment");
		item.crop = $(itemDoc).attr("crop");
		item.unit = $(itemDoc).attr("unit");
		item.acreage = $(itemDoc).attr("acreage");
		item.description = $(itemDoc).attr("description");
		item.date.day = $(itemDoc).attr("receiveDay");
		item.date.month = $(itemDoc).attr("receiveMonth");
		item.date.year = $(itemDoc).attr("receiveYear");
		item.seedPrice = $(itemDoc).attr("seedPrice");
		item.date.seedUnitAmount = $(itemDoc).attr("seedUnitAmount");
		item.conversion = $(itemDoc).attr("conversion");
		item.fields = [];
		$(itemDoc).find("field").each(function(){
			item.fields.push($(this).attr("name"));
		});
		return item;
}

var ApplicantEntity = function(){
	this.name;
	this.type;
	this.crop;
	this.appConversion;
	this.priceConversion;
	this.appUnits;
	this.priceUnits;
}

//*************************************************************************


var Calendar = function(){
	this.january;
	this.february;
	this.march;
	this.april;
	this.may;
	this.june;
	this.july;
	this.august;
	this.september;
	this.october;
	this.november;
	this.december;
}






var Section = function() {
	this.township;
	this.north;
	this.west;
	this.number;
	this.center;
	this.getLabel = function(){
		return this.number+"-N"+this.north+"-W"+this.west;
	}
}

var Button = function(){
	this.name;
	this.url;
	this.action;
}

var HTMLCodeFrags = function(){
	this.mapFilterForm;
	this.sectionSelectorForm;
	this.newFieldForm;
}
var PurchaseItem = function(){
	this.productName;
	this.productType;
	this.amount = -1;
	this.unitType;
	this.price;
	this.total;
}

var Price = function(){
	this.corn=3;
	this.soybean=9;
	this.wheat=6;
}

var DateEntity = function(){
	this.day;
	this.month;
	this.monthString = function(){
		return this.monthNames[this.month];
	}
	this.setMonthString = function(val){
		var rVal;
		for (var i=0; i<12; i++){
			if (val==cal[i]){
				rVal = i;
				break;
			}
		}
		this.month = rVal;
	}
	
	this.year;
	this.dateString = function(){
		return this.monthString()+" "+this.day+", "+this.year;
	}
	
	this.monthNames = [];
	this.monthNames.push("Jan");
	this.monthNames.push("Feb");
	this.monthNames.push("March");
	this.monthNames.push("April");
	this.monthNames.push("May");
	this.monthNames.push("June");
	this.monthNames.push("July");
	this.monthNames.push("August");
	this.monthNames.push("September");
	this.monthNames.push("October");
	this.monthNames.push("November");
	this.monthNames.push("December");
	
	//this is optional
	this.amount;
	this.percentage;
}
var HarvestEntity = function(){
	this.fields = [];
	this.date;
	this.farm;
	this.amountPerAcre;
	this.description;
	this.crop;
	this.total;
	
	this.harvestString = function(){
		var rString = "";
		rString = "<harvest "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' farm='" + this.farm +
			"' crop='" + this.crop +
			"' total='" + this.total +
			"' >"+
			this.getFields()+
			"</harvest>";
		return rString;
	}
	this.getFields = function(){
		var rString = "";
		rString += "<fields>";
		$.each(this.fields, function(){
			rString += "<field name='"+this.name+"' />";
		});
		rString += "</fields>";
		return rString;
	}
	

}
	function docToHarvest(itemDoc){
		var item = new HarvestEntity();
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = parseInt($(itemDoc).attr("total"));
		item.farm = $(itemDoc).attr("farm");
		item.description = $(itemDoc).attr("description");
		item.crop = $(itemDoc).attr("crop");
		return item;
	}

var PaymentEntity = function(){
	this.farm;
	this.classification;
	this.vendor;
	this.amount;
	this.date;
	this.description;
}
	function docToPayment(itemDoc){
		var item = new PaymentEntity();
		item.date = new DateEntity();
		item.description = $(itemDoc).attr("description");
		item.type = $(itemDoc).attr("type");
		item.amount = getFloat($(itemDoc).attr("amount"));
		item.date.day = $(itemDoc).attr("day");
		item.date.month = $(itemDoc).attr("month");
		item.date.year = $(itemDoc).attr("year");
		item.vendor = $(itemDoc).attr("vendor");
		return item;
	}

var Vertex = function(){
	this.lat;
	this.lng;
}

var SectionEntity = function(){
	this.north;
	this.west;
	this.number;
	this.vertices;
}

function docToSection(itemDoc){
	var item = new SectionEntity();
	item.number = $(itemDoc).attr("number");
	item.vertices = [];
	
	$(itemDoc).find("vertex").each(function(i){
		var vertex = new Vertex();
		vertex.lat = $(this).find("lat").text();
		
		vertex.lng = $(this).find("long").text();
		item.vertices.push(vertex);
	});
	return item;
}






//END ENTITIES***********************
