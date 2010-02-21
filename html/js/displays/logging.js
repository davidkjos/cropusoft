var LoggingDisplay = function(){
	
		this.enableUserWait = function(logStr){
			$("#logging").text(logStr+".............");
		}
		this.disableUserWait = function(){
			$("#logging").text("Cropusoft!!!!!!");
		}
		this.handleError = function(logStr){
			$("#logging").text(logStr+" Failed!");
		}
	
}
