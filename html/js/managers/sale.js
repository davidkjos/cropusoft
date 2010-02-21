
var SaleEntity = function(){
	this.farm;
	this.crop;
	this.source;
	this.purchaser;
	this.price;
	this.deduction;
	this.date;
	this.description;
	this.total;
	
	this.saleString = function(){
		var rString = "";
		rString = "<sale "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' price='" + this.price +
			"' crop='" + this.crop +
			"' purchaser='" + this.purchaser +
			"' farm='" + this.farm +
			"' deduction='" + this.deduction +
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
					action: "savesale",
					email: user.email,
					description: this.description,
					sale: this.saleString()
				}
			});

		func();
	}

	this.remove = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "removesale",
					email: user.email,
					description: this.description
				}
			});

		func();
	}



}
	
	//PLANT
	var SaleManager = function(){
	
		var doc;
		var saleEntity = new SaleEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Sale");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "sale.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewSalesAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		saleCache = new SaleCache(user.email, function(){
			var sales = saleCache.getSales();	
		});
		fieldCache = new FieldCache(user.email, function(){
			var fields = fieldCache.getAllFields();
			mapDisplay.showFields(fields);
			var farms = fieldCache.getAllFarms();
			mapDisplay.setFarms(farms);
			var sections = fieldCache.getAllSections();
			mapDisplay.setSections(sections);
			filterForm = new FilterForm(function(){
				inventoryDisplay = new InventoryDisplay();
				inventoryDisplay.refresh();
				gainDisplay = new GainDisplay();
				gainDisplay.refresh();
				filterForm.displayCrops(fields);
				filterForm.displayFarms(farms);
				filterForm.displaySections(sections);
				filterForm.enableListeners();
				func();
			});
		});
	}
		var selectedSale;
		function viewSalesAction(){
			$("#form_info").html("");
			$("#form_box").html("");
			$("#form_info").addClass("hide");
			if (saleCache.sales.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(saleCache.sales, function(i){
					$("#form_box table").append(createRow(this.description, this.product, "<span id='"+i+"'>view</span>"));
					selectedSale = saleCache.sales[i];
					$("#"+i).click(function(){
						selectedSale = saleCache.sales[i];
						viewSaleAction();
					});
				});		
			}
			else {
				$("#form_box").html("There have been no sales.");
			}
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFarmAction();
			});
		}
		function viewSaleAction(){
			$("#form_box").html("<b>Description:</b>"+selectedSale.description);
			$("#form_box").append("<br/><b>Crop:</b>"+selectedSale.crop);
			$("#form_box").append("<br/><b>Total:</b>"+selectedSale.total+" Bushels");
			$("#form_box").append("<br/><b>Price:</b>"+selectedSale.price + " <span id='price'><b>Edit</b></span>");
			$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="currentManager.handleCancel()"><img id="delete" src="buttons/delete.png" >');
		
			$("#delete").click(function(){
				selectedSale.remove(function(){
					currentManager.refresh(function(){
						currentManager = new SaleManager();
						currentManager.run();
					});
				});
			});
		
		}
		
		
		var saleEntity;
		function selectFarmAction(){
			saleEntity = new SaleEntity();
			$("#form_box").html($(doc).find("select-farm-form").text());
			$("#done").click(function(){
				saleEntity.farm = $("#form_box input[checked=true]").attr("value");
				$("#form_info").removeClass("hide");
				$("#form_info").append("<b>Farm:</b> "+saleEntity.farm);
				selectCropAction();
			});
		}
		
		function selectCropAction(){
			//get
			$("#form_box").html($(doc).find("select-crop-form").text());
			//get all crops according to selected farm and display
			$("#done").click(function(){
				saleEntity.crop = $("#form_box input[checked=true]").attr("value");
				$("#form_info").append("<br/><b>Crop:</b> "+saleEntity.crop);
				enterAmountAction();
			});
		}
		
		
		var max;
		function selectSourceAction(){
			$("#form_box").html($(doc).find("select-source-form").text());
			
			$("#total").text(max);
			//get all storage info by farm and crop
			$("#done").click(function(){
				saleEntity.source = "On Farm";
				$("#form_info").append("<br/><b>From:</b> "+saleEntity.source);
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			max = harvestCache.getAmount(saleEntity.farm, saleEntity.crop) - saleCache.getAmount(saleEntity.farm, saleEntity.crop);
			max= addCommas2(max)+" Bushels";
			saleEntity.source = "On Farm";
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$("#total").text(addCommas2(max)+" Bushels");
			$("#done").click(function(){
				saleEntity.total = $("#form_box input").attr("value");
				$("#form_info").append("<br/><b>Amount:</b> "+addCommas2(saleEntity.total) + " Bushels");
				enterVendorAction();
			});
		}
		
		function enterVendorAction(){
			$("#form_box").html($(doc).find("enter-vendor-form").text());
			$("#done").click(function(){
				saleEntity.purchaser = $("#form_box input[checked=true]").attr("value");
				$("#form_info").append("<br/><b>Purchaser:</b> "+saleEntity.purchaser);
				enterPriceAction();
			});
		}
		
		function enterPriceAction(){
			$("#form_box").html($(doc).find("enter-price-form").text());
			$("#done").click(function(){
				saleEntity.price = $("#form_box input").attr("value");
				$("#form_info").append("<br/><b>Price:</b> $"+saleEntity.price);
				enterDeductionAction();
			});
		}
		
		function enterDeductionAction(){
			$("#form_box").html($(doc).find("enter-deduction-form").text());
			$("#done").click(function(){
				saleEntity.deduction = $("#form_box input").attr("value");
				$("#form_info").append("<br/><b>Deduction:</b> $"+saleEntity.deduction);
				selectDateAction();
			});
		}
		
		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rSaleDate){
				saleEntity.date = rSaleDate;
				$("#form_box span").html("<br/>Selection:" + saleEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<div><b>Date: </b>" + saleEntity.date.dateString() + "</div>");
				enterDescriptionAction();
			});
		}
		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				saleEntity.description = $("#form_box input").attr("value");
				$("#form_info").append("<b>Description:</b> "+saleEntity.description);
				confirmAction();
			});
		}

		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				saleEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new SaleManager();
						currentManager.run();
					});
				});
			});
		}
		
		this.handleCancel = function(){
			currentManager = new SaleManager();
			currentManager.run();
		}	
		
}



var SaleCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getsales&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.sales = [];
	
	this.getSalesByCrop = function(crop){
		var rSales = [];
		$(doc).find("sale[crop="+crop+"]").each(function(){
			var sale = docToItem(this);
			rSales.push(sale);
		});
		return rSales;
	}
	this.getAmount = function(farm, crop){
		var total = 0;
		$(doc).find("sale[crop="+crop+"][farm="+farm+"]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	
	this.getAmounts = function(crop){
		var rVal = [];
		var bushels = 0;
		var dollars = 0;
		var sales = this.getSalesByCrop(crop);
		$.each(sales, function(){
			bushels += parseInt(this.total);
			dollars += parseInt(this.total) * parseInt(this.price);
		});
		rVal.push(bushels);
		rVal.push(dollars);
		return rVal;
	}

	
	this.getSales = function(){
		var rSales = [];
		try {
			$(doc).find("sale").each(function(){
				var sale = docToItem(this);
				rSales.push(sale);
			});
		}
		catch (e){}
		this.sales = rSales;
		return rSales;
	}
	
	this.issaled = function(field){
		
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
		$(doc).find("sale[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new SaleEntity();
		item.price = $(itemDoc).attr("price");
		item.total = $(itemDoc).attr("total");
		item.farm = $(itemDoc).attr("farm");
		item.crop = $(itemDoc).attr("crop");
		item.deduction = $(itemDoc).attr("deduction");
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





