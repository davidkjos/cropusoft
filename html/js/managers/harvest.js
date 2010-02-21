
var HarvestEntity = function(){
	this.fields = [];
	this.date;
	this.farm;
	this.amountPerAcre;
	this.description;
	this.crop;
	this.total;
	
	this.harvestString = function(){
		var rString = "";
		rString = "<harvest "+
			"  description='" + this.description+
			"' receiveDay='" + this.date.day + 
			"' receiveMonth='" + this.date.month +
			"' receiveYear='" + this.date.year +
			"' amountPerAcre='" + this.amountPerAcre +
			"' farm='" + this.farm +
			"' crop='" + this.crop +
			"' total='" + this.total +
			"' >"+
			this.getFields()+
			"</harvest>";
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
					action: "saveharvest",
					email: user.email,
					harvest: this.harvestString(),
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
					action: "removeharvest",
					email: user.email,
					description: this.description
				}
			});

		func();
	}

}
	
	//PLANT
	var HarvestManager = function(){
	
		var doc;
		var harvestEntity = new HarvestEntity();
		var selectedFieldsIndexes = [];
		var totalAcres = 0;
		
		this.run = function(){
			$("#form_title").html("Harvest");
			$("#main_form_inner").removeClass("hide");
			
			$.ajax({
				url: "harvest.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					doc = textToDoc(data);
					viewHarvestsAction();
				}
			});
		}
		
	this.handleCancel = function(){
		currentManager = new HarvestManager();
		currentManager.run();
	}		
	this.refresh = function(func){
		harvestCache = new HarvestCache(user.email, function(){
			var harvests = harvestCache.getHarvests();	
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
				storageCache =  new StorageCache(user.email, function(){
						storageCache.getStorages();
						inventoryDisplay = new InventoryDisplay();
						inventoryDisplay.refresh();
						gainDisplay = new GainDisplay();
						gainDisplay.refresh();
						func();
				});
			});
		});
		});
		
	}
		var selectedHarvest;
		function viewHarvestsAction(){
			$("#form_info").addClass("hide");
			if (harvestCache.harvests.length > 0) {
				$("#form_box").html('<table class="three_column"></table>');
				$.each(harvestCache.harvests, function(i){
					var total = addCommas2(this.total);
					$("#form_box table").append(createRow(this.crop, total+" Bushels", "<span id='"+i+"'>view</span>"));
					$("#"+i).click(function(){
						selectedHarvest = harvestCache.harvests[i];
						viewHarvestAction();
					});
				});
				/*
				 $.each(plantCache.plantings, function(i){
				$("#form_box table").append(createRow(this.description,this.crop, "<span id='"+i+"'>View</span>"));
				$("#"+i).click(function(){
					selectedPlanting = plantCache.plantings[i];
					viewPlantingAction(selectedIndex);
				});
			});
				 */
			}
			else {
				$("#form_box").html("There have been no harvests.");
			}
			$("#form_box").append('<img id="cancel" src="buttons/cancel.png" onclick="handleCancel()"><img id="done" src="buttons/next.png" />');
			
			$("#done").click(function(){
				selectFieldAction();
			});
			
		}
		
		function viewHarvestAction(){
			$("#form_box").html("<b>Description:</b>"+selectedHarvest.description);
			$("#form_box").append("<br/><b>Crop:</b>"+selectedHarvest.crop);
			$("#form_box").append("<br/><b>Total:</b>"+selectedHarvest.total);
			$("#form_box").append("<br/><b>Yield:</b>"+selectedHarvest.amountPerAcre + " <span id='yield'><b>Edit</b></span>");
			$("#form_box").append('<br/><img id="cancel" src="buttons/cancel.png" onclick="currentManager.handleCancel()"><img id="delete" src="buttons/delete.png" >');
			
			$("span").click(function(){
				var id = $(this).attr("id");

					startEdit(id);
					$("#save").click(function(){
						var newVal = $("#form_box input").attr("value");
						selectedPlanting.setVal(id, newVal, purchase);
						purchase.setVal(id, newVal);
						selectedPlanting.edit(function(){
							selectedPlanting.payment.edit(function(){
								currentManager.refresh(function(){
									viewPlantingAction();
								});
							});
						});
					});
					$("#cancel_edit").click(function(){
						endEdit(id);
					});
				
			});
			$("#delete").click(function(){
				selectedHarvest.remove(function(){
					currentManager.refresh(function(){
						currentManager = new HarvestManager();
						currentManager.run();
					});
				});
			});
			
		}
		
		
		function selectFieldAction(){
			$("#form_box").html($(doc).find("select-fields-form").text());
			var crop = "none";
			var farm = "none"
			mapDisplay.enableFieldSelectionListener(function(i){
				selectedFieldsIndexes.push(i);
				var field = mapDisplay.getField(i);
				
					if ((crop == "none" && farm == "none") || ( crop == field.crop && farm == field.farm )) {
						
						crop = field.crop;
						farm = field.farm;
						harvestEntity.fields.push(field);
						if (!field.acreage || field.acreage == "NaN") {
							field.acreage = pullAcreage(field);
						}
						totalAcres += parseInt(field.acreage);
						mapDisplay.highlightSelection(i);
						$("#selected_fields").removeClass("hide");
						$("<tr><td>" + field.name + "</td><td>" + field.acreage + " Acres (" + crop + ")</td></tr>").insertBefore("#total_acres_tr");
						$("#total_acres_tr").find("td:nth(1)").text(totalAcres + " Acres");
					}
				
			});
			$("#done").click(function(){
				harvestEntity.crop = crop;
				harvestEntity.farm = farm;
				$("#form_info").removeClass("hide");
				$("#form_info").html($("#selected_fields").clone().wrap("<div></div>"));
				selectDateAction();
			});
		}
		
		function selectDateAction(){
			$("#form_box").html($(doc).find("select-date-form").text());
			calendarDisplay.enableSingleDatePicker();
			calendarDisplay.setAction(function(rHarvestDate){
				harvestEntity.date = rHarvestDate;
				$("#form_box span").html("<br/>Selection:" + harvestEntity.date.dateString());
			});
			$("#done").click(function(){
				$("#form_info").append("<div><b>Date: </b>" + harvestEntity.date.dateString() + "</div>");
				enterAmountAction();
			});
		}

		
		function enterAmountAction(){
			$("#form_box").html($(doc).find("enter-amount-form").text());
		
			
			$("#done").click(function(){

				
				var amountPerAcre = parseFloat($("#form_box input[name=rate]").attr("value"));
				amount = amountPerAcre * totalAcres;
				harvestEntity.amountPerAcre = amountPerAcre;
				harvestEntity.total = amount;
				$("#form_info").append("<div><b>Entered Amount: </b>" + amount + " Bushels (" + amountPerAcre + "Bushels/Acre)</div>");
				$(".units").each(function(){
					$(this).text(harvestItem.units);
				});
				enterDescriptionAction();
				
			});
		}

		
		function enterDescriptionAction(){
			$("#form_box").html($(doc).find("enter-description-form").text());
			$("#done").click(function(){
				description = $("#form_box input").attr("value");
				harvestEntity.description = description;
				$("#form_info").append("<div><b>Description: </b>" + description);
				confirmAction();
			});
		}
		
		function confirmAction(){
			$("#form_box").html($(doc).find("confirm-form").text());
			$("#done").click(function(){
				harvestEntity.save(function(){
					
					var storageEntity = new StorageEntity();
					storageEntity.date = harvestEntity.date;
					storageEntity.source = "harvest";
					storageEntity.destination = "bins";
					storageEntity.crop = harvestEntity.crop;
					storageEntity.total = harvestEntity.total;
					storageEntity.farm = harvestEntity.farm;
					storageEntity.save(function(){
						currentManager.refresh(function(){
						currentManager = new HarvestManager();
						currentManager.run();
					});
			});
					
				});
			});
		}
		
}



var HarvestCache = function(pEmail, func){
	var doc;

	$.ajax({
		
		url: "/?action=getharvests&email=" + pEmail,
		type: 'GET',
		dataType: 'html',
		success: function(data){
			doc = textToDoc(data);

			func();
		}
	});
	
	this.harvests = [];
	
	
	this.getHarvests = function(){
		var rHarvests = [];
		try {
			$(doc).find("harvest").each(function(i){
				var harvest = docToItem(this);
				rHarvests.push(harvest);
			});
		}
		catch (e){}
		this.harvests = rHarvests;
		return rHarvests;
	}
	
	this.getCorn = function(){
		var total = 0;
		$(doc).find("harvest[crop=corn]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	this.getSoybean = function(){
		var total = 0;
		$(doc).find("harvest[crop=soybean]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	this.getWheat = function(){
		var total = 0;
		$(doc).find("harvest[crop=wheat]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	
	this.getAmount = function(farm, crop){
		var total = 0;
		$(doc).find("harvest[crop="+crop+"][farm="+farm+"]").each(function(){
			total += parseInt($(this).attr("total"));
		});
		return total;
	}
	
	
	this.isHarvested = function(field){
		
		try {

			return ($(doc).find("field[name=" + field.name + "]").length > 0);
		}
		catch (e){
			//alert(e);
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
		$(doc).find("harvest[product="+product+"]").find("field").each(function(){
			rFieldNames.push($(this).attr("name"));
		});
		return rFieldNames;
	}
	
	
	function docToItem(itemDoc){
		var item = new HarvestEntity();
		item.amountPerAcre = $(itemDoc).attr("amountPerAcre");
		item.total = $(itemDoc).attr("total");
		item.farm = $(itemDoc).attr("farm");
		item.description = $(itemDoc).attr("description");
		item.crop = $(itemDoc).attr("crop");
		return item;
	}

}





