var CalendarDisplay = function(pDivId){
	
	var divId;
	
	var displayedDates;
	var selectedMonth;
	var selectedYear;
	var selectedDay;
	
	var timelineWidth = $("#timeline_table").width();
	var timelineHeight = $("#timeline_table").height();
	var timelineCellWidth = timelineWidth/6;
	var timelineCellHeight = timelineHeight/2;
	var timelineLeft =  $("#timeline_table").position().left;
	var timelineTop =  $("#timeline_table").position().top;
	var calendarDoc;
	var monthDocs = [];

	var timelineDates = [];
	var calendarMonths = [];
	for (var i=0; i<11; i++){
		timelineDates[i] = [];
	}
	$.ajax({
				url: "calendar.xml",
				type: 'GET',
				dataType: 'html',
				success: function(data){
					calendarDoc = textToDoc(data);
					$("#month_name").text("January");
					$(calendarDoc).find("month").each(function(){
						var start = $(this).attr("start");
						var days = parseInt($(this).attr("days"));
						var month = $($(calendarDoc).find("template").text());
						var j = 1;
						for (var i=start; i<7; i++){
							$(month).find("tr:nth(0)").find("td:nth("+i+")").text(j).attr("id", "day"+j);
							j++;
						}
						for (var i=1; i<6; i++){
							for (var k=0; k<7; k++){
								if (j < days+1) {
									$(month).find("tr:nth(" + i + ")").find("td:nth(" + k + ")").text(j).attr("id", "day" + j);
									j++;
								}
							}
						}
						monthDocs.push(month);
					});
					$("#calendar_container").html($(monthDocs[0]));
					$("#timeline_table").find("tr").find("td").click(function(){
						var str = $(this).attr("id");
						var index = parseInt(str.substring(2));
						$("#calendar_container").html($(monthDocs[index]));
						$("#month_name").text($(calendarDoc).find("month[value="+index+"]").attr("name"));
					});
				}
				
	});
	
	function showPin(left, top, divid){

		var html = "<div class='timeline_pin' id='"+divid+"'><img src='images/push_pin_red.gif' /></div>";
		$("#page").append(html);
		
		
		$("#"+divid).css("left", left);
		$("#"+divid).css("top", top);
		
	}
	
	function addToTimeline(dates){
		
		$.each(dates, function(){
			if (this.month != "undefined"){
				timelineDates[this.month].push(this);
			}
		});
		var k =0;
		$.each(timelineDates, function(i){
	
			if (i < 6) {
				var absLeft = timelineLeft + i * timelineCellWidth;
				var pinOffset = timelineCellWidth / (this.length + 1);
				var totalPins = this.length;
				$.each(this, function(j){
					showPin(absLeft + j * pinOffset, timelineTop+timelineCellHeight/4, "pin_" + k);
					k++;
				});
			}
			else {
				var absLeft = timelineLeft + (i-5) * timelineCellWidth;
				var pinOffset = timelineCellWidth / (this.length + 1);
				var totalPins = this.length;
				$.each(this, function(j){
					showPin(absLeft + j * pinOffset, timelineTop+timelineCellHeight*5/4, "pin_" + k);
					k++;
				});
			}
			
		});
	}
	
	this.enableSelectDayListener = function(func){
		
	}
	this.disableSelectDayListener = function(func){
		
	}
	this.enableSelectMonthListener = function(func){
		
	}
	this.disableSelectMonthListener = function(func){
		
	}
	this.enableSelectScheduledDateListener = function(func){
		
	}
	this.disableSelectScheduledDateListener = function(func){
		
	}
	this.enableMoveDateListener = function(func){
		
	}
	this.disableMoveDateListener = function(func){
		
	}
	this.showPlantingDates = function(dates){
		
	}
	this.showFertilizationDates = function(dates){
		
	}
	this.showChemicalizationDates = function(dates){
		
	}
	this.showDates = function(dates){
		addToTimeline(dates);
	}
	this.showSalesDates = function(dates){
		
	}
	this.hideAllDates = function(){
		
	}
	
	
}
