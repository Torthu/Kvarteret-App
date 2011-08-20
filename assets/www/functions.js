// check if phone has network connection
function checkNetwork(){ 
	try {
		if(navigator.network.connection.type) {
			var networkState = navigator.network.connection.type;
			//var networkState = "hey"; // TODO: enable (disabled for browser testing)
			
			if(networkState != 'none') {
				return true;
			}
			/*var states = {};
			states[Connection.UNKNOWN]  = 'Unknown connection';
			states[Connection.ETHERNET] = 'Ethernet connection';
			states[Connection.WIFI]     = 'WiFi connection';
			states[Connection.CELL_2G]  = 'Cell 2G connection';
			states[Connection.CELL_3G]  = 'Cell 3G connection';
			states[Connection.CELL_4G]  = 'Cell 4G connection';
			states[Connection.NONE]     = 'No network connection';*/
			else {
				alert("Ingen nettverkstilkobling");
				return false;
			}
		} else {
			// presumably client is not a phone
			return true;
		}
	} catch (ex) {
		// presumably client is not a phone
		console.log(ex);
		return true;
	}
}

function timeout() {
	Ext.util.JSONP.callback({'success':false, 'errormsg':'timeout', 'exceptionDetails':'Connection timed out, could not connect to server'});
}

function removeLocalData() {
	window.localStorage.removeItem("kvartereteventstore");
	window.localStorage.setItem("count", 0);
	loadLocalData();
}
function loadLocalData() {
	try {
		var data = window.localStorage.getItem("kvartereteventstore");
		if(data != null) {
			DAK.EventStore.loadData(JSON.parse(data));
		} else {
			DAK.EventStore.loadData('');
		}
	} catch (ex) {
		alert(ex);
	}
}

function getEvents() {
	var numberInStore = window.localStorage.getItem("count");

	//DAK.Viewport.setLoading(true);
	if (!checkNetwork()) {
		Ext.Msg.alert('Ingen nettilkobling', 'Du har ikke tilgang til internett.', function(){});
		return false;
	}
	var eventTimer = window.setTimeout("timeout()", 15000); // timeout
	Ext.util.JSONP.request({
		url: 'http://et.kvarteret.no/endre/kvarteret_events/web/api/json/filteredEvents',
		callbackKey: 'callback',
		reader: {
			type: 'json',
			root: 'data'
		},
		callback: function(data) {
			clearTimeout(eventTimer);
			
			if(data.count && data.count != 0) {
				if(data.count > numberInStore) {
					DAK.MainPanel.tabBar.getComponent(0).setBadge(data.count - numberInStore); // set new items count
				}
					
				window.localStorage.setItem("kvartereteventstore", JSON.stringify(data.data));
				window.localStorage.setItem("count", data.count);
				
				DAK.EventStore.loadData(JSON.parse(window.localStorage.getItem("kvartereteventstore")));
			} else if(data.count == 0) {
				Ext.Msg.alert('Fant ikke flere events', 'Kvarteret har ikke flere arrangementer i sin database', function(){});
			} else if(!data.success) {
				Ext.Msg.alert(data.errormsg, data.exceptionDetails, function(){});
			} else {
				Ext.Msg.alert('Unknown error', 'Datahenting feilet av ukjent grunn', function(){});
			}
			DAK.Viewport.setLoading(false);
		}
	});
}

var currentDate = new Date();
function removeOld() {
	var date = new Date(this.data.endDateString + ' ' + this.data.endTime);
	if(date < currentDate) {
		DAK.EventStore.remove(this);
	}
}

function backKeyDown() { 
	back();
}

function back() {
	var active = DAK.Viewport.getActiveItem().id;
	if(active=='mainpanel') {
		active = DAK.MainPanel.getActiveItem().id;
	}
	
	if(active == 'singleEvent') {
		DAK.Viewport.setActiveItem('mainpanel', {type:'slide', direction:'right'});
	} 
	else if(active == 'info') {
		DAK.MainPanel.setActiveItem('eventList', {type:'slide', direction:'right'});
	} 
	else if(active == 'eventList') {
		navigator.app.exitApp();
	}
}