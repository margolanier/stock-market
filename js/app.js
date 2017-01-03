/**************************
 * Variables
 **************************/

// Market stats
let rate = 0;
let ratesThisMin = [];

// User stats
let money = 100;
let items = 0;

// Transactions
let alert = document.querySelector('#alert');
let autobuy = false;
let autosell = false;
let auto = false; // set to true when auto-transaction is triggered

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
		dataPoints: plotPoints,
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
	
	
	// Auto transactions set by user
	let checkAutoBuy = document.querySelector('#autobuy');
	checkAutoBuy.addEventListener('change', function() {
		autobuy = (checkAutoBuy.checked === 'true');
	});
	
	let checkAutoSell = document.querySelector('#autosell');
	checkAutoSell.addEventListener('change', function() {
		autosell = (checkAutoSell.checked === 'true');
	});
}


/**************************
 * Update rates
 **************************/
function getRate() {
	let request = new XMLHttpRequest();
	
	request.open('GET', 'http://api.queencityiron.com/trinkets');
	
	request.addEventListener('load', function() {
		
		// Display current rate
		let response = JSON.parse(request.responseText);
		rate = response.exchange;
		
		let rateDiv = document.querySelector('#rate');
		rateDiv.textContent = rate.toFixed(2);
		
		// Update plot points on graph
		let point = {
			x: Date.now(),
			y: rate,
		};
		plotPoints.push(point);
		if (plotPoints.length > 10) {
			plotPoints.shift();
		}
		chart.render();
		
		
		// Calculate change in rate every 60 sec
		ratesThisMin.push(rate);
		if (ratesThisMin.length > 12) {
			let diff = ratesThisMin[11] - ratesThisMin[0];
			ratesThisMin.shift(0, 1);
			
			let sign = (diff < 0) ? '+' : '-';
			
			let signDiv = document.querySelector('#sign');
			signDiv.textContent = 'Trend: ' + sign;
			
			let trendDiv = document.querySelector('#trend');
			trendDiv.textContent = Math.abs(diff.toFixed(2)) + ' in the past minute';
			
		}
		
		
		
		// If autobuy is on, check rate against thresholds
		if (autobuy) {
			let threshold = parseInt(document.querySelector('#autoBuyPrice').value);
			
			if (threshold >= rate) {
				auto = true;
				buyItem();
			}
		}
		
		if (autosell) {
			let threshold = parseInt(document.querySelector('#autoSellPrice').value);
			
			if (threshold <= rate) {
				auto = true;
				sellItem();
			}
		}
		
	});
	
	request.send();
}


/**************************
 * Transactions
 **************************/
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
			trn_rate: transaction_rate.toFixed(2),
			trn_cost: cost.toFixed(2),
		}
	);
	
	list.appendChild(item);
}


function buyItem() {
	let amount = auto ? 1 : parseInt(document.querySelector('#buyAmount').value);
	
	let cost = rate * amount;
	
	// Check that user has enough money to buy
	if (cost <= money) {
		money -= cost;
		items += amount;
		let type = 'Purchase';
		
		updateUserStats();
		updateList(type, amount, rate, cost);
		alert.textContent = 'You bought ' + amount + ' share(s) for $' + cost.toFixed(2) + '.';
	} else {
		if (auto === 'false') {
			alert.textContent = 'You don\'t have enough money for this purchase.';
		}
	}
	auto = false;
}


function sellItem() {
	let amount = auto ? 1 : parseInt(document.querySelector('#sellAmount').value);
	
	let cost = rate * amount;
	
	// Check that user has enough items to sell
	if (amount <= items) {
		money += cost;
		items -= amount;
		let type = 'Sale';
		
		updateUserStats();
		updateList(type, amount, rate, cost);
		alert.textContent = 'You sold ' + amount + ' share(s) for $' + cost.toFixed(2) + '.';
	} else {
		if (auto === 'false') {
			alert.textContent = 'You don\'t have enough shares for this sale.';
		}
	}
	auto = false;
}


window.addEventListener('load', init);