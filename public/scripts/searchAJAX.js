$(document).ready(function(){
	var data = {"search": "countries"};
	var element = document.getElementById("countryInput");
	fillSelect(data, element);
});

$('#countryInput').on('change', function(){
	$('#regionInput').html("<option>--</option>");
	$('#cityInput').html("<option>--</option>");
	var data = {"search": "regions", "country": this.value};
	var element = document.getElementById("regionInput");
	fillSelect(data, element);
});

$('#regionInput').on('change', function(){
	$('#cityInput').html("<option>--</option>");
	var data = {"search": "cities", "region": this.value};
	var element = document.getElementById("cityInput");
	fillSelect(data, element);
});

$('.searchBtn').on('click', function(){
	var url = "/search/searching";
	var data = {
		country: $('#countryInput').val(),
		region: $('#regionInput').val(),
		city: $('#cityInput').val(),
		keywords: $('#keywordsInput').val()
	};
	if(this.id == "schoolBtn"){
		data.search = "school";
	} else if(this.id == "programBtn"){
		data.search = "program";
	}
	//$('#output').append(data.country + " " + data.region + " " + data.city + " " + data.keywords + " " + data.search);
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(result){ 
			if(data.search == "school"){
				result.forEach(function(item){
					$('#output').append(item.name + "<br>");
					// this should be better
				});

			} else if(data.search == "program"){
				result.forEach(function(item){
					$('#output').append(item.name + "<br>");
					// this should be better
				});
			}
			if(!result.length){
				$('#output').append("No Results");
			}
		},
		error:function (jXHR, textStatus, errorThrown){
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jXHR);
		},
		dataType: "JSON"
	});
});

function fillSelect(data, element){
	var url = "/search/autocomplete";
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(result){ 
			result.forEach(function(item){
				element.innerHTML += "<option value='" + item + "'>" + item + "</option>";
			});
		},
		error:function (jXHR, textStatus, errorThrown){
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jXHR);
		},
		dataType: "JSON"
	});
}

