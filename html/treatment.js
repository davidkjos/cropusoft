var TreatmentEntity = function(){
	this.name;
	this.units;
	this.type;
	this.appConversion = 1;
	this.priceConversion = 1;
	
	this.xmlString = function(){
		var rString = "";
		rString = "<treatment "+
			"  name='" + this.name+
			"' type='" + this.type +
			"' units='" + this.units + 
			"' appConversion='" + this.appConversion +
			"' priceConversion='" + this.priceConversion +
			"' />";
		return rString;
	}
	
	this.save = function(func){
		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savetreatment",
					email: user.email,
					name: this.name,
					treatment: this.xmlString()
				}
			});
		func();
	}
	this.edit = function(func){
		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "edittreatment",
					email: user.email,
					payment: this.xmlString(),
					description: this.description
				}
			});

		func();
	}
	
	this.remove = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "removetreatment",
					email: user.email,
					name: this.name
				}
			});
		func();
	}
}


var TreatmentCache = function(func){
	var doc;
	
	$.ajax({
		url: "/?action=gettreatments&email="+user.email,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	this.seeds;
	
	this.getTreatment = function(name){
		var rVal = $(doc).find("treatment[name = "+name+"]");
		rVal = docToItem(rVal);
		return rVal;
	}
	
	this.getTreatments = function(){
		var rTreatments = [];
		$(doc).find("treatment").each(function(){
			var treatment = docToItem(this);
			rTreatments.push(treatment);
		});
		
		this.treatments=rTreatments;
		return rTreatments;
	}
	
	function docToItem(itemDoc){
		var item = new TreatmentEntity();
		item.name = $(itemDoc).attr("name");
		item.units = $(itemDoc).attr("units");
		item.type = $(itemDoc).attr("type");
		item.appConversion = $(itemDoc).attr("appConversion");
		item.priceConversion = $(itemDoc).attr("priceConversion");
		return item;
	}
	
}




