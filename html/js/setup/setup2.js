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



function setup(){

	$.ajaxSetup({ cache: false });
	price = new Price();
	
	//round all corners
	Rounded('default_box', 4, 4);
	
	//init displays and dbConnector
	mapDisplay = new MapDisplay();
	filterDisplay = new filterDisplay();
	accountingDisplay = new AccountingDisplay();
	dbConnector = new DbConnector();

	
	//show fields on map, and show farm/section/crop options in filter display
	dbConnector.getFields("all", "all", "all", function(fields){
		mapDisplay.displayFields(fields);
		//show farm options in filter
		dbConnector.getFarms(function(farms){
			filterDisplay.displayFarmOptions(farms);
		});
		//show section options in filter
		dbConnector.getSections("all", function(sections){
			mapDisplay.displaySectionOptions(sections);
		});
		//show crop options in filter
		dbConnector.getCrops("all", "all", function(sections){
			mapDisplay.displayCropOptions(sections);
		});
	});
	
	//indicate planted fields on map, show accruals and costs related to planting
	dbConnector.getPlantings("all", function(plantings){
		//change color of planted fields to appropriate color
		mapDisplay.indicatePlantedFields(plantings);
		dbConnector.getPlantingIncome(function(plantingIncome){
			accountingDisplay.displayPlantingIncome(plantingIncome);
		});
		dbConnector.getPlantingCosts(function(plantingCosts){
			accountingDisplay.displayPlantingCosts(plantedIncome);
		});
	});
	
	
	//indicate harvested fields on map, show accruals related to harvested crops, show sales
	dbConnector.getHarvests("all", function(harvests){
		//change color of harvested fields to appropriate color
		mapDisplay.indicateHarvestedFields(harvests);
		//Salse is EMBEDDED because dbConnector will need harvest information to calculate storage data
		dbConnector.getSalesIncome(function(salesIncome){
			accountingDisplay.displaySalesIncome(salesIncome);
			dbConnector.getStorageIncome(function(storageIncome){
				accountingDisplay.displayStorageIncome(storageIncome);
			});
		});
	});
	
	
}








