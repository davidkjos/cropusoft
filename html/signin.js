
function show(str){
			$("#" + str).css("display", "block");
	}
function hide(str){
	$("#" + str).css("display", "none");
}

function getCookie(val){
	var start = document.cookie.indexOf('email');
	var end=document.cookie.indexOf(";",start);
	if (end==-1) end=document.cookie.length;
	var str = document.cookie.substring(start,end);
	str = str.split("=")[1];
	return str;
}

function loadEvent(){
	var cookieEmail = getCookie('email');
	if (cookieEmail != null && cookieEmail != "none"){
			window.location = "cropusoft_2.htm";
	}
	else {
		init();
	}
}

function init(){
	
	
	
	$("#signup_link").click(function(){
		hide("signin_form");
		show("signup_form");
	});
	$("#signin_link").click(function(){
		show("signin_form");
		hide("signup_form");
	});
	$("#signin_confirm").click(function(){
		var email = $("#signin_form").find("input[name=email]").attr("value");
		var password = $("#signin_form").find("input[name=password]").attr("value");
		var autoLogin = $("#signin_form").find("input[name=autologin]").attr("checked");

		$.ajax({
			url: '/?action=getSignin&email='+email+'&password='+password+'&autologin='+autoLogin,
			type: 'GET',
			dataType: 'html',
			success: function(data){
				window.location = "cropusoft_2.htm?email="+email;
			},
			error: function(xhr){
				$("#signin_errors").text("Try, try again.");
			}
		});
	});
	
	$("#signup_confirmoff").click(function(){
		var email = $("#signup_form").find("input[name=email]").attr("value");
		var password = $("#signup_form").find("input[name=password]").attr("value");
		var passwordConfirm = $("#signup_form").find("input[name=password_confirm]").attr("value");
		var firstName = $("#signup_form").find("input[name=first_name]").attr("value");
		var lastName = $("#signup_form").find("input[name=last_name]").attr("value");
		var autoLogin = $("#signup_form").find("input[name=autologin]").attr("value");
		
		if (email==null || password==null || passwordConfirm==null || firstName == null || lastName == null ){
			$("#signin_errors").text("Please fill in all text boxes.");
		}
		else if (password != passwordConfirm){

			$("#signup_errors").text("Make the passwords the same please.");
		}
		else {

			$.ajax({
				url: '/',
				type: 'POST',
				data: {
					action: "saveUser",
					firstName: firstName,
					lastName:lastName,
					email: email,
					password: password,
					autoLogin: autoLogin
				},
				error: function(xhr){
					alert("failed");
				},
				success: function(){
	
					alert("success");
				}
			});
		}
	});
	
}
