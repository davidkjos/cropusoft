
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
	
	
	this.save = function(func){
		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveinsurance",
					email: user.email,
					insurance: this.getInsuranceString()
				}
			});

		func();
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
	
	//PLANT
	var InsuranceManager = function(){
		
		var formDoc;
		var entity;
		
		this.refresh = function(func){
			insuranceCache = new InsuranceCache(user.email, function(){
				lossDisplay.showInsurances(insuranceCache.getInsurances());
				func();
			});
		}
		
		this.run = function(){
			$("#form_title").html("Insurance");
			$.ajax({
				url: "insurance.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					formDoc = textToDoc(data);
					viewInsurances();
				}
			});
			
		}
		
		function viewInsurances(){
			$("#form_box").html('<table class="three_column"></table>');
			$.each(insuranceCache.insurances, function(){
				$("#form_box table").append(createRow(this.getSectionLabel(),this.getGuaranteedAmount(), "view"));
			});
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			$("#done").click(function(){
				selectFarmSectionCropAction();
			});
		}
		function selectFarmSectionCropAction(){
			entity = new InsuranceEntity();
			$("#form_box").html($(formDoc).find("select-fields-form").text());
			filterForm.enableCustomListener();
		}
		this.handleFarmSelect = function(farm){
			entity.farm = farm;
			$("#selected_farm").removeClass("hide");
			$("#selected_farm span").html(farm);
		}
		this.handleCropSelect = function(crop){
			entity.crop = crop;
			$("#selected_crop").removeClass("hide");
			$("#selected_crop span").html(crop);
		}
		this.handleSectionSelect = function(section){
			entity.north = section.north;
			entity.west = section.west;
			entity.section = section.number;
			$("#selected_section").removeClass("hide");
			$("#selected_section span").html(section.getLabel());
			$("#submit_selection").removeClass("hide");
			acreage = mapDisplay.getAcreage();
			entity.acreage = acreage;
			$("#submit_selection span").html(mapDisplay.getAcreage());
			$("#done").click(function(){
				selectYieldAction();
			});
		}
		var acreage;
		var averageYield;
		function selectYieldAction(){
			$("#form_info").removeClass("hide");
			$("#form_info").append($("#selected_farm").clone());
			$("#form_info").append($("#selected_crop").clone());
			$("#form_info").append($("#selected_section").clone());
			$("#form_info").append("<b>Acreage:</b> "+entity.acreage+" acres<br/>");
			$("#form_box").html($(formDoc).find("select-yield-form").text());
			
			var fields = mapDisplay.getFields();
			var totalAcreage = 0;
			var totalCrop = 0;
			$.each(mapDisplay.getFields(), function(i){
				entity.fields.push(this.name);
				totalAcreage += this.acreage;
				var yield;
				if (entity.crop=="corn")
					yield = this.cornYield;
				if (entity.crop=="soybean")
					yield = this.soybeanYield;
				if (entity.crop=="wheat")
					yield = this.wheatYield;
				totalCrop += this.acreage * yield;
				
				$("#calculated_yield table").append(createRow(this.name, this.acreage, yield));
			});
			entity.acreage = totalAcreage;
			averageYield = Math.floor(100*totalCrop/totalAcreage)/100;
			entity.yield = averageYield;
			$("#calculated_yield table").append(createRow("<b>Average: </b>", totalAcreage, averageYield));
			$("#done").click(function(){
				$("#form_info").append("<b>Average Yield:</b> "+averageYield);
				enterPercentageAction();
			});
		}
		var percentage;
		function enterPercentageAction(){
			
			$("#form_box").html($(formDoc).find("enter-percentage-form").text());
			$("#done").click(function(){
				percentage = parseInt($("#form_box input").attr("value"));
				entity.percentage = percentage;
				$("#form_info").append("<br/><b>Percentage:</b> "+percentage+"%");
				enterPriceAction();
			});
		}
		var price;
		function enterPriceAction(){
			$("#form_box").html($(formDoc).find("enter-price-form").text());
			$("#done").click(function(){
				price = parseInt($("#form_box input").attr("value"));
				entity.price = price;
				$("#form_info").append("<br/><b>Price Guarantee:</b> $"+price);
				enterPremiumAction();
			});
		}
		var premium;
		function enterPremiumAction(){
			$("#form_box").html($(formDoc).find("enter-premium-form").text());
			$("#done").click(function(){
				premium = parseInt($("#form_box input").attr("value"));
				entity.premium = premium;
				$("#form_info").append("<br/><b>Premium:</b> $"+premium+"/acre");
				finalSummaryAction();
			});
		}
		function finalSummaryAction(){
			var bushelGuarantee = averageYield*percentage/100;
			$("#form_info").append("<br/><b>Bushel Guarantee:</b> "+bushelGuarantee+" bushels/acre");
			var guarantee = bushelGuarantee*price;
			$("#form_info").append("<br/><b>Total Guarantee:</b> $"+guarantee+"/acre");
			$("#form_box").html('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			$("#done").click(function(){
				entity.save(function(){
					filterForm.disableCustomListener();
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
	}




var InsuranceCache = function(pEmail, func){
	var doc;
	
	this.insurances;
	
	$.ajax({
		url: "/?action=getinsurance&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.getInsurances = function(){
		insurances = [];
		$(doc).find("insurance").each(function(){
			var entity = docToEntity(this);
			insurances.push(entity);
		});
		this.insurances = insurances;
		return insurances;
	}
	function docToEntity(itemDoc){
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
}

/*
 this.farm;
	this.crop;
	this.north;
	this.section;
	this.west;
	this.yield;
	this.price;
	this.percentage;
	this.acreage;
	this.fields = [];
 */




