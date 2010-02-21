
function getCalendarIndex(val){
	var rVal;
	for (var i=0; i<12; i++){
		if (val==cal[i]){
			rVal = i;
			break;
		}
	}
	return rVal;
}

var DateEntity = function(){
	this.day;
	this.month;
	this.monthString = function(){
		return this.monthNames[this.month];
	}
	this.setMonthString = function(val){
		var rVal;
		for (var i=0; i<12; i++){
			if (val==cal[i]){
				rVal = i;
				break;
			}
		}
		this.month = rVal;
	}
	
	this.year;
	this.dateString = function(){
		return this.monthString()+" "+this.day+", "+this.year;
	}
	
	this.monthNames = [];
	this.monthNames.push("Jan");
	this.monthNames.push("Feb");
	this.monthNames.push("March");
	this.monthNames.push("April");
	this.monthNames.push("May");
	this.monthNames.push("June");
	this.monthNames.push("July");
	this.monthNames.push("August");
	this.monthNames.push("September");
	this.monthNames.push("October");
	this.monthNames.push("November");
	this.monthNames.push("December");
	
	//this is optional
	this.amount;
	this.percentage;
}

var gDateItem = new DateEntity();
cal = gDateItem.monthNames;

var CalendarDisplay = function(){

	var monthIndex;
	
	this.calendar = [];
	$.ajax({
		url: "calendar.xml",
		type: 'GET',
		dataType: 'html',
		success: function(data){
		
			data = textToDoc(data);
			for (var i = 0; i < 12; i++) {
				calendarDisplay.calendar.push($(data).find("month" + i).text());
			}
		}
	});
	$("#timeline_table td").click(function(ev){
		if (monthIndex == getCalendarIndex($(this).text())) {
			$("#calendar_calendar").addClass("hide");
			$(this).removeClass("yellow");
		}
		else {
			$("#calendar_calendar").removeClass("hide");
			monthIndex = getCalendarIndex($(this).text());
			$(this).addClass("yellow");
			$("#calendar_calendar").html(calendarDisplay.calendar[monthIndex]);
			calendarDisplay.calendarDayListener();
		}
		
	});
	this.func;
	var pegAdded = function(){
			return ($("#purchase_date_item").length>0);
	}
	
	this.calendarDayListener = function(){
		if (singleDatePicker || multipleDatePicker) {
			$(".calendar_table td").click(function(ev){
				var paymentDate = new DateEntity();
				
				paymentDate.day = $(this).text();
				paymentDate.setMonthString($("#month_name").text());
				paymentDate.year = "2009";
				paymentDate.x = ev.pageX - $("#calendar_calendar").position().left - 5;
				paymentDate.y = ev.pageY - $("#calendar_calendar").position().top - 15;
				
				var peg;
				var id_string = "";
				if (singleDatePicker){
					peg = "#purchase_date_item";
					id_string = "id='purchase_date_item'";
				}


				if (multipleDatePicker || !pegAdded()) {
					var peg = $("<div class='calendar_item' "+id_string+" ><img src='images/push_pin_red.gif' /></div>");
					$(peg).css("left", paymentDate.x + "px");
					$(peg).css("top", paymentDate.y + "px");
					$("#calendar_calendar").append(peg);
				}
				else {
					$("#purchase_date_item").css("left", paymentDate.x + "px");
					$("#purchase_date_item").css("top", paymentDate.y + "px");
				}
				
				
				calendarDisplay.action(paymentDate);
			});
		}
	}
	
	var singleDatePicker = false;
	this.enableSingleDatePicker = function(){
		singleDatePicker=true;
		this.calendarDayListener();
	}
	this.disableSingleDatePicker = function(){
		$(".calendar_table td").unbind("click");
		singleDatePicker=false;
	}
	
	
	var multipleDatePicker = false;
	this.enableMultipleDatePicker = function(){
		multipleDatePicker=true;
		this.calendarDayListener();
	}
	this.disableMultipleDatePicker = function(){
		$(".calendar_table td").unbind("click");
		multipleDatePicker=false;
	}
	
	
	
	
	
	
	
	this.action;
	this.setAction = function(pAction){
		this.action = pAction;
	}
	
}
	

