var SeedEntity = function(){
	this.name;
	this.units;
	this.crop;
	this.appConversion = 1;
	this.priceConversion = 1;
	this.isNew = true;
	
	
	this.xmlString = function(){
		var rString = "";
		rString = "<seed "+
			"  name='" + this.name+
			"' crop='" + this.crop +
			"' units='" + this.units + 
			"' appConversion='" + this.appConversion +
			"' priceConversion='" + this.priceConversion +
			"' />";
		return rString;
	}
	
	this.save = function(func){
		if (this.isNew) {
			var items = [];
			$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveseed",
					email: user.email,
					name: this.name,
					seed: this.xmlString()
				}
			});
			func();
		}
		else {
			func();
		}
		
	}
	this.edit = function(func){
		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "editseed",
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
					action: "removeseed",
					email: user.email,
					name: this.name
				}
			});
		func();
	}
}


var SeedCache = function(func){
	var doc;
	
	$.ajax({
		url: "/?action=getseeds&email="+user.email,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	this.seeds;
	
	this.getOptionsString = function(){
		var rVal = "";
		$(doc).find("seed").each(function(){
			var product = docToItem(this);
			rVal += "<input type='radio' id='seed' name='seed' value='"+product.name+"'>"+product.name+"("+product.appConversion+" per "+product.units+")</input><br/>";
		});
		rVal += "<input type='radio' name='seed' value='new'>New Item:</input><input type='text' id='new_val' ></input><br/>";
		return rVal;
	}
	
	this.getSeed = function(name){
		var rVal = $(doc).find("seed[name = "+name+"]");
		rVal = docToItem(rVal);
		return rVal;
	}
	
	this.getSeeds = function(){
		var rSeeds = [];
		$(doc).find("seed").each(function(){
			var seed = docToItem(this);
			rSeeds.push(seed);
		});
		
		this.seeds=rSeeds;
		return rSeeds;
	}
	
	function docToItem(itemDoc){
		var item = new SeedEntity();
		item.isNew = false;
		item.name = $(itemDoc).attr("name");
		item.units = $(itemDoc).attr("units");
		item.crop = $(itemDoc).attr("crop");
		item.appConversion = $(itemDoc).attr("appConversion");
		item.priceConversion = $(itemDoc).attr("priceConversion");
		return item;
	}
	
}




