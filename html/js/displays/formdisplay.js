function FormDisplay(pDivId){
	
	var divId;
	var formFeedbackDivId;
	var formInputDivId;
	var transactionListingDivId;
	var mainMenuDivId;
	
	var buttons;
	var formStepIndex = 0;
	var formSteps;  //each step has form html snippet and the listener code associated with the "next" button with the form
	var transactionHistory;
	var displayAttributes;// each attribute must have a form snippet associated with it for "edit" feature and submit button
	var currentFormStep;
	
	
	this.toggleToMainMenu = function(){
		$("#form_title").text("Main Menu");
		$("#form_box").html("");
	}
	this.addButton = function(button){
		$("#form_box").append(button.html);
		button.enableListener();
	}
	
	var transactions = [];
	this.toggleToTransactionHistory = function(pTransactionHistory){
		$("#form_box").html("");
		$("#form_box").append("<table></table>");
	}
	this.addTransaction = function(transaction){
		transactions.push(transaction);
		$("#form_box table").append("<tr><td>"+transaction.col1+"</td><td>"+transaction.col2+"</td><td>"+transaction.col3+"</td><td>"+transaction.col1+"</td></tr>");
	}
	this.enableTransactionListeners = function(){
		if (transactions.length==0){
			$("#form_box").append("There are no plantings yet.");
		}
		var newButton = new Button("images/plant_button1.png", "plant_button", function(){
			currentManager.handleForm();
		});
		$("#form_box").append("<br/>"+newButton.html);
		newButton.enableListener();
		var cancelButton = new Button("images/cancel_button1.png", "cancel_button", function(){
			currentManager.handleCancel();
		});
		$("#form_box").append(cancelButton.html);
		cancelButton.enableListener();
	}
	
	
	
	this.toggleToEditForm = function(pDisplayAttributes){
		
	}
	this.feedback = function(label, value){
		$("#form_info").removeClass("hide");
		$("#form_info").append("<b>"+label+":</b> "+value+"<br/>")
	}
	var cancelButton;


	
	
	
	this.toggleToNewForm = function(pFormSteps){
		
		formStepIndex = 0;
		formSteps = pFormSteps;
		nextStep();
		/*
		$("#form_title").text(formSteps[formStepIndex].title);
		$("#form_box").html("");
		$.each(formSteps[formStepIndex].inputs, function(){
			$("#form_box").append(this.html);
			this.enableListener();
		});
		
		var inputs = formSteps[formStepIndex].inputs;
		cancelButton = new Button("images/cancel_button1.png", "cancel_button", function(){
			currentManager.refresh();
		});
		$("#form_box").append("<br/>"+cancelButton.html);
		cancelButton.enableListener();
		var nextButton = new Button("images/next_button1.png", "next_button", formSteps[formStepIndex].next)
		$("#form_box").append(nextButton.html);
		nextButton.enableListener(function(){
			formStepIndex++;
			nextStep();
		});
		*/
	}
	function nextStep(){
		$("#form_title").text(formSteps[formStepIndex].title);
		$("#form_box").html(formSteps[formStepIndex].form.html);
		alert("enabling....");
		formSteps[formStepIndex].form.enableListener(function(){
			alert("formdisplay handler");
		});
	}
	function nextStep1(){
		if (formStepIndex < formSteps.length) {
			var nextButton = new Button("images/next_button1.png", "next_button", formSteps[formStepIndex].next)
			var inputs = formSteps[formStepIndex].inputs;
			$("#form_box").html("");
			$.each(formSteps[formStepIndex].inputs, function(){
				$("#form_box").append(this.html);
				this.enableListener();
			});
			$("#form_box").append("<br/>" + cancelButton.html);
			cancelButton.enableListener();
			$("#form_box").append(nextButton.html);
			nextButton.enableListener(function(){
				formStepIndex++;
				nextStep();
			});
		}
	}
	
	
	this.formResults;
	
	//this is called on every new step in order to initiate the associated listener within that step, also back and cancel are treated the same
	this.enableCurrentStepListener = function(){
		
	}
	this.enableSelectTransactionListener = function(){
		
	}
	this.enableSelectAttributeListener = function(){  //cancel and submit buttons are shown with form
		
	}
	this.enableEditAttributeListener = function(){ //if cancel is selected, use master method for thats
		
	}
	this.enableRemoveListener = function(){
		
	}
	this.enabbleNextListener = function(){
		
	}
	this.enableBackListener = function(){
		
	}
	this.enableCancelLister = function(){
		
	}
	
}
