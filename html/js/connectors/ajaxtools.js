	function get(urlStr, paramStr, logStr, func){
		loggingDisplay.enableUserWait(logStr);
		$.ajax({
			url: "/?action="+urlStr + "&" + paramStr,
			type: 'GET',
			dataType: 'html',
			error: function(xhr){
				loggingDisplay.disableUserWait();
				loggingDisplay.handleError(logStr);
			},
			success: function(data){
				loggingDisplay.disableUserWait();
				func(data);
			}
		});
	}
	
	function post(actionStr, id, xml, logStr, func){
		$("#log").text(logStr+".......");
		$.ajax({
			url: '/',
			type: 'POST',
			data: {
				action: actionStr,
				id: id,
				xml: xml
			},
			error: function(xhr){
				$("#log").text(logStr + " failed!");
				handleError(logStr);
			},
			success: function(){
				$("#log").text("Cropusoft!");
				func();
			}
		});
	}
	
	//CONVERTER FROM TEXT TO XML DOCUMENT
function textToDoc(dataText){
		var dataDoc = new ActiveXObject("Microsoft.XMLDOM")
        dataDoc.async="false";
		dataDoc.loadXML(dataText);
		return dataDoc;
	}
	
	function buildQuery(name, value){
		var rVal = "";
		if (value) {
			rVal = "[" + name + "=" + value + "]";
		}
		return rVal;
	}

	
	function loadArray(docToEntity, doc){
	var rVals = [];
	$(doc).each(function(i){
		rVals.push(docToEntity(this));
	});
	return rVals;
}