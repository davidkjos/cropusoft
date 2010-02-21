	function PlantCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var plantings;
		var plantingsDoc;
		var planting;
		var reloadPlantings = true;
		this.getPlantings = function(func){
			if (func) {
				var rVals = [];
				if (reloadPlantings) {
					reloadPlantings = false;
					get("getplantings", "email=" + email, "Getting Plantings", function(result){
						plantingsDoc = textToDoc(result);
						var filteredDoc = $(plantingsDoc).find("planting");
						plantings = loadArray(docToPlanting, filteredDoc);
						func();
					});
				}
				else {
					func(plantings);
				}
			}
			else {
				return plantings;
			}
		}
		
		this.setPlantedFields = function(fields, func){
			
			
			this.getPlantings(function(){
					$.each(fields, function(i){
						if (this.name.match("'"))
							this.name = "broken named field";
						
						this.crop = $(plantingsDoc).find("field[name='"+this.name+"']").parent().parent().attr("crop");
					});
					func(fields);
			});
			
		}
		
		this.getPlantingsByCrop = function(query,func) {
			var totalAcreage = 0;
			var plantingsByCrop = {corn:[], soybean:[], wheat:[]};
			
			$(plantingsDoc).find("planting[crop=corn]").each(function(i){
				plantingsByCrop.corn.push(docToPlanting(this));
			});
			$(plantingsDoc).find("planting[crop=soybean]").each(function(i){
				plantingsByCrop.soybean.push(docToPlanting(this));
			});
			$(plantingsDoc).find("planting[crop=wheat]").each(function(i){
				plantingsByCrop.wheat.push(docToPlanting(this));
			});
			func(plantingsByCrop)
		}
		
		this.getPlantedIncome = function(func){
			var plantedIncome = {
				corn:{bushels:0, income:0},
				soybean:{bushels:0, income:0},
				wheat:{bushels:0, income:0}
			};
			
			this.getPlantingsByCrop("",function(plantingsByCrop){
				$.each(plantingsByCrop.corn, function(){
					var fields = getPlantedFields(this);
					var bushels = 0;
					$.each(fields, function(){
						var price = 3;
						var totalBushels = getInt(this.cornYield)*getInt(this.acreage);
						plantedIncome.corn.bushels += totalBushels;
						plantedIncome.corn.income = price*totalBushels;
					});
				});
			});
		}
		
		function getPlantedFields(planting){
			var fields = [];
			$(plantingsDoc).find("planting[description="+planting.description+"]").find("field").each(function(){
				fields.push(docToField(this));
			});
			return fields;
		}
		
		this.getPlanting = function(description, func){
			var plantingDoc = $(plantingsDoc).find("planting[description=" + description + "]");
			//get root entity
			planting = docToPlanting(plantingDoc);
			//set fields
			$(plantingDoc).find("field").each(function(){
				var field = docToField($(this));
				planting.fields.push(field);
			});
			//set treatments
			$(plantingDoc).find("treatment").each(function(){
				var applicantName = $(this).attr("name");
				var amount = $(this).attr("amount");
				var treatmentDoc = $(applicantsDoc).find("applicant[type=treatment][name=" + applicantName + "]");
				var treatment = docToApplicant($(treatmentDoc));
				treatment.amount = amount;
				planting.treatments.push(treatment);
			});
			//set seed
			var seedDoc = $(plantingDoc).find("seed");
			var seedName = $(seedDoc).attr("name");
			var amount = $(seedDoc).attr("amount");
			var seedDoc = $(applicantsDoc).find("applicant[type=seed][name=" + applicantName + "]");
			var seed = docToApplicant($(seedDoc));
			seed.amount = amount;
			planting.seed = seed;
			//set payment
			var paymentDoc = $(payments).find("payment[description=" + planting.description + "]");
			planting.payment = docToPayment(paymentDoc);
			func(planting);
		}
		
		this.savePlanting = function(planting, func){
		
			post("saveplanting", planting, planting.description, "Saving Planting", function(){
				post("savepayment", planting.payment, planting.description, "Saving Planting Payment", function(){
					//set up all applicants as array so that each one can be handled synchrounously (includes seed and treatments)
					var allApplicants = planting.treatments;
					allApplicants.push(planting.seed);
					this.saveApplicants(allApplicants, function(){
						func();
					});
				});
				
			});
		}
		

	
	this.removePlanting = function(planting, func){
		post("removeplanting", planting, planting.description, "Remove Planting", function(){
			post("removepayment", planting.payment, planting.description, "Remove Payment", function(){
				func();
			});
		});
	}
	
	
	
	
	this.editPlanting = function(planting, func){
		//root planting entity editted
		if (planting.edit){
			post("editplanting", planting, planting.description, "Editting Planting", function(){
				func();	
			});
		}
		//payment editted
		else if (planting.payment.edit){
			post("savepayment", planting.payment, planting.description, "Saving Planting Payment", function(){
				func();
			});
		}
		//seed or treatment editted
		else {
			var allApplicants = planting.treatments;
			allApplicants.push(planting.seed);
			this.editApplicants(func);
		}
		
	}
	
	

	

	//Plantings and Fields must be loaded to use this!!
	this.getPlantingIncome = function(func){
		var PlantingIncome = function(){
			this.corn = 0;
			this.soybean = 0;
			this.wheat = 0;
		}
		
		var plantingIncome = new PlantingIncome();
		
		$(plantings).each(function(){
			if ($(this).attr("crop")=="corn"){
				plantingIncome.corn += $(this.attr("cornYield")) * $(this.attr("acreage"));
			}
			else if ($(this).attr("crop")=="soybean"){
				plantingIncome.soybean += $(this.attr("soybeanYield")) * $(this.attr("acreage"));
			}
			else if ($(this).attr("crop")=="wheat"){
				plantingIncome.wheat += $(this.attr("wheatYield")) * $(this.attr("acreage"));
			}
		});	
	}
	
	this.getPlantingCosts = function(func){
		
	}
	
	}