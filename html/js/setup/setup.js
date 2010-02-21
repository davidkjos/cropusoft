//EMAIL
var email = "davidkjos@yahoo.com";
//STATE MANAGER SINGLETON
var currentManager;
//DB CONNECTOR
var dbConnector;
//DISPLAYS
var mapDisplay;
var accountingDisplay;
var filterDisplay;
var calendarDisplay;
var formDisplay;
var loggingDisplay;

function setup(){
	$.ajaxSetup({ cache: false });
	Rounded('default_box', 4, 4);
	/*
	price = new Price();
	
	//round all corners
	
	
	//init displays and dbConnector
	
	filterDisplay = new FilterDisplay();
	accountingDisplay = new AccountingDisplay();
	formDisplay = new FormDisplay();
	calendarDisplay = new CalendarDisplay();
	
	*/
	//mapDisplay = new MapDisplay("map_box_map");
	accountingDisplay = new AccountingDisplay();
	dbConnector = new DbConnector();
	loggingDisplay = new LoggingDisplay();
	calendarDisplay = new CalendarDisplay();
	formDisplay = new FormDisplay();
	
	//show fields on map, and show farm/section/crop options in filter display
	var query = {};
	dbConnector.getFields(query, function(fields){		
		//mapDisplay.showFields(fields);	
		query = {type:"planting", crop:"corn"};
		dbConnector.getPlantingCosts(query, function(plantingCosts){
			accountingDisplay.showPlantingCosts(plantingCosts);
		});
		
		dbConnector.getPlantedIncome(query, function(plantedIncome){
			dbConnector.getSales(query, function(sales){
				accountingDisplay.showPlantedIncome(plantedIncome);
				var salesIncome = dbConnector.getSalesIncome();
				accountingDisplay.showSalesIncome(salesIncome);
				var harvestedIncome =  dbConnector.getHarvestedIncome();
				accountingDisplay.showHarvestedIncome(harvestedIncome);
				accountingDisplay.calculateIncome();
			});
		});
		
		dbConnector.getPayments("", function(payments){
			
			dbConnector.getFertilizers(query, function(fertilizers){
				var fertilizerCosts = dbConnector.getFertilizerCosts(query);
				accountingDisplay.showFertilizerCosts(fertilizerCosts);	
			});
			dbConnector.getChemicals(query, function(fertilizers){
				var chemicalCosts = dbConnector.getChemicalCosts(query);
				accountingDisplay.showChemicalCosts(chemicalCosts);	
			});
			dbConnector.getInsurances(query, function(insurances){
				var insuranceCosts = dbConnector.getInsuranceCosts(query);
				accountingDisplay.showInsuranceCosts(insuranceCosts);	
				accountingDisplay.caculateCosts();
			});
			var dates = [];
			$.each(payments, function(){
				dates.push(this.date);
			});
			calendarDisplay.showDates(dates);
			currentManager = new HomeManager();
		});
	});
	

}
var currentManager;

function HomeManager(){
	formDisplay.toggleToMainMenu();
	var button = new Button("images/plant_button1.png", "plant_button", function(){
		currentManager = new PlantManager2();
	});
	formDisplay.addButton(button);
	button = new Button("images/fertilize_button1.png", "fertilize_button", function(){
		currentManager = new FertilizeManager2();
	});
	formDisplay.addButton(button);
}

function FertilizeManager2(){
	this.acreage = 123;	
	this.fertilization = function(){
		this.farm;
	}
	var fertilizers = [];
	fertilizers.push({
		name:"phosphate mix1", 
		phosphate:20,
		nitrogen:52,
		potassium:0, 
		appunits:"Liters",
		priceunits:"Liters", 
		appconversion:80000,
		priceconversion: 1
	});
	fertilizers.push({
		name:"potash3", 
		phosphate:5,
		nitrogen:3,
		potassium:34, 
		appunits:"Gallons",
		priceunits:"Liters", 
		appconversion:1,
		priceconversion: 1
	});
	fertilizers.push({
		name:"nitro 1000", 
		phosphate:0,
		nitrogen:52,
		potassium:0, 
		appunits:"Ounces",
		priceunits:"Liters", 
		appconversion:1,
		priceconversion: 1
	});
	
	
		var steps = [];
		var checkboxForms = new CheckboxForms(fertilizers);
		steps.push({
			title:"Select Fertilizers", 
			select: function(fertilizerName){
				currentManager.fertilization.fertilizers.push(fertilizerName);
				},
			unselect: function(fertilizerName){
				currentManager.fertilization.fertilizers.remove(fertilizerName)
				},
			form: checkboxForms,
			next:  function(){
				alert("next");
			}
		});
		formDisplay.toggleToNewForm(steps);
}

function PlantManager2(){
	
	this.acreage = 100;
	var seeds = [];
	seeds.push({
		name:"LOL22", 
		crop:"corn", 
		appunits:"Kernal",
		priceunits:"Bag", 
		appconversion:80000,
		priceconversion: 1
	});
	seeds.push({
		name:"LOL11", 
		crop:"corn", 
		appunits:"Kernal",
		priceunits:"Bag", 
		appconversion:80000,
		priceconversion: 1
	});
	seeds.push({
		name:"SB890", 
		crop:"soybean", 
		appunits:"Kernal",
		priceunits:"Lb", 
		appconversion:150,
		priceconversion:50
	});
	seeds.push({
		name:"WHEAT123", 
		crop:"wheat", 
		appunits:"Bushel",
		priceunits:"Bushel", 
		appconversion:1,
		priceconversion:1
	});
	seeds.push({
		name:"Pioneer", 
		crop:"corn", 
		appunits:"kernal",
		priceunits:"kernal", 
		appconversion:1,
		priceconversion:80000
	});
	
	this.handleCancel = function(){
		currentManager = HomeManager();
	}
	
	this.planting = function(){
		this.farm;
	}
	
	var steps = [];
		var radioForms = new RadioForms(seeds);
		steps.push({
			title:"Select Seed", 
			select: function(seedName){
				currentManager.planting.seed = seedName;
				},
			form: radioForms,
			next:  function(){
				alert("next");
			}
		});
	formDisplay.toggleToNewForm(steps);
		
		
	this.refresh = function(){
		currentManager = new PlantManager2();
	}
	
	this.handleForm = function(){
		
		
		
		//STEP 1 select farm
	/*	
		var inputs = [];
		var steps = [];
		var items = [];
		items.push({label:"296", value:"296"});
		items.push({label:"1281", value:"1281"});
		items.push({label:"904", value:"904"});
		items.push({label:"512", value:"512"});
		var farmOptions = new Radio("Farm", "farm_option", items);
		inputs.push(farmOptions);
		steps.push({
			title:"Select Farm", 
			next: function(){
				currentManager.planting.farm = farmOptions.getResult();
				formDisplay.feedback("Farm", currentManager.planting.farm);
			},
			inputs: inputs
		})
		
		//STEP 2 select crop
		
		inputs = [];
		items = [];
		items.push({label:"Corn", value:"corn"});
		items.push({label:"Soybean", value:"soybean"});
		items.push({label:"Wheat", value:"wheat"});
		var cropOptions = new Radio("Crop", "crop_option", items);
		inputs.push(cropOptions);
		steps.push({
			title:"Select Crop", 
			html: cropOptions.html,
			next: function(){
				currentManager.planting.crop = cropOptions.getResult();
				formDisplay.feedback("Crop", currentManager.planting.crop);
			},
			inputs: inputs
		})

		inputs = [];
		items = [];
		$.each(seeds, function(){
			items.push({label:this.name, value:this.name});
		});
		var seedOptions = new Radio("Seed", "seed_option", items);
		inputs.push(seedOptions);
		steps.push({
			title:"Select Seed", 
			html: seedOptions.html,
			next: function(){
				currentManager.planting.seed = seedOptions.getResult();
				formDisplay.feedback("Seed", currentManager.planting.seed);
			},
			inputs: inputs
		})
		
		items = [];
		inputs = [];
		items.push({label:"Price", value:"price"});
		var priceEntry = new TextBox("Price", items);
		inputs.push(priceEntry);
		items = [];
		items.push({label:"Amount", value:"amount"});
		var amountEntry = new TextBox("Amount", items);
		inputs.push(amountEntry);
		steps.push({
			title:"Enter Price", 
			html: priceEntry.html,
			next: function(){
				currentManager.planting.seedPrice = priceEntry.getResult();
				formDisplay.feedback("Price", currentManager.planting.seedPrice);
			},
			inputs: inputs
		})
		
		
		
		
		formDisplay.toggleToNewForm(steps);
*/
		//STEP 8 select treatments
		//STEP 7 enter vendor
		//STEP 9 enter description
		
	}
	
}
		/*
		mapDisplay.displayFields(fields);
		var farms = dbConnector.getFarms;
		var crops = dbConnector.getCrops;
		var sections = dbConnector.getSections;
		filterDisplay.displayFarms(farms);
		filterDisplay.displaySections(sections);
		filterDisplay.displayCrops(crops);
		filterDisplay.displayHarvests(harvests);
		filterDisplay.enableListener(function(selectedValue){
			//calendar update given selected value
			//accounting update given selected value
			//map update given selected value
		});	 
		dbConnector.getDates(query, function(dates){
			calendarDisplay.displayDates(dates);
		});
		//accounting information must be initialized
		
		formDisplay.toggleToMainMenu();
		formDisplay.enableMainMenuListener(function(selectedValue){
			currentManager = selectedValue.manager;
			currentManager.run();
		});	
		currentManager = new HomeManager();
		currentManager.run();
		*/









