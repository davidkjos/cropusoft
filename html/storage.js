
var StorageEntity = function(){
	
	this.date;
	this.farm;
	this.crop;
	this.source;
	this.destination;
	this.crop;
	this.amount;
	this.description;
	this.total;
	
	this.storageString = function(){
		var rString = "";
		rString = "<storage "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' source='" + this.source +
			"' destination='" + this.destination +
			"' crop='" + this.crop +
			"' amount='" + this.amount +
			"' farm='" + this.farm +
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
					action: "savestorage",
					email: user.email,
					storage: this.storageString()
				}
			});

		func();
	}
}
	
	//PLANT
	var StorageManager = function(){
	
		var doc;
		var storageEntity = new StorageEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Storage");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "storage.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewStoragesAction();
				}
			});
		}
		
		
	this.refresh = function(func){
		storageCache = new StorageCache(user.email, function(){
			var storages = storageCache.getStorages();	
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
		
		function viewStoragesAction(){
			if (storageCache==null){
				alert("storageCache==null");
			}
			if (storageCache.storages==null){
					alert("storageCache.storages==null");
					
				}
			if (storageCache.storages.length==null){
						alert("storageCache.storages.length==null");
					}
			if (storageCache.storages.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(storageCache.storages, function(){
					$("#form_box table").append(createRow(this.crop, this.total + " Bushels", "view"));
				});
			}
			else {
				$("#form_box").html("There have been no storages.");
			}
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFarmAction();
			});
		}
		var storageEntity;
		
		function selectFarmAction(){
			$("#form_box").html($(doc).find("select-farm-form").text());
			$("#done").click(function(){
				storageEntity.farm = "296";
				$("#form_info").removeClass("hide");
				$("#form_info").append("<b>Farm:</b> "+storageEntity.farm);
				selectCropAction();
			});
		}
		
		function selectCropAction(){
			//get
			storageEntity = new StorageEntity();
			$("#form_box").html($(doc).find("select-crop-form").text());
			//get all crops according to selected farm and display
			$("#done").click(function(){
				storageEntity.crop = "corn";
				$("#form_info").append("<br/><b>Crop:</b> "+storageEntity.crop);
				selectSourceAction();
			});
		}
		
		
		function selectSourceAction(){
			$("#form_box").html($(doc).find("select-source-form").text());
			//get all storage info by farm and crop
			$("#done").click(function(){
				storageEntity.source = "On Farm";
				$("#form_info").append("<br/><b>From:</b> "+storageEntity.source);
				selectDestinationAction();
			});
		}
		
		function selectDestinationAction(){
			$("#form_box").html($(doc).find("select-destination-form").text());
			$("#done").click(function(){
				storageEntity.destination = "Clifford";
				$("#form_info").append("<br/><b>Destination:</b> "+storageEntity.destination);
				enterAmountAction();
			});
		}
		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
			$("#done").click(function(){
				storageEntity.amount = "2,301";
				$("#form_info").append("<br/><b>Amount:</b> "+storageEntity.amount + " Bushels");
				selectDateAction();
			});
		}
		
		
		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rStorageDate){
				storageEntity.date = rStorageDate;
				$("#form_box span").html("<br/>Selection:" + storageEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<div><b>Date: </b>" + storageEntity.date.dateString() + "</div>");
				enterDescriptionAction();
			});
		}

		


		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				description = $("#form_box input").attr("value");
				storageEntity.description = description;
				$("#form_info").append("<div><b>Description: </b>" + description);
				confirmAction();
			});
		}
		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				storageEntity.save(function(){
					currentManager.refresh(function(){
						currentManager = new HomeManager();
						currentManager.run();
					});
				});
			});
		}
		
}



var StorageCache = function(pEmail, func){
	var doc;
	$.ajax({
		
		url: "/?action=getstorages&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);
			func();
		}
	});
	
	this.storages = [];
	
	this.getAmount = function(farm, crop){
		var total = 0;
		$(doc).find("storage[crop="+crop+"][source=harvest][farm="+farm+"]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	
	this.getCorn = function(){
		var total = 0;
		$(doc).find("storage[crop=corn][source=harvest]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	this.getSoybean = function(){
		var total = 0;
		$(doc).find("storage[crop=soybean][source=harvest]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	this.getWheat = function(){
		var total = 0;
		$(doc).find("storage[crop=wheat][source=harvest]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	
	this.getStorages = function(){

		var rStorages = [];

			$(doc).find("storage").each(function(){
	
				var storage = docToItem(this);
				rStorages.push(storage);
			});

		this.storages = rStorages;
		return rStorages;
	}
	
	this.isstoraged = function(field){
		
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
		$(doc).find("storage[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new StorageEntity();
		item.crop = $(itemDoc).attr("crop");
		item.source = $(itemDoc).attr("source");
		item.destination = $(itemDoc).attr("destination");
		item.total = $(itemDoc).attr("total");
		item.description = $(itemDoc).attr("description");
		return item;
	}

}





