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

$('#submit').click(function(event){
	var program = $('#programInput').val();
	if(program == 'undefined' | program == ""){
		event.preventDefault();
		$('#indexMessageBox').html("Please enter program or use advanced search");
		document.getElementById("programInput").style.borderColor = "red";
	} 
});

$("#next").click(function(){
	var school = $('#schoolInput').val();
	if(school == 'undefined' | school == ""){
		$('#indexMessageBox').html("Please enter school or use advanced search");
		document.getElementById("schoolInput").style.borderColor = "red";
	} else {
		var data = {"school": $('#schoolInput').val(), "search": "program"};

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
	}
});



