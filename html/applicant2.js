
var ApplicantEntity = function(){
	this.name
	this.type;
	this.crop;
	this.appConversion;
	this.priceConversion;
	this.appUnits;
	this.priceUnits;
	
	this.applicantString = function(){
		var rString = "";
		rString = "<applicant "+
			"  name='" + this.name+
			"' type='" + this.type + 
			"' crop='" + this.crop +
			"' appConversion='" + this.appConversion +
			"' priceConversion='" + this.priceConversion +
			"' appUnits='" + this.appUnits +
			"' priceUnits='" + this.priceUnits +
			"' >"+
			"</applicant>";
		return rString;
	}
	this.outputString = function(amount){
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
	
	
	this.save = function(func){

		var items = [];
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveapplicant",
					email: user.email,
					name: this.name,
					applicant: this.applicantString(),
					description: this.description
				}
			});

		func();
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
			$("#damn").removeClass("hide");
			if (type=='seed' && ( crop=='corn' || crop=='wheat')){
				$("#damn").html("Name: <input id='appName' type='text'></input><br/>");
			}
			if (type=='seed' && crop=='soybean'){
				$("#damn").html("Name: <input id='appName' type='text'></input><br/>");
				$("#damn").append("Kernals per Lb: <input id='appConversion' type='text'></input><br/>");
			}
			if (type=='treatment' || type=='innoculate'){
				$("#damn").html("Name: <input id='appName' type='text'></input><br/>");
				$("#damn").append("Units: <select id='unit_select'><option value='oz'>Ounce</option><option value='lb'>Pound</option></select>");
			}
		});
		
	}
	var type;
	var crop;
	
	this.getApplicantsForm = function(pType, pCrop){
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
		rHTML += "<div id='damn' class='hide'></div>";
		rHTML += '<img id="next" src="buttons/next.png" />';

		return rHTML;
	}
	
	this.getAmountForm = function(applicantEntity){
		var rHTML = "";
		rHTML += "<input type='text' id='appAmount'></input> "+applicantEntity.appUnits+"s/Acre<br/>";
		if (applicantEntity.appConversion != 1){
			rHTML += "<input type='text' id='unitAmount'></input> "+applicantEntity.priceUnits+"s/Acre<br/>";
		}
		if (applicantEntity.priceConversion != "1"){
			rHTML += "<input type='text' id='pricedAmount'></input> Units/Acre<br/>";
		}
		rHTML += "$ <input type='text' id='price'></input> per Unit<br/>   $<span id='costPerAcre'>0.00</span>/Acre  $<span id='cost'>0.00</span> Total<br/>";
		rHTML += '<img id="next" src="buttons/next.png" />';
		if (type == "chemical" || type == "treatment")
			rHTML += '<img id="more" src="buttons/add.png" />';
		
		return rHTML;
	}
	
	this.treatments = [];
	this.enableAmountFormEvents = function(applicantEntity, func2, func){
		var appAmount;
		var pricedAmount;
		var price;
		$("#appAmount").keyup(function(){
			var val = parseFloat($("#appAmount").attr("value"));
			appAmount = val;
			var val2 = val/applicantEntity.appConversion;
			var val3 = val2/applicantEntity.priceConversion;
			$("#unitAmount").attr("value", truncate(val2));
			pricedAmount = val3;
			$("#pricedAmount").attr("value", truncate(val3));
			$("#costPerAcre").html(truncate(pricedAmount*price));
			$("#cost").html(truncate(pricedAmount*price*currentManager.totalAcres()));
		});
		$("#unitAmount").keyup(function(){
			var val = parseFloat($("#unitAmount").attr("value"));
			var val2 = val*applicantEntity.appConversion;
			var val3 = val/applicantEntity.priceConversion;
			appAmount = val2;
			$("#appAmount").attr("value", truncate(val2));
			pricedAmount = val3;
			$("#pricedAmount").attr("value", truncate(val3));
			$("#costPerAcre").html(truncate(pricedAmount*price));
			$("#cost").html(truncate(pricedAmount*price*currentManager.totalAcres()));
		});
		$("#pricedAmount").keyup(function(){
			var val = parseFloat($("#pricedAmount").attr("value"));
			pricedAmount = val;
			var val2 = val*applicantEntity.priceConversion;
			var val3 = val2*applicantEntity.appConversion;
			$("#appAmount").attr("value", truncate(val3));
			appAmount = val3;
			$("#unitAmount").attr("value", truncate(val2));
			$("#costPerAcre").html(truncate(pricedAmount*price));
			$("#cost").html(truncate(pricedAmount*price*currentManager.totalAcres()));
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
			alert(applicantEntity.appUnits);
			applicantEntity.priceUnits = applicantEntity.appUnits;
			applicantEntity.appConversion = 1;
			applicantEntity.priceConversion = 1;
			currentManager.treatmentEntity = applicantEntity;
		}
		
		func();
	}
	
	
	function docToItem(itemDoc){
		var item = new ApplicantEntity();
		item.name = $(itemDoc).attr("name");
		item.crop = $(itemDoc).attr("crop");
		item.appConversion = $(itemDoc).attr("appConversion");
		item.priceConversion = $(itemDoc).attr("priceConversion");
		item.appUnits = $(itemDoc).attr("appUnits");
		item.priceUnits = $(itemDoc).attr("priceUnits");
		return item;
	}

}





