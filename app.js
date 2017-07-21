var MOCK_ENTRIES = {

	"entries": [
		{
			"id": "111111",
			"charity": "UNICEF",
			"amount": "$5",
			"type": "clothing",
			"url": "http://google.com"
		},
		{
			"id": "222222",
			"charity": "UNICEF",
			"amount": "$10",
			"type": "food",
			"url": "#"
		},
		{
			"id": "333333",
			"charity": "UNICEF",
			"amount": "$15",
			"type": "service",
			"url": "#"
		},
		{
			"id": "444444",
			"charity": "UNICEF",
			"amount": "$20",
			"type": "infrastructure",
			"url": "#"
		},
		{
			"id": "555555",
			"charity": "UNICEF",
			"amount": "$25",
			"type": "education",
			"url": "#"
		},
		{
			"id": "666666",
			"charity": "UNICEF",
			"amount": "$30",
			"type": "medical",
			"url": "#"
		},
	]
};

function getDisplayEntries(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_ENTRIES)}, 100);
}

var filterAmount;

function displayEntries(data) {
	for (index in data.entries) {
		if (data.entries[index].amount === filterAmount) {
			$('.results').append(
				'<div class="result-container"><div class="result-price"><h1>' + data.entries[index].amount + '</h1></div><div class="result-info"><h3>' + data.entries[index].charity + '</h3><p>Service provided: ' + data.entries[index].type + '</p><div class="donate"><a href="' + data.entries[index].url + '" target="_blank">Donate</a></div></div></div>'
			);
		} 
	}

	if ($('.results').html() === '<div class="results"></div>') {
		$('.results').append('<h3 style="text-align: center; color: white;>No results</h3>'); 
	}
};

function watchFilter() {
	$('.filter-box').on("click", function(e) {
		e.preventDefault();
		$('.results').empty();
		filterAmount = $(this).text();
		getDisplayEntries(displayEntries);
	});
}

$(function(){watchFilter();});
