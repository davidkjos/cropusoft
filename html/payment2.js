
var PaymentEntity = function(){
	this.farm;
	this.classification;
	this.vendor;
	this.amount;
	this.date;
	this.description;
	
	this.paymentString = function(){
		var rString = "";
		rString = "<payment "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amount='" + this.amount +
			"' />";	
		return rString;
	}
	
	
	this.save = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savepayment",
					email: user.email,
					payment: this.paymentString()
				}
			});

		func();
	}
}
	
	//PLANT
	var PaymentManager = function(){
	
		var doc;
		var paymentEntity = new PaymentEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Payment");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "payment.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewPaymentsAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		paymentCache = new PaymentCache(user.email, function(){
			var payments = paymentCache.getPayments();	
		});
		fieldCache = new FieldCache(user.email, function(){
			var fields = fieldCache.getAllFields();
			mapDisplay.showFields(fields);
			var farms = fieldCache.getAllFarms();
			mapDisplay.setFarms(farms);
			var sections = fieldCache.getAllSections();
			mapDisplay.setSections(sections);
			filterForm = new FilterForm(function(){
				filterForm.displayCrops(fields);
				filterForm.displayFarms(farms);
				filterForm.displaySections(sections);
				filterForm.enableListeners();
				func();
			});
		});
	}
		
		function viewPaymentsAction(){

			if (paymentCache.payments.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(paymentCache.payments, function(){
					$("#form_box table").append(createRow(this.description, this.product, "view"));
				});
			}
			else {
				$("#form_box").html("There have been no payments.");
			}
			$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFarmAction();
			});
		}
		
		var paymentEntity;;
		function selectFarmAction(){
			paymentEntity = new PaymentEntity();
			$("#form_box").html($(doc).find("select-farm-form").text());
			$("#done").click(function(){
				$("#form_info").removeClass("hide");
				paymentEntity.farm = "296";
				$("#form_info").append("<b>Farm:</b> "+paymentEntity.farm);
				selectClassificationAction();
			});
		}
		
		function selectClassificationAction(){
			$("#form_box").html($(doc).find("select-classification-form").text());
			$("#done").click(function(){
				paymentEntity.classification = "Real Estate Tax";
				$("#form_info").append("<br/><b>Classification:</b> "+paymentEntity.classification);
				enterVendorAction();
			});
		}
		

		
		function enterVendorAction(){
			$("#form_box").html($(doc).find("enter-vendor-form").text());
			$("#done").click(function(){
				paymentEntity.vendor = "North Dakota Tax Commission";
				$("#form_info").append("<br/><b>Vendor:</b> "+paymentEntity.vendor);
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$("#done").click(function(){
				paymentEntity.amount = "1,090.99";
				$("#form_info").append("<br/><b>Amount:</b> "+paymentEntity.amount);
				selectDateAction();
			});
		}

		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rPaymentDate){
				paymentEntity.date = rPaymentDate;
				$("#form_box span").html("<br/>Selection:" + paymentEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<br/><b>Date: </b>" + paymentEntity.date.dateString());
				enterDescriptionAction();
			});
		}
		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				paymentEntity.description = "I hate Taxes!!!";
				$("#form_info").append("<br/><b>Description:</b> "+paymentEntity.description);
				confirmAction();
			});
		}
		
		

		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				paymentEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
		
}



var PaymentCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getpayments&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.payments = [];
	
	
	this.getPayments = function(){
		var rPayments = [];
		try {
			$(doc).find("payment").each(function(){
				var payment = docToItem(this);
				rPayments.push(payment);
			});
		}
		catch (e){}
		this.payments = rPayments;
		return rPayments;
	}
	
	this.ispaymentd = function(field){
		
		try {
			return ($(doc).find("field[name=" + field.name + "]").length > 0);
		}
		catch (e){
			alert(e);
		}
	}
	
	this.getProduct = function(fieldName){
		var rVal = "none";
		try {
			rVal = $(doc).find("field[name=" + fieldName + "]").parent().parent().attr("product");
		}
		catch (e){
			rVal = "none";
		}
		if (!rVal || rVal==undefined || rVal=="undefined"){
			rVal = "none";
		}
		return rVal;
	};
	
	this.getFieldNamesByProduct = function(product){
		var rFieldNames = [];
		$(doc).find("payment[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new PaymentEntity();
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





