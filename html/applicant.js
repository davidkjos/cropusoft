
var ApplicantReferenceEntity = function(){
	this.name;
	this.price;
	this.rate;
	this.xmlString = function(type){
		return "<"+type+" name="+this.name+" price="+this.price+" rate="+this.rate+" />";
	}
}

var ApplicantEntity = function(){
	this.name;
	this.type;
	this.crop;
	this.appConversion;
	this.priceConversion;
	this.appUnits;
	this.priceUnits;
	
	this.xmlString = function(){
		return "<applicant "+
			"  name='" + this.name+
			"' type='" + this.type + 
			"' crop='" + this.crop +
			"' appConversion='" + this.appConversion +
			"' priceConversion='" + this.priceConversion +
			"' appUnits='" + this.appUnits +
			"' priceUnits='" + this.priceUnits +
			"' >"+
			"</applicant>";
	}
	
	this.descriptionString = function(amount){
		var appAmount = parseFloat(amount);
		var rString = this.name +" which is applied by "+this.appUnits +" ";
		if (this.appConversion != 1){
			rString += ", "+this.appConversion + " " + this.appUnits + " per " + this.priceUnits; 
		}
		if (this.priceConversion != 1){
			rString += ", " + this.priceConversion + " " + this.priceUnits + " per Purchase Unit"; 
		}
		return rString;
		
	}
	
	this.isSaved = false;
	
	this.save = function(func){

		if (!this.isSaved) {
			var items = [];
			$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveapplicant",
					email: user.email,
					name: this.name,
					applicant: this.xmlString(),
					description: this.description
				}
			});
			
			func();
		}
		else {
			func();
		}
	}
	this.remove = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "removeapplicant",
					email: user.email,
					name: this.name
				}
			});

		func();
	}
	
}





var ApplicantCache = function(pEmail, func){
	var doc;

	$.ajax({
		
		url: "/?action=getapplicants&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);

			func();
		}
	});
	
	this.applicants = [];
	
	
	var applicants = [];
	
	this.enableFormListener = function(){
		var html = "";
		$("input[name=applicant_choice]").click(function(){
			if ($(this).attr("value")=="new"){
				$("#abcd").removeClass("hide");
				if (type=='seed' && ( crop=='corn' || crop=='wheat')){
					$("#abcd").html("Name: <input id='appName' type='text'></input><br/>");
				}
				if (type=='seed' && crop=='soybean'){
					$("#abcd").html("Name: <input id='appName' type='text'></input><br/>");
					$("#abcd").append("Kernals per Lb: <input id='appConversion' type='text'></input><br/>");
				}
				if (type=='treatment' || type=='innoculate'){
					$("#abcd").html("Name: <input id='appName' type='text'></input><br/>");
					$("#abcd").append("Units: <select id='unit_select'><option value='oz'>Ounce</option><option value='lb'>Pound</option></select>");
				}
			}
			else {
				var index = $(this).attr("value");
				alert(applicants[index].appUnits);
				currentManager.chosenApplication = applicants[index];
			}
		});
		
		
	}
	var type;
	var crop;
	
	this.getApplicantsForm = function(pType, pCrop){
		alert(pType);
		type = pType;
		crop = pCrop;
		var rHTML = "";
		$(doc).find("applicant[type="+type+"][crop="+crop+"]").each(function(i){
			var applicant = docToItem(this);
			rHTML += "<input type='radio' name='applicant_choice' value='"+i+"' >";
			rHTML += applicant.name;
			rHTML += "</input><br/>";
			applicants.push(docToItem(this));	
		});
		rHTML += "<input type='radio' name='applicant_choice' value='new' >New</input>";
		rHTML += "<div id='abcd' class='hide'></div>";
		rHTML += '<br/><img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="next" src="buttons/next.png" />';

		return rHTML;
	}

	
	this.getAmountForm = function(applicantEntity){
		var html = "";
		html += "<input type='text' id='appAmount' name='appAmount'></input> "+applicantEntity.appUnits;
		if (applicantEntity.appConversion != 1){
			html += "<br/><input type='text' id='unitAmount' name='unitAmount'></input> "+applicantEntity.priceUnits;
		}
		if (applicantEntity.priceConversion != 1){
			html += "<br/><input type='text' id='pricedAmount' name='pricedAmount'></input> "+applicantEntity.priceUnits+"X"+applicantEntity.priceConversion;
		}
		html += "<br/>$<input type='text' id='price' name='price'></input> Per "+applicantEntity.priceUnits +" X "+applicantEntity.priceConversion;
		html += "<br/><b>Cost Per Acre:</b> $<span id='costPerAcre' >??</span>  Total: $<span id='cost' >??</span>";
		html += '<br/><img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="next" src="buttons/next.png" />';
		return html;
	}
	
	this.treatments = [];
	this.enableAmountFormEvents = function(applicantEntity, func2, func){
		var appAmount;
		var pricedAmount;
		var price = "??";
		$("#appAmount").keyup(function(){
			var val = parseFloat($("#appAmount").attr("value"));
			appAmount = val;
			var val2 = val/applicantEntity.appConversion;
			var val3 = val2/applicantEntity.priceConversion;
			$("#unitAmount").attr("value", truncate(val2));
			pricedAmount = val3;
			$("#pricedAmount").attr("value", truncate(val3));
			if (price != "??") {
				$("#costPerAcre").html(truncate(pricedAmount * price));
				$("#cost").html(truncate(pricedAmount * price * currentManager.totalAcres()));
			}
		});
		$("#unitAmount").keyup(function(){
			var val = parseFloat($("#unitAmount").attr("value"));
			var val2 = val*applicantEntity.appConversion;
			var val3 = val/applicantEntity.priceConversion;
			appAmount = val2;
			$("#appAmount").attr("value", truncate(val2));
			pricedAmount = val3;
			$("#pricedAmount").attr("value", truncate(val3));
			if (price != "??") {
				$("#costPerAcre").html(truncate(pricedAmount * price));
				$("#cost").html(truncate(pricedAmount * price * currentManager.totalAcres()));
			}
		});
		$("#pricedAmount").keyup(function(){
			var val = parseFloat($("#pricedAmount").attr("value"));
			pricedAmount = val;
			var val2 = val*applicantEntity.priceConversion;
			var val3 = val2*applicantEntity.appConversion;
			$("#appAmount").attr("value", truncate(val3));
			appAmount = val3;
			$("#unitAmount").attr("value", truncate(val2));
			if (price != "??") {
				$("#costPerAcre").html(truncate(pricedAmount * price));
				$("#cost").html(truncate(pricedAmount * price * currentManager.totalAcres()));
			}
		});
		$("#price").keyup(function(){
			var val = parseFloat($("#price").attr("value"));
			currentManager.price = val;
			price = val;
			val = val*pricedAmount;
			$("#costPerAcre").html(truncate(val));
			$("#cost").html(truncate(val*currentManager.totalAcres()));
		});
		$("#next").click(function(){
			currentManager.price = price;
			currentManager.amount = appAmount;
			func();
		});
		$("#more").click(function(){
			currentManager.price = price;
			currentManager.amount = appAmount;
			$("#form_info").append("</br><b>Total:</b>"+currentManager.amount+" "+currentManager.treatmentEntity.appUnits+"s at $"+currentManager.price+" per "+currentManager.treatmentEntity.priceUnits + " X "+currentManager.treatmentEntity.priceConversion);
			currentManager.treatments.push(this.treatmentEntity);
			func2();
		});
	}
	
	this.getApplicant = function(i){
		return applicants[i];
	};
	
	this.handleNew = function(func){
		applicantEntity = new ApplicantEntity();
		applicantEntity.name = $("#appName").attr("value");
		applicantEntity.type = type;
		applicantEntity.crop = crop;

		//if (type = )

		if (type=='seed' && crop=='corn'){
			applicantEntity.appUnits = "Kernal";
			applicantEntity.priceUnits = "Bag";
			applicantEntity.appConversion = 80000;
			applicantEntity.priceConversion = 1;
			currentManager.applicantEntity = applicantEntity;
		}
		if (type=='seed' && crop=='soybean'){
			applicantEntity.appUnits = "Kernal";
			applicantEntity.priceUnits = "Lb";
			applicantEntity.appConversion = $("#appConversion").attr("value");
			applicantEntity.priceConversion = 50;
			currentManager.applicantEntity = applicantEntity;
		}
		if (type=='seed' && crop=='wheat'){
			applicantEntity.appUnits = "Bushel";
			applicantEntity.priceUnits = "Bushel";
			applicantEntity.appConversion = 1;
			applicantEntity.priceConversion = 1;
			currentManager.applicantEntity = applicantEntity;
		}
		if (type=='treatment'){
			applicantEntity.appUnits = $("#unit_select").val();
			applicantEntity.priceUnits = applicantEntity.appUnits;
			applicantEntity.appConversion = 1;
			applicantEntity.priceConversion = 1;
			currentManager.treatmentEntity = applicantEntity;
		}
		
		func();
	}
	
	
	function docToItem(itemDoc){
		var item = new ApplicantEntity();
		item.isSaved = true;
		item.name = $(itemDoc).attr("name");
		item.crop = $(itemDoc).attr("crop");
		item.appConversion = $(itemDoc).attr("appConversion");
		item.priceConversion = $(itemDoc).attr("priceConversion");
		item.appUnits = $(itemDoc).attr("appUnits");
		item.priceUnits = $(itemDoc).attr("priceUnits");
		return item;
	}

}





