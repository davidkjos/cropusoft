	function PaymentCache(){
		//*******************************************************************************
		//getPlantings, getPlanting, savePlanting, editPlanting, removePlanting, getPlantedIncome
		var payments;
		var paymentsDoc;
		var payment;
		var reloadPayments = true;
		this.getPayments = function(func){
			var rVals = [];
			if (reloadPayments) {
				reloadPayments = true;
				get("getpayments", "email=" + email, "Getting Payments", function(result){
					paymentsDoc = textToDoc(result);
					var filteredDoc = $(paymentsDoc).find("payment");
					payments = loadArray(docToPayment, filteredDoc);
					func(payments);
				});
			}
			else {
				func(payments);
			}
		}
		
		this.getPayment = function(query){
			if (query!="[description=undefined]"){
				
					var payment;
					$(paymentsDoc).find("payment"+query).each(function(){
					payment = docToPayment(this);
					if (payment.amount=="undefined"){
						payment.amount = 11.1;
					}
					});
				return payment;
			}
			else {
				var payment = new PaymentEntity();
				payment.amount = 10;
				return payment;
			}
			
			
		}
		
		this.getFertilizerCosts = function(fertilizersByCrop){
			var fertilizerCosts = {
					corn:{acreage:0, cost:0}, 
					soybean:{acreage:0, cost:0}, 
					wheat:{acreage:0, cost:0}
			};
			$(fertilizersByCrop.corn).each(function(){
				fertilizerCosts.corn.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(fertilizersByCrop.soybean).each(function(){
				fertilizerCosts.soybean.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(fertilizersByCrop.wheat).each(function(){
				fertilizerCosts.wheat.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			return fertilizerCosts;
		}
		
		this.getChemicalCosts = function(chemicalsByCrop){
			var chemicalCosts = {
					corn:{acreage:0, cost:0}, 
					soybean:{acreage:0, cost:0}, 
					wheat:{acreage:0, cost:0}
			};
			$(chemicalsByCrop.corn).each(function(){
				chemicalCosts.corn.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(chemicalsByCrop.soybean).each(function(){
				chemicalCosts.soybean.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(chemicalsByCrop.wheat).each(function(){
				chemicalCosts.wheat.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			return chemicalCosts;
		}
		this.getInsuranceCosts = function(insurancesByCrop){
			var insuranceCosts = {
					corn:{acreage:0, cost:0}, 
					soybean:{acreage:0, cost:0}, 
					wheat:{acreage:0, cost:0}
			};
			$(insurancesByCrop.corn).each(function(){
				insuranceCosts.corn.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(insurancesByCrop.soybean).each(function(){
				insuranceCosts.soybean.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			$(insurancesByCrop.wheat).each(function(){
				insuranceCosts.wheat.cost += paymentCache.getPayment("[description="+this.description+"]").amount;
			});
			return insuranceCosts;
		}
		
		
		this.getPlantingCosts = function(plantingsByCrop, func){
			this.getPayments(function(){
				var plantingCosts = {
					corn:{acreage:0, cost:0}, 
					soybean:{acreage:0, cost:0}, 
					wheat:{acreage:0, cost:0}
				};
				$.each(plantingsByCrop.corn, function(){
					plantingCosts.corn.acreage += parseInt(this.acreage);
					var payment = paymentCache.getPayment("[description="+this.description+"]");
					plantingCosts.corn.cost += parseFloat(payment.amount);
				});
				$.each(plantingsByCrop.soybean, function(){
					plantingCosts.soybean.acreage += parseInt(this.acreage);
					var payment = paymentCache.getPayment("[description="+this.description+"]");
					plantingCosts.soybean.cost += parseFloat(payment.amount);
				});
				$.each(plantingsByCrop.wheat, function(){
					plantingCosts.wheat.acreage += parseInt(this.acreage);
					var payment = paymentCache.getPayment("[description="+this.description+"]");
					plantingCosts.wheat.cost += parseFloat(payment.amount);
				});
				func(plantingCosts);
			});
			
		}
	
		function buildQuery(query){
			var rVal = "";
			if (query.type == "planting") {
				rVal += "[type=" + query.crop + "_seed]";
			}
			return rVal;	
		}
	
		var paymentCache = this;

		
	}

	
	