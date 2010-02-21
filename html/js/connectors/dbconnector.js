function DbConnector(){

	//RULE: each cache file represents a database table, all cross referencing between these tables are done in dbconnector. 
	//EXCEPTION: during update, if payment and sale/plant both need update there will need to be a reference to payment from sale and plant caches.
	//*******************************************************************
	
	
	this.generateGuest = function(func){
		var randomNumber=Math.floor(Math.random()*10000000001);
		post("saveuser", randomNumber, "saving user", "", function(){
			func(randomNumber)
		});
	}

	this.saveField = function(field, func){
		post("savefield", session.userId, "saving field", field.getXML(), function(){
			func();
		});
	}
	
	
	//PLANTING *********************************************************
	
	var fieldCache = new FieldCache();
	var plantCache = new PlantCache();
	var harvestCache = new HarvestCache();
	var paymentCache;
	try {
		paymentCache = new PaymentCache();
	}
	catch (e){
		
	}
	var salesCache = new SalesCache();
	var fertilizerCache = new FertilizerCache();
	var chemicalCache = new ChemicalCache();
	var insuranceCache = new InsuranceCache();
	var cornPrice = 3;
	var soybeanPrice = 10;
	var wheatPrice = 7;
	
	
	this.getSection = function(section, func){
		fieldCache.getSection(section, function(section){
			func(section);
		});
	}
	
	
	this.getPlantings = function(query, func){
		if (func) {
			plantCache.getPlantings(query, function(plantings){
				func(plantings);
			});
		}
		else 
			return plantCache.getPlantings(query);
	}
	
	function getPlanting(query, func){
		//planting root entity.....
		plantCache.getPlanting(query, function(planting){
			//payment
			query = {description:planting.description};
			paymentCache.getPayment(query, function(payment){
				planting.payment = payment;
				//seed
				query = {name:planting.seed, type:"seed"};
				applicantCache.getApplicant(query, function(seedApplicant){
					planting.seedApplicant = seedApplicant;
					//treatments
					var queries = [];
					$.each(planting.treatments, function(){
						queries.push({name:this, type:"treatment"});
					});
					applicantCache.getApplicants(queries, function(treatmentApplicants){
						planting.treatmentApplicants = treatmentApplicants;
						//fields
						queries = [];
						$.each(planting.fields, function(){
							queries.push({name:this});
						});
						fieldsCache.getFields(queries, function(fields){
							planting.fields = fields;
							func(planting);
						});
					});
				});
			});
		});
	}
	
	function savePlanting(planting, func){
		var applicants = planting.treatmentApplicants;
		applicants.push(planting.seedApplicant)
		plantingCache.savePlanting(planting, function(result){
			paymentCache.savePayment(payment, function(result){
				applicantCache.saveApplicants(applicants, function(result){
					func(result);
				}, result);
			}, result);
		});
	}
	
	function updatePlanting(planting, func){
		if (planting.update){
			plantingCache.update(planting, function(result){
				func(result);
			});
		}
		else if (planting.payment.update){
			paymentCache.update(planting.payment, function(result){
				func(result);
			});
		}
		else if (planting.seedApplicant.update){
			applicantCache.update(planting.seedApplicant, function(result){
				func(result);
			});
		}
		else {
			applicantCache.updateFromArray(planting.treatmentApplicant, function(result){
				func(result);
			});
		}
	}
	
	function removePlanting(planting, func){
		plantingCache.removePlanting(planting, function(result){
			paymentCache.removePayment(planting.payment, function(result){
				func(result);
			}, result);
		});
	}
	
	this.getPlantingCosts = function(query, func){
		
		plantCache.getPlantingsByCrop(query, function(plantingsByCrop){
			paymentCache.getPlantingCosts(plantingsByCrop, function(plantingCosts){
				func(plantingCosts);
			});
		});
	}
	
	this.getPlantedIncome = function(query, func){
		var plantedIncome = {
			corn:{bushels:0, income:0}, 
			soybean:{bushels:0, income:0}, 
			wheat:{bushels:0, income:0}
		};
				
		plantCache.getPlantingsByCrop(query, function(plantingsByCrop){
			var bushels = 0;
			var queries = [];
			$.each(plantingsByCrop.corn, function(){
				$.each(this.fields, function(){
					queries.push({name:this});
				});
			});
			$.each(queries, function(){
				plantedIncome.corn.bushels += fieldCache.getPlantedBushels(this.name, "corn");
				plantedIncome.corn.income = plantedIncome.corn.bushels*cornPrice;
			});
			queries = [];
			$.each(plantingsByCrop.soybean, function(){
				$.each(this.fields, function(){
					queries.push({name:this});
				});
			});
			$.each(queries, function(){
				plantedIncome.soybean.bushels += fieldCache.getPlantedBushels(this.name, "soybean");
				plantedIncome.soybean.income = plantedIncome.soybean.bushels*soybeanPrice;
			});
			queries = [];
			$.each(plantingsByCrop.wheat, function(){
				$.each(this.fields, function(){
					queries.push({name:this});
				});
			});
			$.each(queries, function(){
				
				plantedIncome.wheat.bushels += fieldCache.getPlantedBushels(this.name, "wheat");
				plantedIncome.wheat.income = plantedIncome.wheat.bushels*wheatPrice;
			});
			func(plantedIncome);
		});
		// for each planting, get a list of field names, add them together in array
		// pass new field name array into field cache to get bushels added up
		// get price and multiply by each bushel value
		// do for other 2 crops
	}
	
	//*******************************************************************
	//FIELDS *********************************************************
	
	this.getFields = function(query, func){
		fieldCache.getFields(query, function(fields){
			plantCache.setPlantedFields(fields, function(fields){
				harvestCache.setHarvestedFields(fields, function(fields){
					func(fields);
				});
			});
		});
	}
	
	
	
	function saveField(field, func){
		fieldCache.saveField(function(result){
			func(result);
		});
	}
	function editField(field, func){
		fieldCache.editField(function(result){
			func(result);
		});
	}
	function removeField(field, func){
		fieldCache.removeField(function(result){
			func(result);
		});
	}
	//*******************************************************************
	//HARVEST *********************************************************
	
	function getHarvests(query, func){
		harvestCache.getHarvests(query, function(harvests){
			func(harvests);
		});
	}
	function getHarvest(query, func){
		harvestCache.getHarvest(query, function(harvest){
			var queries = [];
			$.each(harvest.fields, function(){
				queries.push({name:this});
			})
			fieldsCache.getFields(queries, function(fields){
				harvest.fields = fields;
				func(harvest);
			});
		});
	}
	function saveHarvest(harvest, func){
		harvestCache.saveHarvest(harvest, function(result){
			func(result);
		});
	}
	function editHarvest(harvest, func){
		harvestCache.editHarvest(harvest, function(result){
			func(result);
		});
	}
	function removeHarvest(harvest, func){
		harvestCache.removeHarvest(harvest, function(result){
			func(result);
		});
	}
	this.getHarvestedIncome = function(query, func){
		var harvestedIncome = harvestCache.getHarvestedIncome();
		return harvestedIncome;
	}
	
	//*******************************************************************
	//SALES *********************************************************
	this.getSales = function(query, func){

		salesCache.getSales(query, function(sales){
			func(sales);
		});
	}
	function getSale(query, func){
		salesCache.getSale(query, function(sale){
			var query = {type:"sale", description:sale.description}
			paymentCache.getPayment(query, function(payment){
				sale.payment = payment;
			});
		});
	}
	function saveSale(sale, func){
		salesCache.saveSale(sale, function(result){
			paymentCache.savePayment(sale.payment, function(){
				func(result);
			}, result)
		});
	}
	function editSale(sale, func){
		if (sale.edit){
			saleCache.editSale(sale, function(){
				func(result);
			});
		}
		else if (sale.payment.edit){
			paymentCache.editPayment(sale.payment, function(){
				func(result);
			});
		}
	}
	function removeSale(sale, func){
		saleCache.removeSale(sale, function(result){
			var query = {type:"sale",description:sale.description};
			paymentCache.removePayment(payment, function(result){
				func(result);
			}, result);
		});
	}
	
	function getStoredCrop(query, func){
		harvestCache.getBushels(query, function(harvestedBushels){
			salesCache.getBushels(query, function(soldBushels){
				func(harvestedBushels-soldBushels);
			});
		});
	}
	function getSoldCrop(query, func){
		salesCache.getBushels(query, function(soldBushels){
				func(soldBushels);
		});
	}
	function getStoredIncome(query, func){
		harvestCache.getBushels(query, function(harvestedBushels){
			salesCache.getBushels(query, function(soldBushels){
				func((harvestedBushels-soldBushels)*marketConnector.cashPrice(query));
			});
		});
	}
	function getSoldIncome(query, func){
		paymentCache.getSalesIncome(query, function(salesIncome){
			func(salesIncome);
		});
	}
	this.getSalesIncome = function(query, func){
		var salesIncome = salesCache.getSalesIncome();
		return salesIncome;
	}
	
	//***********************************************************************
	//FERTILIZERS****************************************************************
	this.getFertilizers = function(query, func){
		fertilizerCache.getFertilizers(query, function(fertilizers){
			func(fertilizers);
		});
	}
	this.getChemicals = function(query, func){
		chemicalCache.getChemicals(query, function(chemicals){
			func(chemicals);
		});
	}
	this.getInsurances = function(query, func){
		insuranceCache.getInsurances(query, function(insurances){
			func(insurances);
		});
	}
	this.getFertilizerCosts = function(query, func){
		var fertilizersByCrop = fertilizerCache.getFertilizersByCrop();
		var fertilizerCosts = paymentCache.getFertilizerCosts(fertilizersByCrop);
		return fertilizerCosts;
	}
	this.getChemicalCosts = function(query, func){
		var chemicalsByCrop = chemicalCache.getChemicalsByCrop();
		var chemicalCosts = paymentCache.getChemicalCosts(chemicalsByCrop);
		return chemicalCosts;
	}
	this.getInsuranceCosts = function(query, func){
		var insurancesByCrop = insuranceCache.getInsurancesByCrop();
		var insuranceCosts = paymentCache.getInsuranceCosts(insurancesByCrop);
		return insuranceCosts;
	}
	function getFertilization(query, func){
		//planting root entity.....
		fertilizationCache.getFertilization(query, function(fertilization){
			//payment
			query = {description:fertilization.description};
			paymentCache.getPayment(query, function(payment){
				fertilization.payment = payment;
				//fertilizers
				var queries = [];
					$.each(fertilization.fertilizers, function(){
						queries.push({name:this, type:"fertilizer"});
					});
					applicantCache.getApplicants(queries, function(fertilizerApplicants){
						fertilization.fertilizerApplicants = fertilizerApplicants;
						//fields
						queries = [];
						$.each(fertilization.fields, function(){
							queries.push({name:this});
						});
						fieldsCache.getFields(queries, function(fields){
							fertilization.fields = fields;
							func(fertilization);
						});
					});
				});
			});
	}
	
	
	function saveFertilization(fertilization, func){
		fertilizationCache.saveFertilization(fertilization, function(result){
			paymentCache.savePayment(fertilization.payment, function(result){
				applicantCache.saveApplicants(fertilization.fertilizerApplicants, function(result){
					func(result);
				}, result);
			}, result);
		});
	}
	
	function editFertilization(fertilization, func){
		if (fertilization.update){
			fertilizationCache.update(fertilization, function(result){
				func(result);
			});
		}
		else if (fertilization.payment.update){
			paymentCache.update(fertilization.payment, function(result){
				func(result);
			});
		}
		else {
			applicantCache.updateFromArray(fertilization.fertilizerApplicants, function(result){
				func(result);
			});
		}
	}
	
	function removeFertilization(fertilization, func){
		fertilizationCache.removeFertilization(fertilization, function(result){
			paymentCache.removePayment(fertilization.payment, function(result){
				func(result);
			}, result);
		});
	}
	function getFertilizationCost(query, func){
		paymentCache.getFertilizationCosts(query, function(fertilizationCost){
			func(fertilizationCost);
		});
	}
	
	
	//*******************************************************************
	//CHEMICAL *********************************************************
	function getChemicalizations(query, func){
		chemicalizationCache.getChemicalizations(query, function(chemicalizations){
			func(chemicalizations);
		});
	}
	this.getPayments = function(query, func){
		paymentCache.getPayments(function(payments){
			func(payments);
		});
	}
	function getChemicalization(query, func){
		//planting root entity.....
		chemicalizationCache.getChemicalization(query, function(chemicalization){
			//payment
			query = {description:chemicalization.description};
			paymentCache.getPayment(query, function(payment){
				chemicalization.payment = payment;
				//fertilizers
				var queries = [];
					$.each(chemicalization.chemicals, function(){
						queries.push({name:this, type:"chemical"});
					});
					applicantCache.getApplicants(queries, function(chemicalApplicants){
						chemicalization.chemicalApplicants = chemicalApplicants;
						//fields
						queries = [];
						$.each(chemicalization.fields, function(){
							queries.push({name:this});
						});
						fieldsCache.getFields(queries, function(fields){
							chemicalization.fields = fields;
							func(chemicalization);
						});
					});
				});
			});
	}
	
	function saveChemicalization(chemicalization, func){
		chemicalizationCache.saveChemicalization(chemicalization, function(result){
			paymentCache.savePayment(chemicalization.payment, function(result){
				applicantCache.saveApplicants(chemicalization.chemicalApplicants, function(result){
					func(result);
				}, result);
			}, result);
		});
	}
	
	function editChemicalization(chemicalization, func){
		if (chemicalization.update){
			chemicalizationCache.update(chemicalization, function(result){
				func(result);
			});
		}
		else if (chemicalization.payment.update){
			paymentCache.update(chemicalization.payment, function(result){
				func(result);
			});
		}
		else {
			applicantCache.updateFromArray(chemicalization.chemicalApplicants, function(result){
				func(result);
			});
		}
	}
	
	function removeChemicalization(chemicalization, func){
		chemicalizationCache.removeChemicalization(chemicalization, function(result){
			paymentCache.removePayment(chemicalization.payment, function(result){
				func(result);
			}, result);
		});
	}
	
	function getChemicalizationCost(query, func){
		paymentCache.getChemicalizationCost(query, function(chemicalizationCost){
			func(chemicalizationCost);
		});
	}
	
	//*****************************************************************************************************
	//InsuranceCoverage******************************************************************************************
	
	function getInsuranceCoverages(query, func){
		insuranceCoverageCache.getInsuranceCoverages(query, function(insuranceCoverages){
			func(insuranceCoverages);
		});
	}
	
	function getInsuranceCoverage(query, func){
		//planting root entity.....
		insuranceCoverageCache.getInsuranceCoverage(query, function(insuranceCoverage){
			//payment
			query = {description:insuranceCoverage.description};
			paymentCache.getPayment(query, function(payment){
				insuranceCoverage.payment = payment;
				queries = [];
				$.each(insuranceCoverage.fields, function(){
					queries.push({name:this});
				});
				fieldsCache.getFields(queries, function(fields){
					insuranceCoverage.fields = fields;
					func(insuranceCoverage);
				});
			});
		});
	}
	
	function saveInsuranceCoverage(insuranceCoverage, func){
		insuranceCoverageCache.saveInsuranceCoverage(insuranceCoverage, function(result){
			paymentCache.savePayment(insuranceCoverage.payment, function(result){
				func(result);
			}, result);
		});
	}	
	function editInsuranceCoverage(insuranceCoverage, func){
		if (insuranceCoverage.update){
			insuranceCoverageCache.update(insuranceCoverage, function(result){
				func(result);
			});
		}
		else {
			paymentCache.update(insuranceCoverage.payment, function(result){
				func(result);
			});
		}
	}
	
	function removeInsuranceCoverage(insuranceCoverage, func){
		insuranceCoverageCache.removeInsuranceCoverage(insuranceCoverage, function(result){
			paymentCache.removePayment(insuranceCoverage.payment, function(result){
				func(result);
			}, result);
		});
	}
	
	function getInsuranceCoverageCost(query, func){
		paymentCache.getInsuranceCoverageCost(query, function(insuranceCoverageCost){
			func(insuranceCoverageCost);
		});
	}
	
	//*****************************************************************************************************


	//ENTITY REQUIREMENTS
	// attribute defs
	// xmlStr function
	// docToEntity
	// setVal function

	//BREAK UP THIS FILE
	//PlantingCache
	//HarvestCache
	//FieldCache
	//SaleCache
	//PaymentCache
	//ApplicantCache

}




