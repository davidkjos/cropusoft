

	
	//PLANT
	var PlantManager = function(){
		
		
		this.showTransactionHistory = function(){
			//create transaction history 2d array
				//get all plantings from dbconnector
				//load each array with
					//description
					//date
					//crop
					//acres
					
			//pass array to form display
			//enable select transaction listener
			//enable home listener
			//enable new listener
		}
		
		this.showTransaction = function(){
			//create attribute list in array
				//load each array with
					//label
					//value
					//attribute symbol (to be used for editting)
			//pass array to form display
			//enable select attribute listener
			//enable cancel listener
			//enable remove listener 
		}
		this.runNewTransactionForm = function(){
			//create array of form steps using "formFactory"
			//pass form steps into form display
		}
		
		function formFactory(){

			var steps = [];
			
			//Step 1: select crop
			var step = new FormStep();
			step.text = "Select Crop.";
			var cropRadio = new htmlTools.Radio();
			var crops = dbConnector.getCrops();
			$.each(crops, function(){
				cropRadio.push(this, this)
			});
			step.input = cropRadio.render();
			step.func = function(selection){
				planting.crop = selection;
			}
			step.feedback = "Crop:"+planting.crop;
			steps.push(step);
			
			//Step 2: select fields
			//step.input = "SELECT_FIELD";
			
		}
		
	}






