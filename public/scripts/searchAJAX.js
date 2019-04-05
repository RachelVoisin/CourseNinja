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
	var data = {
		country: $('#countryInput').val(),
		region: $('#regionInput').val(),
		city: $('#cityInput').val(),
		keywords: $('#keywordsInput').val(),
		offset: 0
	};
	if(this.id == "schoolBtn"){
		data.search = "school";
	} else if(this.id == "programBtn"){
		data.search = "program";
	}
	$('#output').html("");
	search(data);
});

$('body').on('click', '.loadMoreBtn', function(){
	var data = {
		country: $('#countryInput').val(),
		region: $('#regionInput').val(),
		city: $('#cityInput').val(),
		keywords: $('#keywordsInput').val(),
		offset: 1
	};
	if(this.id == "schoolLoad"){
		data.search = "school";
	} else if(this.id == "programLoad"){
		data.search = "program";
	}
	search(data);
});
	
function search(data){
	var url = "/search/searching";
	$('#loadmore').html("");
	
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(result){ 
			if(data.search == "school"){
				result.forEach(function(item){
					var output = "<div><h4>" + item.name + "</h4><p>" + item.city + ", " + item.region + "</p></div>";
					$('#output').append(output);
				});
				if(result.length === 10){
					var loadMore = '<button class="loadMoreBtn" id="schoolLoad">Load More</button>';
					$('#loadmore').html(loadMore);
				}
			} else if(data.search == "program"){
				result.forEach(function(item){
					var ref = "/reviews?school=" + item.school.replace(" ", "+") + "&program=" + item.name.replace(" ", "+");
					var output = "<a href='" + ref + "'><div><h4>" + item.name + " - " + item.code + "</h4><p>" + item.school + "</p></div></a>";
					$('#output').append(output);
				});
				if(result.length === 10){					
					var loadMore = '<button class="loadMoreBtn" id="programLoad">Load More</button>';
					$('#loadmore').html(loadMore);
				}
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
}

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

