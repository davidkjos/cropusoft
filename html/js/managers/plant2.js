
var PlantEntity = function(){
	this.fields = [];
	this.seed;
	this.treatments = [];
	this.payment;
	
	this.date;
	this.amountPerAcre;
	this.crop;
	
	this.payment;
	this.description;
	this.acreage;
	this.treatment = "none";
	this.treatmentAmount;
	this.treatmentPrice;
	this.total;
	this.seedPrice;
	this.seedUnitAmount;
	this.purchase;
	this.conversion;
	this.unit;
	
	this.plantString = function(){
		var rString = "";
		rString = "<planting "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' acreage='" + this.acreage +
			"' seedPrice='" + this.seedPrice +
			"' seedUnitAmount='" + this.seedUnitAmount +
			"' total='" + this.total +
			"' seed='" + this.seed.name +
			"' treatment='" + this.treatment.name +
			"' crop='" + this.crop + 
			"' unit='" + this.unit + "'>" +
			this.getFields()+
			"</planting>";	
		return rString;
	}
	this.getFields = function(){
		var rString = "";
		rString += "<fields>";
		$.each(this.fields, function(){
			rString += "<field name='"+this.name+"' />";
		});
		rString += "</fields>";
		return rString;
	}
	
	this.setVal = function(attr, newVal, purchase){
		if (attr == "description"){
			this.description = newVal;
		}
		else if (attr == "seedPrice"){
			this.price = newVal;
			purchase.total = this.price*this.total/this.conversion;
			purchase.type = "plant";
		}
		else if (attr == "total"){
			this.total = newVal;
		}
		else if (attr == "seed"){
			this.seed = newVal;
		}
	}
	
	this.remove = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "removeplanting",
					email: user.email,
					description: this.description
				}
			});

		func();
	}
	
	this.save = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveplanting",
					email: user.email,
					planting: this.plantString(),
					description: this.description
				}
			});

		func();
	}
	
	this.edit = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "editplanting",
					email: user.email,
					planting: this.plantString(),
					description: this.description
				}
			});

		func();
	}
	
}
	
	//PLANT
	var PlantManager = function(){
	

		
		var plantDoc;
		var plantEntity = new PlantEntity();
		var selectedFieldsIndexes = [];
		selectedFieldsIndexes.length = 0;
		var totalAcres = 0;
		var seeds;
		var selectedIndex;
		var plantDate;
		var cropType;
		var amount;
		var amountPerAcre;
		var description;
		var purchaseDoc;
		this.treatments = [];
		
		var saveSeed = false;
		
		this.totalAcres = function(){
			return totalAcres;
		}
		this.price;
		
		this.run = function(){
			plantCache.initComposites();
			$("#form_title").html("Plant");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "purchase.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					purchaseDoc = textToDoc(data);
					$.ajax({
						url: "plant.xml",
						type: 'GET',
						dataType: 'html',
						success: function(data){
							plantDoc = textToDoc(data);
							viewPlantingsAction();
						}
					});
				}
			});
		}
	this.handleCancel = function(){
		currentManager = new PlantManager();
		currentManager.run();
	}	
		
	this.refresh = function(func){
		plantCache = new PlantCache(user.email, function(){
			treatmentCache =  new TreatmentCache(function(){
				paymentCache =  new PaymentCache(function(){
				seedCache =  new SeedCache(function(){
					
					fieldCache = new FieldCache(user.email, function(){
						mapDisplay = new MapDisplay();
						var plantings = plantCache.getPlantings();	
						var fields = fieldCache.getAllFields();
						mapDisplay.showFields(fields);
						var farms = fieldCache.getAllFarms();
						mapDisplay.setFarms(farms);
						var sections = fieldCache.getAllSections();
						mapDisplay.setSections(sections);
						filterForm = new FilterForm(function(){
							
							gainDisplay = new GainDisplay();
							gainDisplay.refresh();
							lossDisplay = new LossDisplay();
							lossDisplay.refresh();
							filterForm.displayCrops(fields);
							filterForm.displayFarms(farms);
							filterForm.displaySections(sections);
							filterForm.enableListeners();
							func();
						});
						});
						});
					});
					});
		});
		

	}
		var selectedPlanting;
		
		function viewPlantingsAction(){
			$("#form_info").addClass("hide");
			$("#form_box").html('<table class="three_column"></table>');
			
			$.each(plantCache.plantings, function(i){
				$("#form_box table").append(createRow(this.description,this.crop, "<span id='"+i+"'>View</span>"));
				$("#"+i).click(function(){
					selectedPlanting = plantCache.plantings[i];
					viewPlantingAction();
				});
			});
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFieldAction();
			});
		}
		var purchase;
		

		function endDateEdit(id){
			calendarDisplay.disableSingleDatePicker();
			$("<span id='"+id+"'><b>Edit</b></span>").insertAfter("#cancel_edit");
			$("#new_date_text").remove();
			$("#save").remove();
			$("#cancel_edit").remove();
			startEditListener(id);
		}

		
		function startDateEdit(id){
			$("<span id='new_date_text'><br/>Please Click new date on calendar. </span><span id='new_date'></span> <span id='save'><br/><b>Save</b></span><span id='cancel_edit'><b>Cancel</b></span>").insertAfter("#"+id);
			$("#"+id).remove();
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rDate){
				$("#new_date").html("<br/><b>Selection:</b>" + rDate.dateString());
				if (id == "date") {
					selectedPlanting.date = rDate;
	
				}
				else if (id = "payDate") 
					purchase.paymentDate = rDate;
			});
			$("#save").click(function(){
						selectedPlanting.edit(function(){
							purchase.edit(function(){
								currentManager.refresh(function(){
									viewPlantingAction();
								});
							});
						});
					});
					$("#cancel_edit").click(function(){
						endEdit(id);
					});
		}
		

		
		function viewPlantingAction(){
			purchase = purchaseCache.getPurchase(selectedPlanting.description);
			$("#form_box").html("<b>Description:</b>"+selectedPlanting.description);
			$("#form_box").append("<br/><b>Crop:</b>"+selectedPlanting.crop+"  ");
			$("#form_box").append("<br/><b>Seed:</b>"+selectedPlanting.seed.name+"("+selectedPlanting.seed.appConversion+" per "+selectedPlanting.seed.units+")"+" <span id='seed'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Treatment:</b>"+selectedPlanting.treatment.name+" <span id='seed'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Amount:</b>"+selectedPlanting.total+" kernals ("+selectedPlanting.total/selectedPlanting.seed.appConversion+" "+selectedPlanting.seed.units+") <span id='total'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Price:</b> $"+selectedPlanting.seedPrice+"/bag <span id='seedPrice'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Total:</b> $"+selectedPlanting.payment.amount);
			$("#form_box").append("<br/><b>Acreage:</b> "+selectedPlanting.acreage);
			$("#form_box").append("<br/><b>Vendor:</b> "+selectedPlanting.payment.vendor+" <span id='vendor'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Plant Date:</b> "+selectedPlanting.date.dateString()+" <span id='date' class='date'><b>Edit</b></span>");
			$("#form_box").append("<br/><b>Pay Date:</b> "+selectedPlanting.payment.date.dateString()+" <span id='paydate' class='date'><b>Edit</b></span>");
			$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="currentManager.handleCancel()"><img id="delete" src="buttons/delete.png" >');
			$("span").click(function(){
				var id = $(this).attr("id");
				if ($(this).hasClass("date")) {

					startDateEdit(id);
					}
				else {
					
					startEdit(id);
					$("#save").click(function(){
						var newVal = $("#form_box input").attr("value");
						selectedPlanting.setVal(id, newVal, purchase);
						purchase.setVal(id, newVal);
						selectedPlanting.edit(function(){
							selectedPlanting.payment.edit(function(){
								currentManager.refresh(function(){
									viewPlantingAction();
								});
							});
						});
					});
					$("#cancel_edit").click(function(){
						endEdit(id);
					});
				}
			});
			$("#delete").click(function(){
				selectedPlanting.remove(function(){
					currentManager.refresh(function(){
						currentManager = new PlantManager();
						currentManager.run();
					});
				});
			});
		}
	/*			<br/><b>Description: </b><span id="description"></span>
		<br/><b>Crop: </b><span id="crop"></span>
		<br/><b>Acres: </b><span id="acres"></span>
		<br/><b>Seed: </b><span id="seed"></span>
		<br/><b>Amount: </b><span id="amount"></span>*/
		
		function selectFieldAction(){
			plantEntity.payment = new PaymentEntity();
			plantEntity.seed = new SeedEntity();	
			plantEntity.treatment = new TreatmentEntity();
			$("#form_box").html($(plantDoc).find("select-fields-form").text());
			mapDisplay.enableFieldSelectionListener(function(i){
				selectedFieldsIndexes.push(i);
				var field = mapDisplay.getField(i);
				plantEntity.fields.push(field);
				if (!field.acreage || field.acreage=="NaN"){
					field.acreage = pullAcreage(field);
				}
				totalAcres += parseInt(field.acreage);
				mapDisplay.highlightSelection(i);
				$("#selected_fields").removeClass("hide");
				$("<tr><td>" + field.name + "</td><td>" + field.acreage + " Acres</td></tr>").insertBefore("#total_acres_tr");
				$("#total_acres_tr").find("td:nth(1)").text(totalAcres + " Acres");
			});
			$("#done").click(function(){
				
				mapDisplay.disableFieldSelectionListeners();
				plantEntity.acreage = totalAcres;
				$("#form_info").removeClass("hide");
				$("#form_info").html($("#selected_fields").clone().wrap("<div></div>"));
				
				selectPlantDateAction();
			});
		}
		
		function selectPlantDateAction(){
			
			$("#form_box").html($(plantDoc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rPlantDate){
				plantDate = rPlantDate;
				plantEntity.date = plantDate;
				$("#form_box span").html("<br/>Selection:" + plantDate.dateString());
			});
			$("#done").click(function(){
				calendarDisplay.disableSingleDatePicker();
				$("#form_info").append("<b>Date: </b>" + plantDate.dateString());
				selectCropAction();
			});
		}
		
		function selectCropAction(){
		
			$("#form_box").html($(plantDoc).find("select-crop-form").text());
			$("#done").click(function(){
				cropType = $("#form_box input[checked=true]").attr("value");
				plantEntity.crop = cropType;
				plantEntity.payment.type = cropType+"_seed";
				$("#form_info").append("<br/><b>Crop: </b>" + cropType);
				productNameFormAction();
			});
		}
	this.applicantEntity;
	this.chosenApplicant;
	function productNameFormAction(){
		$("#form_box").html(applicantCache.getApplicantsForm("seed",plantEntity.crop));
		applicantCache.enableFormListener();
		$("#next").click(function(){
			var selected = $("#form_box input[checked=true]").attr("value");
			if (selected=='new'){
				applicantCache.handleNew(function(){
					$("#form_info").append("<br/><b>Seed:</b> "+this.applicantEntity.descriptionString(100000));
					enterAmountAction();
				});
			}
			else {
				alert(currentManager.chosenApplication.name);
				currentManager.applicantEntity = currentManager.chosenApplication;
				$("#form_info").append("<br/><b>Seed:</b> "+currentManager.applicantEntity.descriptionString(100000));
				enterAmountAction();
			}
			
			
		});
	}
	
		var totalBags;
		function enterAmountAction(){
			$("#form_box").html(applicantCache.getAmountForm(currentManager.applicantEntity));
			applicantCache.enableAmountFormEvents(currentManager.applicantEntity, "",function(){
				$("#form_info").append("</br><b>Total:</b>"+currentManager.amount+" "+currentManager.applicantEntity.appUnits+"s at $"+currentManager.price+" per "+currentManager.applicantEntity.priceUnits + " X "+currentManager.applicantEntity.priceConversion);
				treatmentFormAction();
			});
		}

	
	this.amount;
	this.price;
	this.treatmentEntity;
	
	function treatmentFormAction() {
		$("#form_box").html("<b>Type</b><input type='radio' name='treat_type' id='treat_type' value='treatment'>Seed Treatment</input>");
		$("#form_box").append("<input type='radio' name='treat_type' id='treat_type' value='innoculate'>Innoculate</input>");
		$("#form_box").append("<span id='treatment_form'><br/>"+applicantCache.getApplicantsForm("treatment",plantEntity.crop)+"</span>");
		applicantCache.enableFormListener(currentManager.treatmentEntity);
		$("#next").click(function(){
			var selected = $("#form_box input[name=applicant_choice][checked=true]").attr("value");
			if (selected=='new'){
				currentManager.treatmentEntity = new ApplicantEntity();
				applicantCache.handleNew(function(){
					$("#form_info").append("<br/><b>Treatment:</b> "+currentManager.treatmentEntity.descriptionString(100000));
					treatmentAmountAction();
				});
			}
			else {
				alert(currentManager.chosenApplication.name);
				currentManager.treatmentEntity = currentManager.chosenApplication;
				$("#form_info").append("<br/><b>Seed:</b> "+currentManager.treatmentEntity.descriptionString(100000));
				treatmentAmountAction();
			}
		});
	}
	function treatmentAmountAction() {
		currentManager.treatments.push(currentManager.treatmentEntity);
		$("#form_box").html(applicantCache.getAmountForm(currentManager.treatmentEntity));

		applicantCache.enableAmountFormEvents(currentManager.treatmentEntity, treatmentFormAction, function(){
			$("#form_info").append("</br><b>Total:</b>"+currentManager.amount+" "+currentManager.treatmentEntity.appUnits+"s at $"+currentManager.price+" per "+currentManager.treatmentEntity.priceUnits + " X "+currentManager.treatmentEntity.priceConversion);
			paymentDateAction();
		});
	}
	
	function paymentDateAction(){
		alert(currentManager.treatmentEntity.appUnits);
		var purchaseItemIndex = 0;
		$("#form_box").html($(purchaseDoc).find("payment-date-form").text());
		calendarDisplay.enableSingleDatePicker();
		calendarDisplay.setAction(function(rPaymentDate){
			plantEntity.payment.date = rPaymentDate;
			$("#form_box span").append("Selection:" + plantEntity.payment.date.dateString());
		});
		$("#next").click(function(){
			$("#form_info").append("<br/><b>Payment Date: </b>" + plantEntity.payment.date.dateString());
			calendarDisplay.disableSingleDatePicker();
			vendorFormAction()
		});
		$("#back").click(function(){
			receivableDateAction();
		});
		
	}

		function vendorFormAction(){
			$("#form_box").html($(purchaseDoc).find("vendor-form").text());
			$("#next").click(function(){
				$("#form_info").removeClass("hide");
				plantEntity.payment.vendor = $("#vendor_input").attr("value");
				$("#form_info").append("<br/><b>Vendor</b>: "+ plantEntity.payment.vendor);
				enterDescriptionAction()
			});
		}
		


	

		
		

		function enterDescriptionAction(){
			$("#form_box").html($(plantDoc).find("enter-description-form").text());
			$("#done").click(function(){
				description = $("#form_box input").attr("value");
				plantEntity.description = description;
				plantEntity.payment.description = description;
				$("#form_info").append("<div><b>Description: </b>" + description);
				confirmAction();
			});
		}
		
		function confirmAction(){
			$("#form_box").html($(plantDoc).find("confirm-form").text());
			$("#done").click(function(){
				
				
				$("#selected_fields").html("");
				plantEntity.save(function(){
					plantEntity.payment.save(function(){
						currentManager.applicantEntity.save(function(){
							saveTreatment();
						});
					});
				});
			});
		}
}

var i=0;
function saveTreatment(){
	if (i==currentManager.treatments.length){
			currentManager.refresh(function(){
			currentManager = new PlantManager();
			currentManager.run();
		});
	}
	else {
		i++;
		saveTreatment();
	}
}

var PlantCache = function(pEmail, func){
	var doc;
	
	$.ajax({
		url: "/?action=getplantings&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
	
		}
	});
	
	this.plantings;
	
	this.initComposites = function(){
		var rPlantings = [];
		$(doc).find("planting").each(function(){
			var planting = docToItem(this);
			var seedEntity = seedCache.getSeed(planting.seed);
			planting.seed = seedEntity;
			var treatmentEntity = treatmentCache.getTreatment(planting.treatment);
			planting.treatment = treatmentEntity;
			var paymentEntity = paymentCache.getPayment(planting.description);
			planting.payment = paymentEntity;
			rPlantings.push(planting);
		});
		this.plantings = rPlantings;
		return rPlantings;
	}
	
	this.getPlantings = function(){
		var rPlantings = [];
		$(doc).find("planting").each(function(i){
			var planting = docToItem(this);
			
			var seedEntity = seedCache.getSeed(planting.seed);
			planting.seed = seedEntity;
			var paymentEntity = paymentCache.getPayment(planting.description);
			if (planting.crop == "corn") {
				plantCache.totalPlantedCornAcres += parseInt(planting.acreage);
				plantCache.totalPlantingCornCost += parseFloat(paymentEntity.amount);
			}
			if (planting.crop == "soybean") {
				plantCache.totalPlantedSoybeanAcres += parseInt(planting.acreage);
				plantCache.totalPlantingSoybeanCost += parseFloat(paymentEntity.amount);
			}
			if (planting.crop == "wheat") {
				plantCache.totalPlantedWheatAcres += parseInt(planting.acreage);
				plantCache.totalPlantingWheatCost += parseFloat(paymentEntity.amount);
			}
			
			planting.payment = paymentEntity;
			rPlantings.push(planting);
		});
		this.plantings = rPlantings;
		return rPlantings;
	}
	this.totalPlantedCornAcres = 0;
	this.totalPlantingCornCost = 0;
	this.totalPlantedSoybeanAcres = 0;
	this.totalPlantingSoybeanCost = 0;
	this.totalPlantedWheatAcres = 0;
	this.totalPlantingWheatCost = 0;
	
	this.isPlanted = function(field){
		
		try {
			return ($(doc).find("field[name=" + field.name + "]").length > 0);
		}
		catch (e){
			alert(e);
		}
	}
	
	this.getUsedAmount = function(product){
		var usedProducts = $(doc).find("planting[seed="+product+"]");
		var total = 0;
		if (usedProducts) {
			$(usedProducts).each(function(){
				var item = docToItem(this);
				total += parseInt(item.total);
			});
		}
		return total;
	}
	
	this.getCrop = function(fieldName){
		var rVal = "none";
		try {
			rVal = $(doc).find("field[name=" + fieldName + "]").parent().parent().attr("crop");
		}
		catch (e){
			rVal = "none";
		}
		if (!rVal || rVal==undefined || rVal=="undefined"){
			rVal = "none";
		}
		return rVal;
	};
	
	this.getFieldNamesByCrop = function(crop){
		var rFieldNames = [];
		$(doc).find("planting[crop="+crop+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	
	function docToItem(itemDoc){
		
		var item = new PlantEntity();
		item.date = new DateEntity();
		item.total = $(itemDoc).attr("total");
		item.seed = $(itemDoc).attr("seed");
		item.treatment = $(itemDoc).attr("treatment");
		item.crop = $(itemDoc).attr("crop");
		item.unit = $(itemDoc).attr("unit");
		item.acreage = $(itemDoc).attr("acreage");
		item.description = $(itemDoc).attr("description");
		item.date.day = $(itemDoc).attr("receiveDay");
		item.date.month = $(itemDoc).attr("receiveMonth");
		item.date.year = $(itemDoc).attr("receiveYear");
		item.seedPrice = $(itemDoc).attr("seedPrice");
		item.date.seedUnitAmount = $(itemDoc).attr("seedUnitAmount");
		item.conversion = $(itemDoc).attr("conversion");
		return item;
	}

}
	function pullAcreage(field){
		return (Math.floor(100*field.polygon.getArea()/4046.8252519)/100);
	}





