
var FertilizeEntity = function(){
	this.fields = [];
	this.date;
	this.amountPerAcre;
	this.description;
	this.product;
	this.total;
	
	this.fertilizeString = function(){
		var rString = "";
		rString = "<fertilize "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' total='" + this.total +
			"' product='" + this.product +
			"' >"+
			"<fields>"+this.getFields()+"</fields>"+
			"</fertilize>";
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
					action: "savefertilize",
					email: user.email,
					fertilize: this.fertilizeString()
				}
			});

		func();
	}
}
	
	//PLANT
	var FertilizeManager = function(){
	
		var doc;
		var fertilizeEntity = new FertilizeEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Fertilize");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "fertilize.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewFertilizesAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		fertilizeCache = new FertilizeCache(user.email, function(){
			var fertilizes = fertilizeCache.getFertilizes();	
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
		
		function viewFertilizesAction(){

			if (fertilizeCache.fertilizes.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(fertilizeCache.fertilizes, function(){
					$("#form_box table").append(createRow(this.description, this.product, "view"));
				});
			}
			else {
				$("#form_box").html("There have been no fertilizer applications.");
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
				fertilizeEntity.fields.push(field);
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
			calendarDisplay.setAction(function(rFertilizeDate){
				fertilizeEntity.date = rFertilizeDate;
				$("#form_box span").html("<br/>Selection:" + fertilizeEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<div><b>Date: </b>" + fertilizeEntity.date.dateString() + "</div>");
				selectProductAction();
			});
		}
		
		
		var fertilizer;
		var fertilizers;
		function selectProductAction(){
			var moreHTML="<br/>Applied by the <select><option value='Lb'>Lb</option><option value='Ton'>Ton</option></select><br/> and priced by:<select><option value='Lb'>Lb</option><option value='Ton'>Ton</option><option value='Ounce'>Ounce</option><option value='Gallon'>Gallon</option></select><br/><br/><img id='cancel' src='buttons/cancel.png' onclick='handleCancel()'><img id='done' src='buttons/next.png' />";
			
			$("#form_box").html($(doc).find("select-product-form").text());
		
			var seedOptionsString = seedCache.getOptionsString();
			$("#form_box span").html(seedOptionsString); 
			$("#form_box span").append(moreHTML); 
			$("#done").click(function(){
				
				selectedIndex = $("#form_box input[checked=true]").attr("value");
				fertilizer = fertilizers[selectedIndex];
				$("#form_info").append("<div><b>Fertilizer: </b>" + fertilizers[selectedIndex].product + "</div>");
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$(".units").each(function(){
				$(this).text(fertilizer.units);
			});
			
			var absTotal = fertilizers[selectedIndex].amount;
			var acreTotal = absTotal / totalAcres;
			acreTotal = trunc(acreTotal);
			$("#acre_total").text(acreTotal);
			
			$("#done").click(function(){

				
				var amountPerAcre = parseFloat($("#form_box input[name=rate]").attr("value"));
				amount = amountPerAcre * totalAcres;
				fertilizeEntity.amountPerAcre = amountPerAcre;
				fertilizeEntity.total = amount;
				$("#form_info").append("<div><b>Entered Amount: </b>" + amount + " <span id='units'></span> (" + amountPerAcre + "<span id='units'></span>/Acre)</div>");
				$(".units").each(function(){
					$(this).text(fertilizer.units);
				});
				enterDescriptionAction();
				
			});
		}
		
		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				description = $("#form_box input").attr("value");
				fertilizeEntity.description = description;
				$("#form_info").append("<div><b>Description: </b>" + description);
				confirmAction();
			});
		}
		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				fertilizeEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
		
}



var FertilizeCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getfertilizes&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.fertilizes;
	
	
	this.getFertilizes = function(){
		var rFertilizes = [];
		$(doc).find("fertilize").each(function(){
			var fertilize = docToItem(this);
			rFertilizes.push(fertilize);
		});
		this.fertilizes = rFertilizes;
		return rFertilizes;
	}
	
	this.isFertilized = function(field){
		
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
		$(doc).find("fertilize[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new FertilizeEntity();
		item.product = $(itemDoc).attr("product");
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = $(itemDoc).attr("total");
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





