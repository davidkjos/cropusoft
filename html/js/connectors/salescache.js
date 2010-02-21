	function SalesCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var sales;
		var salesDoc;
		var sale;
		var reload = true;
		this.getSales = function(query, func){
	
			if (func) {

				var rVals = [];
				if (reload) {
					reload = false;
					get("getsales", "email=" + email, "Getting Sales", function(result){
						salesDoc = textToDoc(result);
						query = "";
						var filteredDoc = $(salesDoc).find("sale" + query);
						sales = loadArray(docToSale, filteredDoc);
						func(sales);
					});
				}
				else {
					var filteredDoc = $(salesDoc).find("sale" + query);
					sales = loadArray(docToSale, filteredDoc);
					func(sales);
				}
			}
			else {
				var filteredDoc = $(salesDoc).find("sale" + query);
				sales = loadArray(docToSale, filteredDoc);
				return sales;
			}
		}
		
		
		this.getSalesIncome = function(query){
			var salesIncome = {
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
			var cornSales = this.getSales("[crop=corn]");
			$.each(cornSales, function(){
				salesIncome.corn.bushels+=this.total;
				salesIncome.corn.income += this.total*this.price;
			});
			var soybeanSales = this.getSales("[crop=soybean]");
			$.each(soybeanSales, function(){
				salesIncome.soybean.bushels+=this.total;
				salesIncome.soybean.income += this.total*this.price;
			});
			var wheatSales = this.getSales("[crop=wheat]");
			$.each(wheatSales, function(){
				salesIncome.wheat.bushels+=this.total;
				salesIncome.wheat.income += this.total*this.price;
			});
			return salesIncome;
		}
		
	
	}