Ext.regModel('Event', {
			 fields: [
				{name: 'title', type:'string'},
				{name: 'leadParagraph', type:'string'},
				{name: 'startDate', type: 'date', dateFormat: 'Y-m-d'},
				{name: 'startDateString', convert: function(value, record) {
						//alert('startDateString');
					  return record.get('startDate').toLocaleDateString();
					}
				},
				{name: 'startTime', type:'string'},
				{name: 'startTimeShort',
					convert: function(value, record) {
						//alert('startTimeShort');
					  return record.get('startTime').substring(0,5);
					}
				},
				{name: 'endDate', type: 'date', dateFormat: 'Y-m-d'},
				{name: 'endDateString', convert: function(value, record) {
					  return record.get('endDate').toLocaleDateString();
					}
				},
				{name: 'endTime', type:'string'},
				{name: 'endTimeShort',
					convert: function(value, record) {
					  return record.get('endTime').substring(0,5);
					}
				},
				{name: 'covercharge', type:'string'},
				
			]
});
DAK.EventStore = new Ext.data.Store ({
	model: 'Event',
	proxy: {
		type: "localstorage",
		id: "kvartereteventstorey",			
	},
	sorters: ['startDate', 'StartTime'],
	
	//hent ut første bokstav i prosjektnavn
	getGroupString: function(record) {
		return record.get('startDateString');
	},
	autoLoad:false
});

// DAK.EventStore.getCount(); // get number of elements in store