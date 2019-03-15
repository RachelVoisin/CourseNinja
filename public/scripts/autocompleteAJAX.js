var url = "/autocomplete";

$(document).ready(function(){
	var data = {"school": document.getElementById("schoolInput").value, "search": "school"};

	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(result){ 
			autocomplete(document.getElementById("schoolInput"), result);
		},
		error:function (jXHR, textStatus, errorThrown){
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jXHR);
		},
		dataType: "JSON"
	});
});

$("#next").click(function(){
	var data = {"school": document.getElementById("schoolInput").value, "search": "program"};

	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(result){ 
			autocomplete(document.getElementById("programInput"), result);
			document.getElementById("schoolForm").style.left = "-800px";
			document.getElementById("programForm").style.right = "0";
		},
		error:function (jXHR, textStatus, errorThrown){
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jXHR);
		},
		dataType: "JSON"
	});
});



