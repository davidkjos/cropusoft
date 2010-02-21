	function InsuranceCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var insurances;
		var insurancesDoc;
		var insurance;
		var reload = true;
		this.getInsurances = function(query, func){
			if (func) {
				var rVals = [];
				if (reload) {
					reload = false;
					get("getinsurance", "email=" + email, "Getting Insurance", function(result){
						insurancesDoc = textToDoc(result);
						insurances = loadArray(docToInsurance, filteredDoc);
						func(insurances);
					});
				}
				else {
					func(insurances);
				}
			}
			else {
					var filteredDoc = $(insurancesDoc).find("insurance"+query);
					insurances = loadArray(docToInsurance, filteredDoc);
					return insurances;
			}
		}
		
		this.getInsurancesByCrop = function(query){
			var insurancesByCrop = {corn:[],soybean:[],wheat:[]};
			insurancesByCrop.corn = this.getInsurances("[crop=corn]");
			insurancesByCrop.soybean = this.getInsurances("[crop=soybean]");
			insurancesByCrop.wheat = this.getInsurances("[crop=wheat]");
			return insurancesByCrop;
		}
		
	}