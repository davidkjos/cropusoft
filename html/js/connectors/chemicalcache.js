	function ChemicalCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var chemicals;
		var chemicalsDoc;
		var chemical;
		var reload = true;
		this.getChemicals = function(query, func){
			if (func) {
				var rVals = [];
				if (reload) {
					reload = false;
					get("getchemicals", "email=" + email, "Getting Chemicals", function(result){
						chemicalsDoc = textToDoc(result);
						var filteredDoc = $(chemicalsDoc).find("chemical");
						chemicals = loadArray(docToChemical, filteredDoc);
						func(chemicals);
					});
				}
				else {
					func(chemicals);
				}
			}
			else {
					var filteredDoc = $(chemicalsDoc).find("chemical"+query);
					chemicals = loadArray(docToChemical, filteredDoc);
					return chemicals;
			}
		}
		
		this.getChemicalsByCrop = function(query){
			var chemicalsByCrop = {corn:[],soybean:[],wheat:[]};
			chemicalsByCrop.corn = this.getChemicals("[crop=corn]");
			chemicalsByCrop.soybean = this.getChemicals("[crop=soybean]");
			chemicalsByCrop.wheat = this.getChemicals("[crop=wheat]");
			return chemicalsByCrop;
		}
		
	}