
var WHEAT = 0;
var CORN = 1;
var SOYBEAN = 2;

var Item = function(){
	this.name;
	this.amount;
}

//DATA************************
var Cache = function(pEmail, func){
	
	//UNIVERSAL AJAX GET
	function get(url, func){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				data = textToDoc(data);	
				func(data);
			}
		});
	}
	this.getWheatSeed = function(){
		var rItems = [];
		$(fieldDoc).find("item[type=wheat_seed]").each(function(){
			var item = new Item();
			item.name = $(this).attr("product");
			item.amount = $(this).attr("amount");
			rItems.push(item);
		});
		return rItems;
	}
	this.getCornSeed = function(){
		
	}
	this.getSoybeanSeed = function(){
		
	}


	this.getPlantings = function(){
		var rPlantings = [];
		var wPlantings = [];
		var cPlantings = [];
		var sPlantings = [];
		
		$(fieldDoc).find("planting[crop=wheat]").each(function(){
			var plantEntity = new PlantEntity();
			plantEntity.description = $(this).attr("description");
			plantEntity.fields[0] = $(this).attr("field");
			plantEntity.amount = $(this).attr("amount");
			plantEntity.seed = $(this).attr("amount");
			wPlantings.push(plantEntity);
		});
		rPlantings[WHEAT] = wPlantings;
		$(fieldDoc).find("planting[crop=corn]").each(function(){
			var plantEntity = new PlantEntity();
			plantEntity.description = $(this).attr("description");
			plantEntity.fields[0] = $(this).attr("field");
			plantEntity.amount = $(this).attr("amount");
			cPlantings.push(plantEntity);
		});
		rPlantings[CORN] = cPlantings;
		$(fieldDoc).find("planting[crop=soybean]").each(function(){
			var plantEntity = new PlantEntity();
			plantEntity.description = $(this).attr("description");
			plantEntity.fields[0] = $(this).attr("field");
			plantEntity.amount = $(this).attr("amount");
			sPlantings.push(plantEntity);
		});
		rPlantings[SOYBEAN] = sPlantings;
		return rPlantings;
	}

	this.getPurchases = function(){
		var rPurchases = [];
		$(fieldDoc).find("purchase").each(function(){
			var purchase = new PurchaseEntity();
			purchase.description = $(this).attr("description");
			var receiveDate = new DateEntity();
			receiveDate.day = $(this).attr("receiveDay");
			receiveDate.month = $(this).attr("receiveMonth");
			receiveDate.year = $(this).attr("receiveYear");
			purchase.receiveDate = receiveDate;
			purchase.vendor = $(this).attr("vendor");
			
			$(this).find("item").each(function(){
				var item = new PurchaseItemEntity();
				
				item.type = $(this).attr("type");
				item.product = $(this).attr("product");
				item.price = $(this).attr("price");
				item.amount = $(this).attr("amount");
				purchase.items.push(item);
			});
			
			$(this).find("item").each(function(){
				var payment = new DateEntity();
				payment.day = $(this).attr("day");
				payment.month = $(this).attr("month");
				payment.year = $(this).attr("year");
				payment.amount = $(this).attr("amount");
				purchase.paymentDates.push(payment);
			});
			rPurchases.push(purchase);
		});
		return rPurchases;
	}
	

	this.getFarms = function(){
		var rFarms = [];
		$(fieldDoc).find("farm").each(function(){
			rFarms.push($(this).attr("number"));
		});
		return rFarms;
	}
	
	var sections = [];;
	
	function getCrop(fieldName){
		var rCrop = "none";
		try {
			rCrop = $(fieldDoc).find("planting[field=" + fieldName + "]").attr("crop");
		}
		catch (e){
			rCrop = "none";
		}
		if (!rCrop){
			rCrop="none";
		}
		return rCrop;
	}
	
	this.getFields = function(farm,north, west, number){

		var query="";
		if (farm){
			query="[farm="+farm+"]";
		}
		if (north){
			query+="[north="+north+"][west="+west+"][section="+number+"]";
		}
		sections = [];
		var rFields = [];
		$(fieldDoc).find("field"+query).each(function(){
			var field = new Field();
			field.north = $(this).attr("north");
			field.west = $(this).attr("west");
			field.section = $(this).attr("section");
			field.name = $(this).attr("name");
			field.acreage = $(this).attr("acreage");
			field.polygon = createPolygon($(this).find("vertex"));
			var crop = getCrop(field.name);
			if (crop=="corn")
				field.polygon.color = "orange";
			else if (crop=="soybean"){
				field.polygon.color = "yellow";
			}
			else if (crop=="wheat"){
				field.polygon.color = "lime";
			}
			else {
				field.polygon.color = "gray";
			}
			rFields.push(field);
			
			//create the list of unique sections for navigation purposes
			if (!sectionsContain(sections,field.north, field.west, field.section)){
				var section = new Section();
				section.north = field.north;
				section.west = field.west;
				section.number = field.section;
				sections.push(section);
			}
			
		});
		return rFields;
	}
	
	
	this.getSections = function(){
		return sections;
	}
	
	this.getSection = function(number, north, west, func){
		get("/?action=getsection&number="+number+"&north="+north+"&west="+west, function(data){
			 func(data);
		});
			
		
	}
	this.update = function(func){
		$("#dialog_box").text("Please Wait..........");
		get("/?action=getuser&email=" + email, function(data){
			fieldDoc = data;
			func();
		});
	}

	//INSTANTIATION CODE
	var mapFilter;
	var sectionSector;
	$.ajaxSetup({ cache: false });
	this.codeFrags = new HTMLCodeFrags();
	this.calendar = [];
	$.ajax({
			url: "form.xml",
			type: 'GET',
			dataType: 'html',
			success: function(data){
				data = textToDoc(data);	
				cache.codeFrags.mapFilterForm = $(data).find("map-nav").text();

			}
		});
		
	$.ajax({
			url: "calendar.xml",
			type: 'GET',
			dataType: 'html',
			success: function(data){
	
					data = textToDoc(data);
					for (var i = 0; i < 12; i++) {
						cache.calendar.push($(data).find("month" + i).text());
					}
			}
		});
		
	var email = pEmail;
	var fieldDoc;
	
	//END INSTANTIATE CODE
}
//END DATA************************