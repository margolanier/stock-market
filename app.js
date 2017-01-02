let rate = 0;

function init() {
	getRate();
	setInterval(getRate, 10000);
	
}


function getRate() {
	let request = new XMLHttpRequest();
	
	request.open('GET', 'http://api.queencityiron.com/trinkets');
	
	request.addEventListener('load', function() {
		let response = JSON.parse(request.responseText);
		rate = response.exchange;
		
		//console.log(rate);
	});
	
	request.send();
}

window.addEventListener('load', init);