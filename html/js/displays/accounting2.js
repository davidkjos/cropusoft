var AccountingDisplay = function(){
	var harvestedCornBushels = 0;
	var harvestedWheatBushels = 0;
	var harvestedSoybeanBushels = 0;
	var unharvestedCornBushels = 0;
	var unharvestedWheatBushels = 0;
	var unharvestedSoybeanBushels = 0;
	var soldCornBushels = 0;
	var soldWheatBushels = 0;
	var soldSoybeanBushels = 0;
	var sCornIncome = 0;
	var sSoybeanIncome = 0;
	var sWheatIncome = 0;


	var totalCornBushels = 0;
	var totalWheatBushels = 0;
	var totalSoybeanBushels = 0;

	var cornPrice = 3;
	var wheatPrice = 6.30;
	var soybeanPrice = 11.50;
	
	var uCornIncome;
	var uSoybeanIncome;
	var uWheatIncome;
	var hCornIncome;
	var hSoybeanIncome;
	var hWheatIncome;

	var tCornIncome = 0;
	var tSoybeanIncome = 0;
	var tWheatIncome = 0;
	var tIncome;


	this.refresh = function(){

		this.addFields(fieldCache.fields);
		this.addStorages();
		this.addSales();
		this.calculate();
	}

	this.calculate = function(){
		tCornIncome = uCornIncome + hCornIncome + sCornIncome;
		tSoybeanIncome = uSoybeanIncome + hSoybeanIncome + sSoybeanIncome;
		tWheatIncome = uWheatIncome + hWheatIncome + sWheatIncome;
		tIncome = tCornIncome + tSoybeanIncome + tWheatIncome;
		totalCornBushels = harvestedCornBushels + unharvestedCornBushels + soldCornBushels;
		totalSoybeanBushels = harvestedSoybeanBushels + unharvestedSoybeanBushels + soldSoybeanBushels;
		totalWheatBushels = harvestedWheatBushels + unharvestedWheatBushels + soldWheatBushels;
		$("#tCornBushels").text(addCommas2(totalCornBushels) + " Bushels");
		$("#tCornIncome").html(addCommas(tCornIncome));
		$("#tSoybeanBushels").text(addCommas2(totalSoybeanBushels) + " Bushels");
		$("#tSoybeanIncome").html(addCommas(tSoybeanIncome));
		$("#tWheatBushels").text(addCommas2(totalWheatBushels) + " Bushels");
		$("#tWheatIncome").html(addCommas(tWheatIncome));
		$(".tIncome").each(function(){
			$(this).text(addCommas(tIncome));
		});
		$("#net").text(addCommas(tIncome));
	}
	
	this.addSales = function(cornSales, soybeanSales, wheatSales){

		
		 soldCornBushels = saleCache.getAmounts("corn")[0];
		 soldWheatBushels = saleCache.getAmounts("wheat")[0];
		 soldSoybeanBushels = saleCache.getAmounts("soybean")[0];
		 sCornIncome = saleCache.getAmounts("corn")[1];
		 sSoybeanIncome =saleCache.getAmounts("wheat")[1];
		 sWheatIncome =  saleCache.getAmounts("soybean")[1];

		$("#sCornBushels").text(addCommas2(saleCache.getAmounts("corn")[0]) + " Bushels");
		$("#sCornIncome").html(addCommas(saleCache.getAmounts("corn")[1]));
		$("#sSoybeanBushels").text(addCommas2(saleCache.getAmounts("soybean")[0]) + " Bushels");
		$("#sSoybeanIncome").html(addCommas(saleCache.getAmounts("soybean")[1]));
		$("#sWheatBushels").text(addCommas2(saleCache.getAmounts("wheat")[0]) + " Bushels");
		$("#sWheatIncome").html(addCommas(saleCache.getAmounts("wheat")[1]));
		var total = saleCache.getAmounts("corn")[1]+saleCache.getAmounts("soybean")[1]+saleCache.getAmounts("wheat")[1];
		$("#sTotal").html(addCommas(total));
	}
	
	this.addStorages = function(){
		
		
		harvestCache.getHarvests();
		var corn = harvestCache.getCorn() - saleCache.getAmounts("corn")[0];
		var soybean = harvestCache.getSoybean() - saleCache.getAmounts("soybean")[0];
		var wheat = harvestCache.getWheat() - saleCache.getAmounts("wheat")[0];
		
		hCornIncome = cornPrice*corn;
		hSoybeanIncome = soybeanPrice*soybean;
		hWheatIncome = wheatPrice*wheat;
		harvestedCornBushels = corn;
		harvestedSoybeanBushels = soybean;
		harvestedWheatBushels = wheat;
		
		
		$("#hCornBushels").text(addCommas2(corn) + " Bushels");
		$("#hCornIncome").html(addCommas(hCornIncome));
		
		$("#hWheatBushels").text(addCommas2(wheat) + " Bushels");
		$("#hWheatIncome").html(addCommas(hWheatIncome));
		
		$("#hSoybeanBushels").text(addCommas2(soybean) + " Bushels");
		$("#hSoybeanIncome").html(addCommas(hSoybeanIncome));
		
		$("#hTotal").html(addCommas(hCornIncome+hSoybeanIncome+hWheatIncome));
	}
	
	this.displayPlantedIncome = function(fields){
		
		$.each(fields, function(){
			var field = this;
			if (field.crop=="corn"){
				if (!field.isHarvested) {
					
					var bushels = parseInt(field.acreage) * parseInt(field.cornYield);
					unharvestedCornBushels += bushels;
				}
				else {
					//get bushels from harvest cache
				}
			}
			if (field.crop=="wheat"){
				if (!field.isHarvested) {
					var bushels = parseInt(field.acreage) * parseInt(field.wheatYield);
					unharvestedWheatBushels += bushels;
				}
				else {
					//get bushels from harvest cache
				}
			}
			if (field.crop=="soybean"){
				if (!field.isHarvested) {
					var bushels = parseInt(field.acreage) * parseInt(field.soybeanYield);
					unharvestedSoybeanBushels += bushels;
				}
				else {
					//get bushels from harvest cache
				}
			}
	    });	
		uCornIncome = unharvestedCornBushels*cornPrice;
		uSoybeanIncome = unharvestedSoybeanBushels*soybeanPrice;
		uWheatIncome = unharvestedWheatBushels*wheatPrice;
		
		$("#uCornBushels").text(addCommas2(unharvestedCornBushels) + " Bushels");
		$("#uCornIncome").html(addCommas(uCornIncome));
		
		$("#uWheatBushels").text(addCommas2(unharvestedWheatBushels) + " Bushels");
		$("#uWheatIncome").html(addCommas(uWheatIncome));
		
		$("#uSoybeanBushels").text(addCommas2(unharvestedSoybeanBushels) + " Bushels");
		$("#uSoybeanIncome").html(addCommas(uSoybeanIncome));
		
		$("#uTotal").html(addCommas(uCornIncome+uSoybeanIncome+uWheatIncome));
	}
	
}
var LossDisplay = function(){
	
	this.refresh = function(){
		$("#corn_planted_acres").html(addCommas2(plantCache.totalPlantedCornAcres)+" Acres");
		$("#corn_planting_cost").html(addCommas(truncate(plantCache.totalPlantingCornCost)));
		$("#soybean_planted_acres").html(addCommas2(plantCache.totalPlantedSoybeanAcres)+" Acres");
		$("#soybean_planting_cost").html(addCommas(truncate(plantCache.totalPlantingSoybeanCost)));
		$("#wheat_planted_acres").html(addCommas2(plantCache.totalPlantedWheatAcres)+" Acres");
		$("#wheat_planting_cost").html(addCommas(truncate(plantCache.totalPlantingWheatCost)));
		$("#total_planted_acres").html(addCommas2(plantCache.totalPlantedCornAcres+plantCache.totalPlantedWheatAcres+plantCache.totalPlantedSoybeanAcres)+" Acres");
		$("#total_planting_cost").html(addCommas(truncate(plantCache.totalPlantingWheatCost+plantCache.totalPlantingCornCost+plantCache.totalPlantingSoybeanCost)));
	}
	
	
	
}

