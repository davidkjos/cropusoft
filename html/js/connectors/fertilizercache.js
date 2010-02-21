	function FertilizerCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var fertilizers;
		var fertilizersDoc;
		var fertilizer;
		var reload = true;
		this.getFertilizers = function(query, func){
			if (func) {
				var rVals = [];
				if (reload) {
					reload = false;
					get("getfertilizers", "email=" + email, "Getting Fertilizers", function(result){
						fertilizersDoc = textToDoc(result);
						var filteredDoc = $(fertilizersDoc).find("fertilizer");
						fertilizers = loadArray(docToFertilizer, filteredDoc);
						func();
					});
				}
				else {
					func(fertilizers);
				}
			}
			else {
					var filteredDoc = $(fertilizersDoc).find("fertilizer"+query);
					fertilizers = loadArray(docToFertilizer, filteredDoc);
					return fertilizers;
			}
		}
		
		this.getFertilizersByCrop = function(query){
			var fertilizersByCrop = {corn:[],soybean:[],wheat:[]};
			fertilizersByCrop.corn = this.getFertilizers("[crop=corn]");
			fertilizersByCrop.soybean = this.getFertilizers("[crop=soybean]");
			fertilizersByCrop.wheat = this.getFertilizers("[crop=wheat]");
			return fertilizersByCrop;
		}
		
	}