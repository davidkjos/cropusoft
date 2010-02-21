//BUTTON DISPLAY



var ButtonDisplay = function(){
	
	var buttonItemHTML = "<img class='button_item' src='buttons/plant.png' />";
	
	var buttons = [];
	
	

	
	
	
	this.render = function(pButtons){
		$("#form_box").empty();
		$("#form_info").empty();
		$("#form_info").addClass("hide");
		buttons = pButtons;
		$("#form_box").empty();
		for (var i=0; i<buttons.length; i++){
			$("#form_box").append(buttonItemHTML);
		}
		$("#form_box").find(".button_item").each(function(){
			
			var index = $("#form_box").find(".button_item").index(this);
			$(this).attr("src", buttons[index].url);
			$(this).attr("id", buttons[index].url);
			$(this).click(function(){
				buttons[index].action();
			});
			
		});
		
		
	}
	
}
//END BUTON DISPLAY