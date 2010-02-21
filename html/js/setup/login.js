var mapDisplay;
var loggingDisplay;
var currentManager;
var dbConnector;

var loginPage;

var session;
function Session(){
	this.userId = null;
}

function toggleToLogin(){
	$("#map_draw_div").addClass("hide");
	$("#login_div").removeClass("hide");
}
function toggleToMap(){
	$("#login_div").addClass("hide");
	$("#map_draw_div").removeClass("hide");
}

function initLogin(){
	session = new Session();
	$.ajax({
			url: "login.htm",
			type: 'GET',
			dataType: 'html',
			success: function(loginPage){
				$("body").append(loginPage);
				enableLoginListeners();
			}
		});
}

var currentSection;
function enableLoginListeners(){
	toggleToLogin();
	$("#email_input").attr("value", "");
	$("#password_input").attr("value", "");
	$("#n_input").attr("value", "");
	$("#w_input").attr("value", "");
	$("#s_input").attr("value", "");
	
	$("body").append(loginPage);
	$("#login_button").click(function(){
		var email = $("#email_input").attr("value");
		var password = $("#password_input").attr("value");
		
	});
	$("#try_button").click(function(){
		$("#try_button").unbind("click");
		var section = {n:0,w:0,s:0};
		
		section.n = $("#n_input").attr("value");
		section.w = $("#w_input").attr("value");
		section.s = $("#s_input").attr("value");
		currentSection = section;
		//mapDisplay.showSection(section);
		setupMap();
		currentManager = new DrawFieldManager(section);
	});
}

function setupMap(){
	toggleToMap();
	mapDisplay = new MapDisplay("map_draw_box");
	dbConnector = new DbConnector();
}


//Button(url, id, action){
function DrawFieldManager(pSection){

	loggingDisplay = new LoggingDisplay();
	dbConnector.getSection(pSection, function(section){
		mapDisplay.displaySection(section);
		var northText = new TextBox("N:", "n");
		$("#text_box").append(northText.html);
		northText.setValue(currentSection.n);
		
		var westText = new TextBox("W", "w");
		$("#text_box").append(westText.html);
		northText.setValue(currentSection.n);
		
		var sectionText = new TextBox("s", "s");
		$("#text_box").append(sectionText.html);
		northText.setValue(currentSection.n);
		
		var plantButton = new Button("images/insure.png", "insure_button", function(){
			currentSection.n = northText.value();
			currentSection.w = westText.value();
			currentSection.s = sectionText.value();
			//currentManager = new DrawFieldManager(currentSection);
		});
		$("#text_box").append(plantButton.html);
		plantButton.enableListener();
		
		
		
		
		
		
		
		var cancelButton = new Button("images/cancel_button1.png", "cancel_button", function(){
			enableLoginListeners();
		});
		$("#map_form").append(cancelButton.html);
		cancelButton.enableListener();
		mapDisplay.satelliteMode();
		
		
		mapDisplay.enableAddPegsListener(function(){
			mapDisplay.disableListeners();
			mapDisplay.enableMovePegListener(function(){
				
				
				
				var saveButton = new Button("images/add_button1.png", "save_button", function(){
					saveFieldListener();
				});
				
				$("#map_form").append(saveButton.html);
				saveButton.enableListener();

			});
		});
	});
	
	var fieldNameText;
	var farmText;
	
	function saveFieldListener(){
					mapDisplay.disableListeners();
					mapDisplay.removeMarkers();
					$("#text_box").html("Enter Field Information");
					$("#map_form").html("");
					fieldNameText = new TextBox("Field Name", "field_name");
					$("#map_form").append(fieldNameText.html);
					farmText = new TextBox("Farm Number", "farm_number");
					$("#map_form").append(farmText.html);
					$("#map_form").append("<br/>");
					var cancelButton = new Button("images/cancel_button1.png", "cancel_button", function(){
						DrawFieldManager(pSection);
					});
					$("#map_form").append(cancelButton.html);
					cancelButton.enableListener();
					
					var fuckyou = "fuck you";
					var saveButton = new Button("images/add_button1.png", "save_button", function(){
						
						if (!session.userId) {
							dbConnector.generateGuest(function(userId){
								session.userId = userId;
								var newField = mapDisplay.getNewField();
								newField.name = fieldNameText.value();
								newField.farm = farmText.value();
								newField.north = currentSection.n;
								newField.west = currentSection.w;
								newField.section = currentSection.s;
								dbConnector.saveField(newField, function(){
									homeManager();
								});
							});
						}
						else {
							var newField = mapDisplay.getNewField();
							newField.name = fieldNameText.value();
							newField.farm = farmText.value();
							dbConnector.saveField(newField, function(){
								alert("fieldSaved");
							});
						}
						

					});
					$("#map_form").append(saveButton.html);
					var backButton = new Button("buttons/back.png", "back_button", function(){
						$("#map_form").html("");
						mapDisplay.initiateMarkers(function(){
							var saveButton = new Button("images/add_button1.png", "save_button", function(){
							saveFieldListener();
							});
							$("#map_form").append(saveButton.html);
							saveButton.enableListener();
						});
						
						
					});
					$("#map_form").append(backButton.html);
					backButton.enableListener();
					
					saveButton.enableListener();
	}
	
	//mapDisplay.moveToSection(section);
	
	
	function homeManager(){
		$("#text_box").html("");
		$("#map_form").html("");
		var fieldButton = new Button("images/add_button1.png", "save_button", function(){
							addFieldButtonPushed();
							});
							$("#map_form").append(fieldButton.html);
							fieldButton.enableListener();
		
				var fertilizeButton = new Button("images/fertilize_button1.png", "fertilize_button", function(){
							alert("fertilize");
							});
							$("#map_form").append(fertilizeButton.html);
							fertilizeButton.enableListener();
							
							
								var plantButton = new Button("images/insure.png", "insure_button", function(){
							alert("plant");
							});
							$("#map_form").append(plantButton.html);
							plantButton.enableListener();
	}
	
	
	
	
	function addFieldButtonPushed(){
		
		currentManager = new DrawFieldManager(currentSection);
	}
	
	
	
	
	
}



