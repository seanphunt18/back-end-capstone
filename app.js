var MOCK_ENTRIES = {

	"entries": [
		{
			"id": "111111",
			"charity-name": "UNICEF",
			"donation-amount": "$5",
			"donation-type": "clothing"
		},
		{
			"id": "222222",
			"charity-name": "UNICEF",
			"donation-amount": "$10",
			"donation-type": "food"
		},
		{
			"id": "333333",
			"charity-name": "UNICEF",
			"donation-amount": "$15",
			"donation-type": "service"
		},
		{
			"id": "444444",
			"charity-name": "UNICEF",
			"donation-amount": "$20",
			"donation-type": "infrastructure"
		},
		{
			"id": "555555",
			"charity-name": "UNICEF",
			"donation-amount": "$25",
			"donation-type": "education"
		},
		{
			"id": "666666",
			"charity-name": "UNICEF",
			"donation-amount": "$30",
			"donation-type": "medical"
		},
	]
};

function displayEntries(data) {
	for (index in data.entries) {
		$('.results').append(
			'<div class="result-container"><div class="result-price"><h1>' + data.entries[index].price + '</h1></div><div class="result-info"><h3>' + data.entries[index].charity-name + '</h3><p>Service provided: ' + data.entries[index].donation-type + '</p></div></div>'
		);
	}
}

