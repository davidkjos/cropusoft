
var ChemicalEntity = function(){
	this.fields = [];
	this.date;
	this.amountPerAcre;
	this.description;
	this.product;
	this.total;
	
	this.chemicalString = function(){
		var rString = "";
		rString = "<chemical "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' total='" + this.total +
			"' product='" + this.product +
			"' >"+
			this.getFields()+
			"</chemical>";
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
	
	
	
	this.save = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savechemical",
					email: user.email,
					chemical: this.chemicalString()
				}
			});

		func();
	}
}
	
	//PLANT
	var ChemicalManager = function(){
	
		var doc;
		var chemicalEntity = new ChemicalEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Chemical");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "chemical.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewChemicalsAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		chemicalCache = new ChemicalCache(user.email, function(){
			var chemicals = chemicalCache.getChemicals();	
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
		
		function viewChemicalsAction(){

			if (chemicalCache.chemicals.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(chemicalCache.chemicals, function(){
					$("#form_box table").append(createRow(this.description, this.product, "view"));
				});
			}
			else {
				$("#form_box").html("There have been no chemical applications.");
			}
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFieldAction();
			});
		}
		
		function selectFieldAction(){
			$("#form_box").html($(doc).find("select-fields-form").text());
			mapDisplay.enableFieldSelectionListener(function(i){
				selectedFieldsIndexes.push(i);
				var field = mapDisplay.getField(i);
				chemicalEntity.fields.push(field);
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
				$("#form_info").removeClass("hide");
				$("#form_info").html($("#selected_fields").clone().wrap("<div></div>"));
				selectDateAction();
			});
		}
		
		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rChemicalDate){
				chemicalEntity.date = rChemicalDate;
				$("#form_box span").html("<br/>Selection:" + chemicalEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<div><b>Date: </b>" + chemicalEntity.date.dateString() + "</div>");
				selectProductAction();
			});
		}
		
		
		var chemicalItem;
		var chemicalItems
		function selectProductAction(){
			$("#form_box").html($(doc).find("select-product-form").text());
		
			var chemicalItems = purchaseCache.getChemicals();
			$.each(chemicalItems, function(i){
				$("#form_box").find("span").append('<input type="radio" name="product_name" value="' + i + '">' + this.product + ' ('+this.amount+' '+this.units+')</input>');
			}); 
			$("#done").click(function(){
				
				selectedIndex = $("#form_box input[checked=true]").attr("value");
				chemicalItem = chemicalItems[selectedIndex];
				$("#form_info").append("<div><b>chemical: </b>" + chemicalItems[selectedIndex].product + "</div>");
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$(".units").each(function(){
				$(this).text(chemicalItem.units);
			});
			
			var absTotal = chemicalItem.amount;
			var acreTotal = absTotal / totalAcres;
			acreTotal = trunc(acreTotal);
			$("#acre_total").text(acreTotal);
			
			$("#done").click(function(){

				
				var amountPerAcre = parseFloat($("#form_box input[name=rate]").attr("value"));
				amount = amountPerAcre * totalAcres;
				chemicalEntity.amountPerAcre = amountPerAcre;
				chemicalEntity.total = amount;
				$("#form_info").append("<div><b>Entered Amount: </b>" + amount + " <span id='units'></span> (" + amountPerAcre + "<span id='units'></span>/Acre)</div>");
				$(".units").each(function(){
					$(this).text(chemicalItem.units);
				});
				enterDescriptionAction();
				
			});
		}
		
		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				description = $("#form_box input").attr("value");
				chemicalEntity.description = description;
				$("#form_info").append("<div><b>Description: </b>" + description);
				confirmAction();
			});
		}
		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				chemicalEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
		
}



var ChemicalCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getsprays&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			alert(data);
			doc = textToDoc(data);
			func();
		}
	});
	
	this.chemicals;
	
	
	this.getChemicals = function(){
		var rChemicals = [];
		$(doc).find("spray").each(function(){
			var chemical = docToItem(this);
			rChemicals.push(chemical);
		});
		this.chemicals = rChemicals;
		return rChemicals;
	}
	
	this.ischemicald = function(field){
		
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
		$(doc).find("chemical[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new ChemicalEntity();
		item.product = $(itemDoc).attr("product");
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = $(itemDoc).attr("total");
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





