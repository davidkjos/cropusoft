var InventoryDisplay = function(){

	//get all used inventory here......
	var cornSeed;
	this.setCornSeed = function(val){
		cornSeed = val;
	}
	var wheatSeed;
	this.setWheatSeed = function(val){
		wheatSeed = val;
	}
	var soybeanSeed;
	this.setSoybeanSeed = function(val){
		soybeanSeed = val;
	}
	var chemical;
	this.setChemical = function(val){
		chemical = val;
	}
	var fertilizer;
	this.setFertilizer = function(val){
		fertilizer = val;
	}
	var harvests;
	this.setHarvests = function(val){
		harvests = val;
	}
	
	var cornTotal;
	this.setCornTotal = function(val){
		cornTotal = val;
	}
	var soybeanTotal;
	this.setSoybeanTotal = function(val){
		soybeanTotal = val;
	}
	var wheatTotal;
	this.setWheatTotal = function(val){
		wheatTotal = val;
	}
	
	this.refresh = function(){
		

		storageCache.getStorages();
		this.setCornTotal(storageCache.getCorn() - saleCache.getAmounts("corn")[0]);
		this.setSoybeanTotal(storageCache.getSoybean() - saleCache.getAmounts("soybean")[0]);
		this.setWheatTotal(storageCache.getWheat() - saleCache.getAmounts("wheat")[0]);
		this.renderHarvested();

	}
	
	
	this.renderPurchased = function(){
		$("#purchased_inventory").append("<tr><td><b>Corn Seed:</b></td></tr>");
		$.each(cornSeed, function(){
			var total = plantCache.getUsedAmount(this.product);
			var kernals = this.amount * this.conversion;
			var diff = kernals - total;
			if (diff>0) 
				$("#purchased_inventory").append("<tr><td>" + this.product + "</td><td>" + diff + " Kernals</td></tr>");
		});
		$("#purchased_inventory").append("<tr><td><b>Wheat Seed:</b></td></tr>");
		$.each(wheatSeed, function(){
			$("#purchased_inventory").append("<tr><td>" + this.product + "</td><td>" + this.amount + " " + this.units + "</td></tr>");
		});
		$("#purchased_inventory").append("<tr><td><b>Soybean Seed:</b></td></tr>");
		$.each(soybeanSeed, function(){
			$("#purchased_inventory").append("<tr><td>" + this.product + "</td><td>" + this.amount + " " + this.units + "</td></tr>");
		});
		$("#purchased_inventory").append("<tr><td><b>Chemical:</b></td></tr>");
		$.each(chemical, function(){
			$("#purchased_inventory").append("<tr><td>" + this.product + "</td><td>" + this.amount + " " + this.units + "</td></tr>");
		});
		$("#purchased_inventory").append("<tr><td><b>Fertilizer:</b></td></tr>");
		$.each(fertilizer, function(){
			$("#purchased_inventory").append("<tr><td>" + this.product + "</td><td>" + this.amount + " " + this.units + "</td></tr>");
		});
	}
	this.renderHarvested = function(){
		if (cornTotal > 0){
			$("#harvested_inventory").html("<tr><td><b>Corn:</b></td></tr>");
			$("#harvested_inventory").append("<tr><td>On Farm:</td><td>" + addCommas2(cornTotal) + " Bushels</td></tr>");
		}
		if (soybeanTotal > 0){
			$("#harvested_inventory").append("<tr><td><b>Soybean:</b></td></tr>");
			$("#harvested_inventory").append("<tr><td>On Farm:</td><td>" + addCommas2(soybeanTotal) + " Bushels</td></tr>");
		}
		if (wheatTotal > 0){
			$("#harvested_inventory").append("<tr><td><b>Wheat:</b></td></tr>");
			$("#harvested_inventory").append("<tr><td>On Farm:</td><td>" + addCommas2(wheatTotal) + " Bushels</td></tr>");
		}

	}
	
	
	
	
}
