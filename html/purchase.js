


var PurchaseEntity = function(){
	this.description;
	this.vendor;
	this.receiveDate;
	this.paymentDates = [];
	this.paymentDate;
	this.type;
	this.product;
	this.price;
	this.priceUnits;
	this.amount;
	this.units;
	this.type;
	this.description;
	this.conversion;
	this.total = 0;

	
	this.save = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savepurchase",
					email: "davidkjos@yahoo.com",
					purchase: this.purchaseString(),
					description: this.description
				},
				error: function(xhr){
					alert("failure");
				},
				success: function(){
					func();
				}
			});
	}
	
	this.edit = function(func){
		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "editpurchase",
					email: user.email,
					purchase: this.purchaseString(),
					description: this.description
				}
			});

		func();
	}
	
	this.setVal = function(attr, newVal){

		if (attr == "vendor"){
			this.vendor = newVal;
		}
		else if (attr == "total"){
			this.total = newVal;
		}
		else if (attr == "type"){
			this.type = newVal;
		}
	}
	
	this.purchaseString = function(){
		var rString = "";
		rString = "<purchase "+
			"paymentDay='" + this.paymentDate.day + 
			"' paymentMonth='" + this.paymentDate.month +
			"' paymentYear='" + this.paymentDate.year +
			"' total='" + this.total +
			"' description='" + this.description +
			"' vendor='" + this.vendor + 
			"' type='" + this.type + "'>" +
			"</purchase>";
		return rString;
	}
	
	this.getPayments = function(){
		var rString = "";
		for (var i=0; i<this.paymentDates.length; i++){
			rString+="<payment day='"+this.paymentDates[i].day+
				"' month='"+this.paymentDates[i].month+
				"' year='" +this.paymentDates[i].year+ 
				"' amount='"+this.paymentDates[i].amount+"'/>";
		}
		return rString;
	}
	
	this.getItems = function(){
		var rString = "";
		for (var i=0; i<this.items.length; i++){
			rString+="<item "+
			       "type='"+this.items[i].type+
				"' product='"+this.items[i].product+
				"' price='" +this.items[i].price+ 
				"' units='" +this.items[i].units+ 
				"' conversion='" +this.items[i].conversion+ 
				"' amount='"+this.items[i].amount+"'/>";
		}
		return rString;
	}
	
	
}


var PurchaseItemEntity = function(){
	this.type;
	this.product;
	this.price;
	this.priceUnits;
	this.amount;
	this.units;
	this.description;
	this.conversion;
	this.total = 0;
	
	
}

var PurchaseManager = function(){
	
	
	var purchase = new PurchaseEntity();	
	this.vendorForm;
	this.productTypeForm;
	var productNameForm;
	var productAmountForm;
	var productPriceForm;
	var productSummaryForm;
	var receiveDateForm;
	var paymentDatesForm;
	var purchaseNameForm;
	var purchasePercentagesForm;
	var finalSummary;
	var purchaseList;
	
	var currentPurchaseItem;
	
	
	
	
	var purchaseItems = [];
	var receiveDate;
	var payDates = [];
	
	var formVendor;
	var formType;
	var formProduct;
	var formAmount;
	var formUnits;
	var selected
	
	
	
	
	
	var addButton = new Button();
		addButton.name="add_field";
		addButton.url="images/add_button1.png";
		addButton.action = function(){
			currentManager.addAction();
	}
	
	this.run = function(){
		
		
		$("#form_title").html("Purchase");
		var buttons = [];
		buttons.push(addButton);
		buttonDisplay.render(buttons);
		$("#dialog_box").text("Please follow instructions in the right column.  To cancel click cancel");
		$.ajax({
			url: "purchase.xml",
			type: 'GET',
			dataType: 'html',
			success: function(data){
					data = textToDoc(data);
					currentManager.vendorForm = $(data).find("vendor-form").text();
					currentManager.productTypeForm = $(data).find("product-type-form").text();
					productNameForm = $(data).find("product-name-form").text();
					productAmountForm = $(data).find("product-amount-form").text();
					productPriceForm = $(data).find("product-price-form").text();
					productSummaryForm = $(data).find("product-summary-form").text();
					receiveDateForm = $(data).find("receive-date-form").text();
					paymentDatesForm = $(data).find("payment-dates-form").text();	
					purchasePercentagesForm = $(data).find("purchase-percentages-form").text();	
					purchaseNameForm = $(data).find("purchase-name-form").text();
					finalSummary = $(data).find("final-summary").text();
					purchaseList = $(data).find("purchase-list").text();		
					viewPurchasesAction();
			}
		});
		
	}
	
	function viewPurchasesAction(){
			$("#form_box").html('<table class="three_column"></table>');
			$.each(purchaseCache.getPurchases(), function(){
				$("#form_box table").append(createRow(this.description,addCommas(this.total), "view"));
			});
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				vendorFormAction();
			});
		}
	
	function vendorFormAction(){
		
		$("#form_box").html(currentManager.vendorForm);
		$("#next").click(function(){
			$("#form_info").removeClass("hide");
			purchase.vendor = $("#vendor_input").attr("value");
			$("#form_info").html("Vendor: "+ purchase.vendor +"<br/>");
			productTypeFormAction()
		});
	}
	
	
	function productTypeFormAction(){
		purchaseItem = new PurchaseItemEntity();
		
		$("#form_box").html(currentManager.productTypeForm);
		$("#next").click(function(){
			purchaseItem.type = $("#form_box input[checked=true]").attr("value");
			$("#form_info").append("Type: "+ purchaseItem.type);
			productNameFormAction()
		});
		$("#back").click(function(){
			vendorFormAction();
		});
	}
	
	function productNameFormAction(){
		$("#form_box").html(productNameForm);
		$("#next").click(function(){
			purchaseItem.product = $("#vendor_input").attr("value");
			$("#form_info").append("</br>Name: "+ purchaseItem.product);
			productAmountFormAction()
		});
		$("#back").click(function(){
			productTypeFormAction();
		});
	}
	
	function productAmountFormAction(){
		$("#form_box").html(productAmountForm);
		$("#next").click(function(){
			purchaseItem.amount = $("#vendor_input").attr("value");
			purchaseItem.units = $("select option[selected=true]").text();
			$("#form_info").append("</br>Amount: "+ purchaseItem.amount+" "+purchaseItem.units);
			productPriceFormAction()
		});
		$("#back").click(function(){
			productNameFormAction();
		});
	}
	
	function productPriceFormAction(){
		$("#form_box").html(productPriceForm);
		$("#next").click(function(){
			purchaseItem.price = $("#vendor_input").attr("value");
			$("#form_info").append("</br>Price: "+ purchaseItem.price);
			purchaseSummaryAction()
		});
		$("#back").click(function(){
			productAmountFormAction();
		});
	}
	
	function purchaseSummaryAction(){
		$("#form_box").html(productSummaryForm);
		$("#done").click(function(){
			purchase.items.push(purchaseItem);
			$("#form_info").html("");
			$("#form_info").html("<div class='border_bottom'>Purchase From "+purchase.vendor+"</div>");
			for (var i=0; i<purchase.items.length; i++){
				var item = i+1;
				purchase.items[i].total = purchase.items[i].amount*purchase.items[i].price;
				purchase.total+=purchase.items[i].total;
				$("#form_info").append("<div class='border_bottom small_font'>Item#"+item+": "+purchase.items[i].amount+" bushels of "+purchase.items[i].product+" ("+purchase.items[i].type+") "+" at $"+purchase.items[i].price+" per bushel. Totaling $"+purchase.items[i].total);
				$("#form_info").append("</div>");
			}
			
			$("#purchase_info").append("<div class='border_bottom small_font'>Grand Total:$"+purchase.total+"</div>");
			receivableDateAction()
		});
		$("#add").click(function(){
			purchase.items.push(purchaseItem);
			$("#form_info").html("");
			$("#form_info").html("<div class='border_bottom'>Purchase From "+purchase.vendor+"</div>");
			for (var i=0; i<purchase.items.length; i++){
				var item = i+1;
				purchase.items[i].total = purchase.items[i].amount*purchase.items[i].price;
				purchase.total+=purchase.items[i].total;
				$("#form_info").append("<div class='border_bottom small_font'>Item#"+item+": "+purchase.items[i].amount+" bushels of "+purchase.items[i].product+" ("+purchase.items[i].type+") "+" at $"+purchase.items[i].price+" per bushel. Totaling $"+purchase.items[i].total);
				$("#form_info").append("</div>");
			}
			
			$("#form_info").append("<div class='border_bottom small_font'>Grand Total:$"+purchase.total+"</div>");
			productTypeFormAction()
		});
		$("#back").click(function(){
			productPriceFormAction();
		});
	}
	
	function receivableDateAction(){
		
		var monthIndex;
		var dayIndex;
		var x;
		var y;
		
		
		$("#form_box").html(receiveDateForm);
		$("#next").click(function(){
			calendarDisplay.disableSingleDatePicker();
			paymentScheduleAction()
		});
		$("#back").click(function(){
			purchaseSummaryAction();
		});
		
		calendarDisplay.enableSingleDatePicker();
		calendarDisplay.setAction(function(rReceiveDate){	
			purchase.receiveDate = rReceiveDate;
			if ($("#receive_date").length==0) 
				$("#form_info").append("<div id='receive_date' class='border_bottom small_font'>Received on:"+rReceiveDate.dateString()+"</div>");
			else 
				$("#receive_date").html("Received on:"+rReceiveDate.dateString());
		});


		
		
		
	}
	function paymentScheduleAction(){
		var purchaseItemIndex = 0;
		$("#form_box").html(paymentDatesForm);
		$("#next").click(function(){
			calendarDisplay.disableMultipleDatePicker();
			paymentBreakdownAction()
		});
		$("#back").click(function(){
			receivableDateAction();
		});
		$(".calendar_table td").unbind("click");
		calendarDisplay.enableMultipleDatePicker();
		calendarDisplay.setAction(function(rPaymentDate){	
			purchase.paymentDates.push(rPaymentDate);
			$("#form_info").append("<div>Payment #"+purchase.paymentDates.length+" on:"+rPaymentDate.month+" "+rPaymentDate.day+", "+rPaymentDate.year+" <span class='breakdown_form hide'><br/>Amount:<input type='text' class='short_input'></input></span></div>");
		});
		
	}
	
	function paymentBreakdownAction(){
		$("#form_box").html(purchasePercentagesForm);
		$(".breakdown_form").each(function(){
			$(this).removeClass("hide");
		})
		$("#next").click(function(){
			var total=0;
			var index=0;
			$("#form_info input").each(function(){
				purchase.paymentDates[index].amount = parseInt($(this).attr("value"));
				total+=parseInt($(this).attr("value"));
				index++;
			});
			if (total!=purchase.total){
				$("#form_info").append("<div class='red'>It must add up to "+purchase.total+"</div>");
				total=0;
			}
			else {
				index=0;
				$(".breakdown_form").each(function(){
					$("<span>: $"+purchase.paymentDates[index].amount+"</span>").insertAfter(this);
					index++;
					$(this).addClass("hide");
				})
				purchaseNameAction()
			}
		});
		$("#back").click(function(){
			paymentScheduleAction();
		});
	}
	function purchaseNameAction(){
		$("#form_box").html(purchaseNameForm);
		$("#next").click(function(){
			purchase.description = $("#form_box input").attr("value");
			$("#form_info").append("<div class='border_top'>Saving purcase as:"+purchase.description+"</div>");
			finalSummaryAction()
		});
		$("#back").click(function(){
			paymentBreakdownAction();
		});
	}
	function finalSummaryAction(){
		$("#form_box").html(finalSummary);
		$("#next").click(function(){
			purchase.save(function(){
				currentManager.refresh(function(){
					$("#form_info").empty();
					$("#form_box").empty();
					$("#form_info").addClass("hide");
					currentManager = new HomeManager();
					currentManager.run();
				});
			});
		});
		$("#back").click(function(){
			purchaseNameAction();
		});
	}	
	
	
	this.refresh = function(func){
		
		lossDisplay.clear();
		
		purchaseCache = new PurchaseCache(user.email, function(){
			var cornSeed = purchaseCache.getCornSeed();
			lossDisplay.showCornSeed(cornSeed);
			var wheatSeed = purchaseCache.getWheatSeed();
			lossDisplay.showWheatSeed(wheatSeed);
			var soybeanSeed = purchaseCache.getSoybeanSeed();
			lossDisplay.showSoybeanSeed(soybeanSeed);
			var fertilizer = purchaseCache.getFertilizer();
			lossDisplay.showFertilizer(fertilizer);
			var chemical = purchaseCache.getChemical();
			lossDisplay.showChemical(chemical);
			lossDisplay.showTotal();
			func();
		});
	}
	
}


var PurchaseDisplay = function(){
	var html = "";
	this.show = function(purchases){
		for (var i=0; i<purchases.length; i++){
			html += "<b>"+purchases[i].description +"</b><br/>"
		}
		$("#purchase_list").html(html);
	}
}
var purchaseDisplay = new PurchaseDisplay();



var PurchaseCache = function(pEmail, func){
	var doc;
	
	$.ajax({
		url: "/?action=getpurchases&email="+pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	this.purchases;
	
	this.getPurchase = function(description){
		var rVal = $(doc).find("purchase[description = "+description+"]");
		rVal = docToItem(rVal);
		return rVal;
	}
	
	this.getPurchases = function(){
		var rPurchases = [];
		$(doc).find("purchase").each(function(){
			var purchase = docToPurchase(this);
			rPurchases.push(purchase);
		});
		
		this.purchases=rPurchases;
		return rPurchases;
	}
	
	this.getFertilizers = function(){
		rItems = [];
		$(doc).find("item[type=fertilizer]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	
	this.getChemicals = function(){
		rItems = [];
		$(doc).find("item[type=chemical]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	
	this.getCornSeed = function(){
		rItems = [];
		$(doc).find("item[type=corn_seed]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	this.getWheatSeed = function(){
		rItems = [];
		$(doc).find("item[type=wheat_seed]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	this.getSoybeanSeed = function(){
		rItems = [];
		$(doc).find("item[type=soybean_seed]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	this.getFertilizer = function(){
		rItems = [];
		$(doc).find("item[type=fertilizer]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}
	this.getChemical = function(){
		rItems = [];
		$(doc).find("item[type=chemical]").each(function(){
			var item = docToItem(this);
			rItems.push(item);
		});
		return rItems;
	}

	
	
}


function docToItem(itemDoc){
	var item = new PurchaseEntity();
	item.paymentDate = new DateEntity();
	item.paymentDate.day = $(itemDoc).attr("paymentDay");
	item.paymentDate.month = $(itemDoc).attr("paymentMonth");
	item.paymentDate.year = $(itemDoc).attr("paymentYear");
	item.product = $(itemDoc).attr("product");
	item.total = $(itemDoc).attr("total");
	item.price = $(itemDoc).attr("price");
	item.amount = $(itemDoc).attr("amount");
	item.units = $(itemDoc).attr("units");
	item.type = $(itemDoc).attr("type");
	item.vendor = $(itemDoc).attr("vendor");
	item.description = $(itemDoc).attr("description");
	item.conversion = $(itemDoc).attr("conversion");
	if (!item.conversion && item.type=="corn_seed"){
		item.conversion = 80000;
	}
	else if (!item.conversion && item.type=="soybean_seed"){
		item.conversion = 150000;
	}
	else if (!item.conversion){
		item.conversion = 1;
	}
	if (item.conversion=="undefined"){
		item.conversion = 1;
	}
	return item;
}
function docToPurchase(doc){
	var purchase = new PurchaseItem();
	purchase.description = $(doc).attr("description");
	try {
		purchase.total = $(doc).attr("total");
	}
	catch (e){
		purchase.total = "$100.00"
	}
	return purchase;
}
