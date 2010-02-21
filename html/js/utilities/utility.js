
//UTILITIES
function sectionsContain(sections, north, west, number){


			var rCondition = false;
			for (var i = 0; i < sections.length; i++) {
				
				if (sections[i].north == north && sections[i].west == west && sections[i].number == number) {
					rCondition = true;
					break;
				}
			}

			return rCondition;


	}
	
	
function getFloat(value){
	if (value=="undefined" || value=="NaN" || value==""){
		value = 10;
	}
	return parseFloat(value);
}
function getInt(value){
	if (value=="undefined" || value=="NaN" || value==""){
		value = 10;
	}
	return parseInt(value);
}

function createRow(val1, val2, val3){
	return "<tr><td>"+val1+"</td><td>"+val2+"</td><td>"+val3+"</td></tr>";
}







function trunc(val){
	return (Math.round(val*100))/100;
}

function hasCrop(crop, fields){
	var rVal = false;

		$.each(fields, function(){
			if (this.crop == crop) {
				rVal = true;
			}
		});

	return rVal;
}


function truncate(val){
	return Math.floor(val*100)/100;
}


function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function handleCancel(){
	$("#form_info").empty();
	$("#form_box").empty();
	$("#form_info").addClass("hide");
	currentManager = new HomeManager();
	currentManager.run();
}

function startEdit(id){
			$("<input type='text'></input> <span id='save'><b>Save</b></span><span id='cancel_edit'><b>Cancel</b></span>").insertAfter("#"+id);
			$("#"+id).remove();
		}
		
function endEdit(id){
			$("<span id='"+id+"'><b>Edit</b></span>").insertAfter("#cancel_edit");
			$("#form_box input").remove();
			$("#save").remove();
			$("#cancel_edit").remove();
			startEditListener(id);
		}
		
function startEditListener(id){
			$("#"+id).click(function(){

				startEdit(id);
				$("#save").click(function(){
					selectedPlanting.edit(function(){
						endEdit(id);
					});
				});
				$("#cancel_edit").click(function(){
					endEdit(id);
				});
			});
		}		
//END UTLITIES



function getIndexAt(array, val){
	var rVal;
	$.each(array, function(i){
		if (this==val)
			rVal = i;
	});
	return rVal;
}
