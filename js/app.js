// Market stats
let rate = 0;
let prevRate = 0;
let a = 0; // counter for stat updates at 1 min intervals

// User stats
let money = 100;
let items = 0;

// Chart data
// http://canvasjs.com/
let plotPoints = [];
let chart = new CanvasJS.Chart("line-graph", {
	title: {
		text: "Market Rate"
	},
	axisX:{
		title: "Time (sec)"
	},
	axisY:{
		title: "Rate (%)"
	},
	data: [{
		type: "line",
		xValueType: "dateTime",
		dataPoints: plotPoints
	}]
});


function init() {
	getRate();
	setInterval(getRate, 5000);
	
	chart.render();
	updateUserStats();
}


function getRate() {
	let request = new XMLHttpRequest();
	
	request.open('GET', 'http://api.queencityiron.com/trinkets');
	
	request.addEventListener('load', function() {
		
		// Display current rate
		let response = JSON.parse(request.responseText);
		rate = response.exchange;
		
		let rateDiv = document.querySelector('#rate');
		rateDiv.textContent = rate;
		
		// Update plot points on graph
		let point = {
			x: Date.now(),
			y: rate
		};
		plotPoints.push(point);
		if (plotPoints.length > 10) {
			plotPoints.shift();
		}
		chart.render();
		
		// Calculate change in rate every 60 sec
		if (a === 12) {
			let diff = rate - prevRate;
			
			let sign = '+';
			if (diff < 0) {
				let sign = '-';
			}
			let signDiv = document.querySelector('#sign');
			signDiv.textContent = sign;
			
			let trendDiv = document.querySelector('#trend');
			trendDiv.textContent = Math.abs(diff);
			
			prevRate = rate;
			
		} else if (a > 12) {
			a = 0;
		}
		a++;
	});
	
	request.send();
}


function updateUserStats() {
	let moneyDiv = document.querySelector('#balance');
	moneyDiv.textContent = money;
	
	let itemsDiv = document.querySelector('#items');
	itemsDiv.textContent = items;
}


function buyItem() {
	
}


function sellItem() {
	
}

window.addEventListener('load', init);