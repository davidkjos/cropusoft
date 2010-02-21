	function HarvestCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var harvests;
		var harvestsDoc;
		var harvest;
		var reloadHarvests = true;
		this.getHarvests = function(query, func){
			if (func) {
				var rVals = [];
				if (reloadHarvests) {
					reloadHarvests = false;
					get("getharvests", "email=" + email, "Getting Harvests", function(result){
						harvestsDoc = textToDoc(result);
						var filteredDoc = $(harvestsDoc).find("harvest");
						harvests = loadArray(docToHarvest, filteredDoc);
						func(harvests);
					});
				}
				else {
					func(harvests);
				}
			}
			else {
				var filteredDoc = $(harvestsDoc).find("harvest"+query);
				harvests = loadArray(docToHarvest, filteredDoc);
				return harvests;
			}
		}
		
		this.setHarvestedFields = function(fields, func){
			this.getHarvests("", function(){
				$.each(fields, function(){
					
					if (this.name.match("'"))
							this.name = "broken named field";
				
					if ($(harvestsDoc).find("field[name='" + this.name + "']").parent().parent().attr("crop")){
						this.harvested = true;
					}
				});
				func(fields);
			});
		}
		
		this.getHarvestedIncome = function(query){
			var harvestedIncome = {
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
			var bushels = 0;
			var income = 0;
			var cornHarvests = this.getHarvests("[crop=corn]");
			$.each(cornHarvests, function(){
				harvestedIncome.corn.bushels+=this.total;
				harvestedIncome.corn.income += this.total*3;
			});
			var soybeanHarvests = this.getHarvests("[crop=soybean]");
			$.each(soybeanHarvests, function(){
				harvestedIncome.soybean.bushels+=this.total;
				harvestedIncome.soybean.income += this.total*10;
			});
			var wheatHarvests = this.getHarvests("[crop=wheat]");
			$.each(wheatHarvests, function(){
				harvestedIncome.wheat.bushels+=this.total;
				harvestedIncome.wheat.income += this.total*7;
			});
			return harvestedIncome;
		}
		
	}