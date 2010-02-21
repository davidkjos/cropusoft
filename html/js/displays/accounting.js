var AccountingDisplay = function(pDivId){
	
	var divId;
	
	var plantedIncome;
	var storedIncome;
	var salesIncome;
	var insuranceIncome;
	var plantingCosts;
	var fertilizationCosts;
	var chemicalizationCosts;
	var insuranceCosts;
	
	function updateCosts(){
		
	}
	function updateIncome(){
		
	}
	
	this.displayPlantedIncome = function(stats){
		
	}
	this.displayInsuranceIncome = function(stats){
		
	}
	this.displayStoredIncome = function(stats){
		
	}
	this.displaySalesIncome = function(stats){
		
	}
	
	var tPlantingCost;
	var tFertilizerCost;
	var tChemicalCost;
	var tInsuranceCost;
	
	this.showPlantingCosts = function(plantingCosts){
		$("#corn_planted_acres").text(inAcres(plantingCosts.corn.acreage));
		$("#soybean_planted_acres").text(inAcres(plantingCosts.soybean.acreage));
		$("#wheat_planted_acres").text(inAcres(plantingCosts.wheat.acreage));
		$("#corn_planting_cost").text(inDollars(plantingCosts.corn.cost));
		$("#soybean_planting_cost").text(inDollars(plantingCosts.soybean.cost));
		$("#wheat_planting_cost").text(inDollars(plantingCosts.wheat.cost));
		tPlantingCost = plantingCosts.corn.cost+plantingCosts.soybean.cost+plantingCosts.wheat.cost;
		$("#total_planting_cost").text(inDollars(tPlantingCost));
	}
	this.showFertilizerCosts = function(fertilizerCosts){
		$("#corn_fertilizer_cost").text(inDollars(fertilizerCosts.corn.cost));
		$("#soybean_fertilizer_cost").text(inDollars(fertilizerCosts.soybean.cost));
		$("#wheat_fertilizer_cost").text(inDollars(fertilizerCosts.wheat.cost));
		tFertilizerCost = fertilizerCosts.corn.cost+fertilizerCosts.soybean.cost+fertilizerCosts.wheat.cost;
		$("#total_fertilizer_cost").text(inDollars(tFertilizerCost));
	}
	this.showChemicalCosts = function(chemicalCosts){
		$("#corn_chemical_cost").text(inDollars(chemicalCosts.corn.cost));
		$("#soybean_chemical_cost").text(inDollars(chemicalCosts.soybean.cost));
		$("#wheat_chemical_cost").text(inDollars(chemicalCosts.wheat.cost));
		tChemicalCost = chemicalCosts.corn.cost+chemicalCosts.soybean.cost+chemicalCosts.wheat.cost;
		$("#total_chemical_cost").text(inDollars(tChemicalCost));
	}
	this.showInsuranceCosts = function(insuranceCosts){
		$("#corn_insurance_cost").text(inDollars(insuranceCosts.corn.cost));
		$("#soybean_insurance_cost").text(inDollars(insuranceCosts.soybean.cost));
		$("#wheat_insurance_cost").text(inDollars(insuranceCosts.wheat.cost));
		tInsuranceCost = insuranceCosts.corn.cost+insuranceCosts.soybean.cost+insuranceCosts.wheat.cost;
		$("#total_insurance_cost").text(inDollars(tInsuranceCost));
	}
	
	var plantedIncome;
	var salesIncome;
	var harvestedIncome;
	var totalIncome;
	var plantedTotal;
	var salesTotal;
	var harvestedTotal;
	

	
	this.showPlantedIncome = function(pPlantedIncome){
		plantedIncome=pPlantedIncome;
		$("#uCornBushels").text(inBushels(plantedIncome.corn.bushels));
		$("#uSoybeanBushels").text(inBushels(plantedIncome.soybean.bushels));
		$("#uWheatBushels").text(inBushels(plantedIncome.wheat.bushels));
		$("#uCornIncome").text(inDollars(plantedIncome.corn.income));
		$("#uSoybeanIncome").text(inDollars(plantedIncome.soybean.income));
		$("#uWheatIncome").text(inDollars(plantedIncome.wheat.income));
		plantedTotal = plantedIncome.corn.income+plantedIncome.soybean.income+plantedIncome.wheat.income;
		$("#uTotal").text(inDollars(plantedTotal));
	}
	this.showSalesIncome = function(pSalesIncome){
		salesIncome=pSalesIncome;
		$("#sCornBushels").text(inBushels(salesIncome.corn.bushels));
		$("#sSoybeanBushels").text(inBushels(salesIncome.soybean.bushels));
		$("#sWheatBushels").text(inBushels(salesIncome.wheat.bushels));
		$("#sCornIncome").text(inDollars(salesIncome.corn.income));
		$("#sSoybeanIncome").text(inDollars(salesIncome.soybean.income));
		$("#sWheatIncome").text(inDollars(salesIncome.wheat.income));
		salesTotal = salesIncome.corn.income+salesIncome.soybean.income+salesIncome.wheat.income;
		$("#sTotal").text(inDollars(salesTotal));
	}
	this.showHarvestedIncome = function(pHarvestedIncome){
		harvestedIncome = pHarvestedIncome;
		$("#hCornBushels").text(inBushels(harvestedIncome.corn.bushels));
		$("#hSoybeanBushels").text(inBushels(harvestedIncome.soybean.bushels));
		$("#hWheatBushels").text(inBushels(harvestedIncome.wheat.bushels));
		$("#hCornIncome").text(inDollars(harvestedIncome.corn.income));
		$("#hSoybeanIncome").text(inDollars(harvestedIncome.soybean.income));
		$("#hWheatIncome").text(inDollars(harvestedIncome.wheat.income));
		harvestedTotal = harvestedIncome.corn.income+harvestedIncome.soybean.income+harvestedIncome.wheat.income;
		$("#hTotal").text(inDollars(harvestedTotal));
	}
	var income;
	this.calculateIncome = function(){
		totalIncome = {
				corn: {
					bushels: 0,
					income: 0
				},
				soybean: {
					bushels: 0,
					income: 0
					},
				wheat: {
					bushels: 0,
					income: 0
				}
		};
		totalIncome.corn.bushels = plantedIncome.corn.bushels+salesIncome.corn.bushels+harvestedIncome.corn.bushels;
		totalIncome.soybean.bushels = plantedIncome.soybean.bushels+salesIncome.soybean.bushels+harvestedIncome.soybean.bushels;
		totalIncome.wheat.bushels = plantedIncome.wheat.bushels+salesIncome.wheat.bushels+harvestedIncome.wheat.bushels;
		
		totalIncome.corn.income = plantedIncome.corn.income+salesIncome.corn.income+harvestedIncome.corn.income;
		totalIncome.soybean.income = plantedIncome.soybean.income+salesIncome.soybean.income+harvestedIncome.soybean.income;
		totalIncome.wheat.income = plantedIncome.wheat.income+salesIncome.wheat.income+harvestedIncome.wheat.income;
		
		income = totalIncome.corn.income+totalIncome.soybean.income+totalIncome.wheat.income;
		$("#tCornBushels").text(inBushels(totalIncome.corn.bushels));
		$("#tSoybeanBushels").text(inBushels(totalIncome.soybean.bushels));
		$("#tWheatBushels").text(inBushels(totalIncome.wheat.bushels));
		$("#tCornIncome").text(inDollars(totalIncome.corn.income));
		$("#tSoybeanIncome").text(inDollars(totalIncome.soybean.income));
		$("#tWheatIncome").text(inDollars(totalIncome.wheat.income));
		$(".tIncome").each(function(){
			$(this).text(inDollars(income));	
		});	
		
		
	}
	var totalCost;
	this.caculateCosts = function(){
		totalCost = tPlantingCost+tFertilizerCost+tChemicalCost+tInsuranceCost;
		$(".tCost").each(function(){
			$(this).text(inDollars(totalCost));	
		});	
		var net = income-totalCost;
		$("#net").text(inDollars(net));
	}
}



	
function inAcres(acreage){
	return addCommas(acreage)+" Acres";
}
function inBushels(acreage){
	return addCommas(acreage)+" Bushels";
}
function inDollars(amount){
	return "$"+addCommas(amount);
}

