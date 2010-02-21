//HOMEMANAGER***************************
var HomeManager = function() {
	
	var buttons = new Array("buttons/jedit.png","buttons/plant.png",
							"buttons/jfertilize.png","buttons/spray.png",
							"buttons/jharvest.png","buttons/purchase.png",
							"buttons/sell.png","buttons/subsidize.png",
							"buttons/insure.png"
							);
	var farms;
	var fields;
	var purchases;
	var wheatSeed;
	var cornSeed;
	var soybeanSeed;
	var sections;
	
	function cleanup(){
		
	}
	
	
	this.disable = function(){
		
	}
	
	this.run = function(){
		$("#form_title").html("Home");
		$("#dialog_box").text("Welcome to Cropusoft!  Please Select an operation.");
		mapDisplay.setMapToNormal();
		var buttons = [];
		var button = new Button();
		
		button.name="edit_map";
		button.url="buttons/jedit.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new EditMapManager2();
			currentManager.run();
		}
		buttons.push(button);
		button = new Button();
		button.name="purchase";
		button.url="buttons/purchase.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new PurchaseManager();
			currentManager.run();
		}

		buttons.push(button);
		
		button = new Button();
		button.name="plant";
		button.url="buttons/plant.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new PlantManager();
			currentManager.run();
		}
		buttons.push(button);
		button = new Button();
		button.name="insurance";
		button.url="buttons/insurance.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new InsuranceManager();
			currentManager.run();
		}
		buttons.push(button);
		button = new Button();
		button.name="fertilize";
		button.url="buttons/jfertilize.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new FertilizeManager();
			currentManager.run();
		}
		buttons.push(button);
		button = new Button();
		button.name="spray";
		button.url="buttons/chemical.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new ChemicalManager();
			currentManager.run();
		}
		buttons.push(button);
		
		button = new Button();
		button.name="harvest";
		button.url="buttons/jharvest.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new HarvestManager();
			currentManager.run();
		}
		buttons.push(button);
		
		button = new Button();
		button.name="spray";
		button.url="buttons/storage.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new StorageManager();
			currentManager.run();
		}
		buttons.push(button);
		
		button = new Button();
		button.name="sell";
		button.url="buttons/sell.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new SaleManager();
			currentManager.run();
		}
		buttons.push(button);
		
		button = new Button();
		button.name="payments";
		button.url="buttons/payments.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new PaymentManager();
			currentManager.run();
		}
		buttons.push(button);
		
		button = new Button();
		button.name="receipts";
		button.url="buttons/receipts.png";
		button.action = function(){
			currentManager.disable();
			currentManager = new ReceiptManager();
			currentManager.run();
		}
		buttons.push(button);
		

		
		buttonDisplay.render(buttons);
	}
}
//END HOMEMANAGER***************************
