// Market stats
let rate = 0;
let prevRate = 0;
let a = 0; // counter for stat updates at 1 min intervals

// User stats
let money = 100;
let items = 0;
let alert = document.querySelector('#alert');

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
		title: "Rate ($)"
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
	
	let buy = document.querySelector('#buy');
	buy.addEventListener('click', buyItem);
	
	let sell = document.querySelector('#sell');
	sell.addEventListener('click', sellItem);
}


function getRate() {
	let request = new XMLHttpRequest();
	
	request.open('GET', 'http://api.queencityiron.com/trinkets');
	
	request.addEventListener('load', function() {
		
		// Display current rate
		let response = JSON.parse(request.responseText);
		rate = response.exchange;
		
		let rateDiv = document.querySelector('#rate');
		rateDiv.textContent = Math.round(rate * 100)/100;
		
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
			signDiv.textContent = 'Trend: ' + sign;
			
			let trendDiv = document.querySelector('#trend');
			trendDiv.textContent = Math.abs(Math.round(diff * 100)/100) + ' in the past minute';
			
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
	moneyDiv.textContent = '$' + money.toFixed(2);
	
	let itemsDiv = document.querySelector('#items');
	itemsDiv.textContent = items;
}


function updateList(type, amount, transaction_rate, cost) {
	let list = document.querySelector('#transaction-list');
	
	let item = document.createElement('li');
	item.innerHTML = Mustache.render(
		document.querySelector('#list-template').innerHTML,
		{
			trn_type: type,
			trn_amount: amount,
			trn_rate: Math.round(transaction_rate *100)/100,
			trn_cost: cost
		}
	);
	
	list.appendChild(item);
}


function buyItem() {
	let input = document.querySelector('#sellAmount').value;
	let amount = parseInt(input);
	let cost = Math.round(rate * amount * 100)/100;
	
	// Check that user has enough money to buy
	if (cost <= money) {
		money -= cost;
		items += amount;
		let type = 'Purchase';
		
		updateUserStats();
		updateList(type, amount, rate, cost);
		alert.textContent = 'You bought ' + amount + ' share(s) for $' + cost + '.';
	} else {
		alert.textContent = 'You don\'t have enough money for this purchase.';
	}
	
}


function sellItem() {
	let input = document.querySelector('#sellAmount').value;
	let amount = parseInt(input);
	let cost = Math.round(rate * amount * 100)/100;
	console.log(cost);
	
	// Check that user has enough items to sell
	if (amount <= items) {
		money += cost;
		items -= amount;
		let type = 'Sale';
		
		updateUserStats();
		updateList(type, amount, rate, cost);
		alert.textContent = 'You sold ' + amount + ' share(s) for $' + cost + '.';
	} else {
		alert.textContent = 'You don\'t have enough shares for this sale.';
	}
}


window.addEventListener('load', init);