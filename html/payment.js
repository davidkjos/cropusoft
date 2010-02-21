var PaymentEntity = function(){
	this.description;
	this.type;
	this.amount;
	this.date;
	this.vendor;
	
	this.xmlString = function(){
		var rString = "";
		rString = "<payment "+
			"  description='" + this.description+
			"' type='" + this.type +
			"' amount='" + this.amount + 
			"' day='" + this.date.day + 
			"' month='" + this.date.month +
			"' year='" + this.date.year +
			"' vendor='" + this.vendor +
			"' />";
		return rString;
	}
	
	this.save = function(func){
		$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "savepayment",
					email: user.email,
					description: this.description,
					payment: this.xmlString()
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
					action: "editpayment",
					email: user.email,
					payment: this.xmlString(),
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
					action: "removepayment",
					email: user.email,
					description: this.description
				}
			});
		func();
	}
}


var PaymentCache = function(func){
	var doc;
	
	$.ajax({
		url: "/?action=getpayments&email="+user.email,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	this.payments;
	
	this.getPayment = function(description){
		var rVal = $(doc).find("payment[description = "+description+"]");
		
		rVal = docToItem(rVal);
		return rVal;
	}
	
	this.getPayments = function(){
		var rPayments = [];
		$(doc).find("payment").each(function(){
			var payment = docToItem(this);
			rPayments.push(payment);
		});
		
		this.payments=rPayments;
		return rPayments;
	}
	
	function docToItem(itemDoc){
		var item = new PaymentEntity();
		item.date = new DateEntity();
		item.description = $(itemDoc).attr("description");
		item.type = $(itemDoc).attr("type");
		item.amount = $(itemDoc).attr("amount");
		item.date.day = $(itemDoc).attr("day");
		item.date.month = $(itemDoc).attr("month");
		item.date.year = $(itemDoc).attr("year");
		item.vendor = $(itemDoc).attr("vendor");
		return item;
	}
	
}


