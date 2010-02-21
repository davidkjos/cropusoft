//checkbox forms
//radio forms
//id:seed
//EG:seed_option
//items: list of seeds
//item: {applicant:name}




function RadioForms(pApplicants){
	var applicants = pApplicants;
	var selectedIndex;
	var amountForm;
	var enteredAmount = {amount:0, price:0}
	this.html = $("<table><tr><td><ul></ul></td><td><ul></ul></td></tr></table>");
	var divId = "radio_form";
	var thisObject = this;
	var limit = Math.ceil(applicants.length/2);
	var rightI = limit;
	var i=0;
	
	applicants.push({name: "New Seed"});
	
	for (var j=0; j<limit; j++){
		$(this.html).find("ul:nth(0)").append("<li><input type='radio' id='"+divId+"' name='"+divId+"' value='"+applicants[i].name+"' >"+applicants[i].name+"</input></li>");
		$(this.html).find("ul:nth(0)").append("<li><span class='amount_form hide'>Amount Form</span></li>");

		i++;
		if (i < applicants.length) {
			$(this.html).find("ul:nth(1)").append("<li><input type='radio' id='"+divId+"' name='"+divId+"' value='"+applicants[i].name+"' >"+applicants[i].name+"</input></li>");
			$(this.html).find("ul:nth(1)").append("<li><span class='hide'>Amount Form</span></li>");
			i++;
		}
		
	}
	this.enableListener = function(func){
		$("input[name=radio_form]").click(function(){
			$("#form_box span:nth("+selectedIndex+")").html("");
			$("#form_box span:nth("+selectedIndex+")").addClass("hide");
			selectedIndex = $("input").index(this);
			$("#form_box span:nth("+selectedIndex+")").removeClass("hide");
			$("#form_box span:nth("+selectedIndex+")").html("");
			
			if (applicants[selectedIndex].name == "New Seed") {
				var newApplicantForm = new NewApplicantForm();
				$("#form_box span:nth("+selectedIndex+")").html(newApplicantForm.html);
				newApplicantForm.enableListener(function(){			
				});
			}
			else {
				amountForm = new AmountForm(applicants[selectedIndex]);
				$("#form_box span:nth("+selectedIndex+")").html(amountForm.html);
				amountForm.enableListener(function(amount, price){			
				});
			}
			
			
			//if another radio selected, add hide to associated span
			//disable listener to old text box
			//result = get index by doing elementAt
			//set selected index
			//remove hide from associated span showing price/amount textboxes
			//enable listener for text box entries
			//func()  give control back to formdisplay
		});
	}
	this.enableTextListener = function(func){
		//run and display calculations using applicant equation
	}
	this.disableTextListener = function(func){
		//run and display calculations using applicant equation
	}
	
	
}

function NewApplicantForm(){
	var thisObject = this;
	this.applicant = new ApplicantEntity();
	this.applicant.appUnits = "Kernal";
	this.applicant.priceUnits = "Kernal";
	this.applicant.appConversion = 1;
	this.applicant.priceConversion = 1;
	var addButton;
	
	this.html = "<div id='new_app_form'>"
	
	this.html += "<b>Seed Name:</b><input type='text' class='new_seed_input' id='name' value=''></input>";
	
	this.html += "<br/>Which unit of measurement do you use for planting?";
	this.html += "<select id='app_select'>";
	this.html += "<option name='app_select' value='Kernal'>Kernal</option>";
	this.html += "<option name='app_select' value='Bushel'>Bushel</option>";
	this.html += "<option name='app_select' value='Lb'>Lb</option></select>";
	
	this.html += "<div id='purchase_units'>";
	this.html += "Which unit of measurement do you use for purchasing?";
	this.html += "<select id='purchase_select'>";
	this.html += "<option name='purchase_select' value='Kernal'>Kernal</option>";
	this.html += "<option name='purchase_select' value='Bushel'>Bushel</option>";
	this.html += "<option name='purchase_select' value='Lb'>Lb</option></select>";
	this.html += "</div>";
	
	this.html += "<div class ='hide' id='app_conversion'>"
	this.html += "How many <span id='app_units'></span>s in a <span class='price_units' id='price_units'></span>?";
	this.html += "<input type='text' class='app_conversion_input' id='app_conversion_input' value='1'></input>"
	this.html += "</div>";
	this.html += "How many <span class='price_units' id='price_units'>Kernal</span>s in every purchase unit?";
	this.html += "<input type='text' class='price_conversion_input' id='price_conversion_input' value='1'></input>"
	this.html += "</div>";
	addButton = new Button("images/add_button1.png", "add", function(){
		thisObject.applicant.name = $("#name").attr("value");
		thisObject.applicant.appConversion = $("#app_conversion_input").attr("value");
		thisObject.applicant.priceConversion = $("#price_conversion_input").attr("value");
	});
	this.html += addButton.html;
	
	this.enableListener = function(){
		addButton.enableListener();
		$("#app_select").change(function(){
			thisObject.applicant.appUnits = $("#app_select").attr("value");
			thisObject.initAppConversionInput();
		});
		
		$("#purchase_select").change(function(){
			thisObject.applicant.priceUnits = $("#purchase_select").attr("value");
			thisObject.initAppConversionInput();
		});
	};
	
	this.initAppConversionInput = function(){
		if (thisObject.applicant.appUnits != thisObject.applicant.priceUnits){
			$("#app_conversion").removeClass("hide");
			$("#app_units").text(thisObject.applicant.appUnits);
			$(".price_units").each(function(){
				$(this).text(thisObject.applicant.priceUnits);
			});
		}
		else {
			$("#app_conversion").addClass("hide");
		}
	}
	
}


function Button(url, id, action){
	this.url = url;
	this.id = id;
	this.action = action;
	this.html = "<img id='"+id+"' src='"+url+"' />";
	this.enableListener = function(func){
		$("#"+this.id).click(function(){
			action();
			if (func)
				func();
		});
	}
}


function AmountForm(pApplicant){
	
	var thisObject = this;
	var applicant = pApplicant;
	this.amount=0;
	this.price=0;
	this.priceUnitAmount=0;
	var salesUnitAmount=0;
	var totalSalesUnitAmount=0;
	var totalAmount=0;
	var totalPriceAmount=0;
	var costPerAcre=0;
	var totalCost=0;
	

	//acres to be planted
	this.html = "<b>Acres to be planted:</b>"+currentManager.acreage;
	//kernals per acre
	this.html += "<br/><b>"+applicant.appunits+"s per acre:</b><input type='text' class='form_input amount_input' value='"+this.amount+"'></input>";
	//total kernals
	this.html += "<br/><b>Total "+applicant.appunits+"s:</b><span class='total_amount'>0</span>";
	if (applicant.appunits != applicant.priceunits) {
		//kernals per lb note
		this.html += "<br/><b>"+ applicant.appunits + "s per " + applicant.priceunits + ":</b> "+applicant.appconversion;
		//lbs per acre
		this.html += "<br/><b>" + applicant.priceunits + "s per acre:</b><span class='price_unit_amount'>0</span>";
		//total lbs
		this.html += "<br/><b>Total " + applicant.priceunits + "s:</b><span class='total_price_amount'>0</span>";
	}
	if (applicant.priceconversion != 1) {
		//lb per purchase unit
		this.html += "<br/><b>"+ applicant.priceunits + "s per Purchase Unit:</b> "+applicant.priceconversion;
		//purchase units per acre
		this.html += "<br/><b> " + applicant.priceconversion +" "+ applicant.priceunits + " units per acre:</b><span class='sales_unit_amount'>0</span>";
		//total purchase units
		this.html += "<br/><b> Total " + applicant.priceconversion +" "+ applicant.priceunits + " units:</b><span class='total_sales_unit_amount'>0</span>";
	}
	//enter price per unit
	this.html += "<br/><b>Price per "+applicant.priceconversion+" "+applicant.priceunits +" Units:</b><input type='text' class='form_input price_input' value='"+this.price+"'></input>";
	//cost per acre
	this.html += "<br/><b>Cost Per Acre:</b>$<span class='cost_per_acre'>0</span>";
	//total cost
	this.html += "<br/><b>Total Cost:</b>$<span class='total_cost'>0</span>";

	
	this.enableListener = function(func){
		$(".form_input").keyup(function(){
			
			//get kernals per acre
			
			thisObject.amount = parseFloat($(this).parent().find("input[class=form_input amount_input]").attr("value"));
			var totalAmountDoc = $(this).parent().find("span[class=total_amount]");
			//total kernals
			totalAmount = thisObject.amount*currentManager.acreage;
			$(totalAmountDoc).text(addCommas(truncate(totalAmount)));
			
			//lbs per acre
			priceUnitAmount = thisObject.amount / applicant.appconversion;
			priceUnitAmountDoc =  $(this).parent().find("span[class=price_unit_amount]");
			$(priceUnitAmountDoc).text(truncate(priceUnitAmount));
			
			//total lbs
			totalPriceAmount = priceUnitAmount*currentManager.acreage;
			totalPriceDoc = $(this).parent().find("span[class=total_price_amount]");
			$(totalPriceDoc).text(truncate(totalPriceAmount));
			
			//units per acre
			salesUnitAmount = priceUnitAmount / applicant.priceconversion;
			var salesUnitAmountDoc = $(this).parent().find("span[class=sales_unit_amount]");
			$(salesUnitAmountDoc).text(truncate(salesUnitAmount));
			
			//total units
			totalSalesUnitAmount = salesUnitAmount*currentManager.acreage;
			var totalSalesUnitAmountDoc = $(this).parent().find("span[class=total_sales_unit_amount]");
			$(totalSalesUnitAmountDoc).text(addCommas(truncate(totalSalesUnitAmount)));
			
			//get price per unit
			thisObject.price = parseFloat($(this).parent().find("input[class=form_input price_input]").attr("value"));
			//cost per acre
			costPerAcre = thisObject.price*salesUnitAmount;
			var costPerAcreDoc = $(this).parent().find("span[class=cost_per_acre]");
			$(costPerAcreDoc).text(addCommas(truncate(costPerAcre)));
			
			//total cost
			totalCost = currentManager.acreage * costPerAcre;
			var totalCostDoc = $(this).parent().find("span[class=total_cost]");
			$(totalCostDoc).text(addCommas(truncate(totalCost)));
			
			func(thisObject.price, thisObject.amount);
		});
	}		
}


//id:chemical, treatment, fertilizer
function CheckboxForms(pApplicants){
	var applicants = pApplicants;
	var selectedIndices = [];
	var amountForms = [];
	var divId = "checkbox_form";
	this.html;
	var limit = Math.ceil(applicants.length/2);
	var i=0;
	this.html = $("<table><tr><td><ul></ul></td><td><ul></ul></td></tr></table>");
	
	applicants.push({name: "New Fertilizer"});
	
	for (var j=0; j<limit; j++){
		$(this.html).find("ul:nth(0)").append("<li><input type='checkbox' id='"+divId+"' name='"+divId+"' value='"+applicants[i].name+"' >"+applicants[i].name+"</input></li>");
		$(this.html).find("ul:nth(0)").append("<li><span class='checkbox_span hide'>Amount Form</span></li>");

		i++;
		if (i < applicants.length) {
			$(this.html).find("ul:nth(1)").append("<li><input type='checkbox' id='"+divId+"' name='"+divId+"' value='"+applicants[i].name+"' >"+applicants[i].name+"</input></li>");
			$(this.html).find("ul:nth(1)").append("<li><span class='checkbox_span hide'>Amount Form</span></li>");
			i++;
		}
	}
	
	
	
	this.enableListener = function(func){
		$("input[name=checkbox_form]").click(function(){
			var selectedIndex = $("input[name=checkbox_form]").index(this);
			if ($(this).attr("checked")){
				amountForm = new AmountForm(applicants[selectedIndex]);
				$(".checkbox_span:nth("+selectedIndex+")").removeClass("hide");
				$(".checkbox_span:nth("+selectedIndex+")").html(amountForm.html);
				amountForm.enableListener(function(){
					
				});
				selectedIndices.push(selectedIndex);
				amountForms.push(amountForm);
			}
			else {
				$(".checkbox_span:nth("+selectedIndex+")").html("");
				$(".checkbox_span:nth("+selectedIndex+")").addClass("hide");
				var index = getIndexAt(selectedIndices, selectedIndex);
				selectedIndices.splice(index, 1);
				amountForms.splice(index, 1);
			}
			
			//result = get index by doing elementAt
			//add selected index to list
			//remove hide from associated span showing price/amount textboxes
			//enable listener for text box entries
			//func()  give control back to formdisplay
		});
	}
	this.enableCheckboxUncheckedListener = function(func){
			//remove selected index from list
			//add hide to associated span elements
			//disable listener for text box entries
	}
	this.enableTextListener = function(func){
		//run and display calculations using applicant equation
	}
}




//items: each holds an id, useroption, and value
function Radio(label, id, items){
	thisObject = this;
	this.id = id;
	this.items = items;
	this.html = "<b>"+label+":</b>";
	var result = null;
	this.getResult = function(){
		return result;
	}
	this.enableListener = function(func){

		$("input[name="+this.id+"]").click(function(){
			result = $(this).attr("value");
		});
	}
	var br="";
	$.each(items, function(){
		thisObject.html += "<br/><input type='radio' id='"+thisObject.id+"' name='"+thisObject.id+"' value='"+this.value+"' >"+this.label+"</input>"+br;
	});
}


function TextBox(label, id){
	var result = null;
	this.label = label;
	this.id = id;
	this.html = "<b>"+this.label+":</b>";
	this.getResult = function(){
		return result;
	}
	this.html += "<input type='text' id='" + this.id+"' ></input>";	
	this.enableListener = function(func){
		$("#"+this.id).keyup(function(){
			result = $(this).attr("value");
		});
	}
	this.value = function(){
		return $("#" + this.id).attr("value");
	}
	this.setValue = function(){
		$("#" + this.id).attr("value");
	}
}

function Select(items){
	var str = "<select id="+items[0].id+" name="+items[0].id+" >";
	$.each(items, function(){
		str += "<option value='"+this.value+"'>"+this.displayValue+"</option>";
	});
	return str;
}

//items is 2 dimensional for table
function Table(items){
	var str = "<table>";
	for (var i=0; i<items.length; i++){
		str += "<tr>";
		for (var j=0; j<items[i].length; j++){
			str += "<td>";
			str += items[i][j];
			str += "</td>";
		}
		str += "</tr>";
	}
	str += "</table>";
	return str;
}







