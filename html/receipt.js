
var ReceiptEntity = function(){
	this.farm;
	this.classification;
	this.vendor;
	this.amount;
	this.date;
	this.description;
	
	this.receiptString = function(){
		var rString = "";
		rString = "<receipt "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' total='" + this.total +
			"' />";	
		return rString;
	}
	
	
	this.save = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savereceipt",
					email: user.email,
					receipt: this.receiptString()
				}
			});

		func();
	}
}
	
	//PLANT
	var ReceiptManager = function(){
	
		var doc;
		var receiptEntity = new ReceiptEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Receipt");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "receipt.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewReceiptsAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		receiptCache = new ReceiptCache(user.email, function(){
			var receipts = receiptCache.getReceipts();	
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
		
		function viewReceiptsAction(){

			if (receiptCache.receipts.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(receiptCache.receipts, function(){
					$("#form_box table").append(createRow(this.description, this.product, "view"));
				});
			}
			else {
				$("#form_box").html("There have been no receipts.");
			}
			$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFarmAction();
			});
		}
		
		var receiptEntity;;
		function selectFarmAction(){
			receiptEntity = new ReceiptEntity();
			$("#form_box").html($(doc).find("select-farm-form").text());
			$("#done").click(function(){
				$("#form_info").removeClass("hide");
				receiptEntity.farm = "296";
				$("#form_info").append("<b>Farm:</b> "+receiptEntity.farm);
				selectClassificationAction();
			});
		}
		
		function selectClassificationAction(){
			$("#form_box").html($(doc).find("select-classification-form").text());
			$("#done").click(function(){
				receiptEntity.classification = "Real Estate Tax";
				$("#form_info").append("<br/><b>Classification:</b> "+receiptEntity.classification);
				enterVendorAction();
			});
		}
		

		
		function enterVendorAction(){
			$("#form_box").html($(doc).find("enter-vendor-form").text());
			$("#done").click(function(){
				receiptEntity.vendor = "North Dakota Tax Commission";
				$("#form_info").append("<br/><b>Vendor:</b> "+receiptEntity.vendor);
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$("#done").click(function(){
				receiptEntity.amount = "1,090.99";
				$("#form_info").append("<br/><b>Amount:</b> "+receiptEntity.amount);
				selectDateAction();
			});
		}

		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rReceiptDate){
				receiptEntity.date = rReceiptDate;
				$("#form_box span").html("<br/>Selection:" + receiptEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<br/><b>Date: </b>" + receiptEntity.date.dateString());
				enterDescriptionAction();
			});
		}
		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				receiptEntity.description = "I hate Taxes!!!";
				$("#form_info").append("<br/><b>Description:</b> "+receiptEntity.description);
				confirmAction();
			});
		}
		
		

		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				receiptEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
		
}



var ReceiptCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getreceipts&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.receipts = [];
	
	
	this.getReceipts = function(){
		var rReceipts = [];
		try {
			$(doc).find("receipt").each(function(){
				var receipt = docToItem(this);
				rReceipts.push(receipt);
			});
		}
		catch (e){}
		this.receipts = rReceipts;
		return rReceipts;
	}
	
	this.isreceiptd = function(field){
		
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
		$(doc).find("receipt[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new ReceiptEntity();
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





