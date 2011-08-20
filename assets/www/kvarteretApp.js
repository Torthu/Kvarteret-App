DAK = new Ext.Application({
	name: "Kvarteret",
	phoneStartupScreen: 'phone_startup.jpg',
	icon: 'logo.png',
	glossOnIcon: false,
	launch: function() {
		//document.addEventListener("backbutton", backKeyDown, true);
		
		DAK.DefaultToolbar = new Ext.Toolbar({
			title: "<img src=\"logo.png\" />",
			dock: 'top',
			items: [
				{xtype:'button', text:'refresh', handler: function (){ DAK.Viewport.setLoading(true); getEvents(); }},
				{xtype:'spacer'},
				{xtype:'button', text:'nuke', handler: function () {removeLocalData(); }}
			]
		});
		
		DAK.EventList = new Ext.List({
			id:'eventList',
			iconCls:'bookmarks',
			singleSelect:true,
			title:'Program',
			grouped: true,
			listeners: {
				render: function() { 
					loadLocalData(); 
					DAK.EventStore.each(removeOld); 
					if(DAK.EventStore.getCount() == 0) { getEvents(); } 
				},
				select: function() { 	
										DAK.SingleEvent.update(this.getSelectedRecords()[0].data);
										DAK.Viewport.setActiveItem('singleEvent', {type:'slide', direction:'left'});
										this.getSelectionModel().deselectAll();
									}
			},
			store:DAK.EventStore,
			itemTpl: '<div class="name"><em>{startTimeShort}</em> {title}</div><div class="meta">CC: {covercharge}</div>',

		});
		
		DAK.SingleEvent = new Ext.Panel ({
			id: 'singleEvent',
			scroll:'vertical',
			tpl: [
					'<div class="fullWrapper">',
					'	<div class="fullTitle">{title}</div>',
					'	<div class="meta">{startDateString} kl. {startTimeShort} - {endTimeShort}</div>',
					'	<div class="meta">CC: {covercharge}</div>',
					'	<div class="lead">{leadParagraph}</div>',
					'	<div class="descriptoion">{description}</div>',
					'</div>'
				],
			dockedItems: [
				{	
					xtype:'toolbar',
					title: "<img src=\"logo.png\" />",
					dock:'top',
					items: [ {xtype:'button', ui:'back',text:'back', handler: function() { back(); }} ],
				}
			],
			listeners: {
				swipe: {
					scope: this,
					element:'el',
					fn: function(field) {
						if(field.direction == 'right') {
							DAK.Viewport.setActiveItem('mainpanel', {type:'slide', direction:'right'});
						}
					}
				}
			}
		});
		
		DAK.Info = new Ext.Panel({
			id:		'info',
			iconCls:'info',
			html:	'<div class="fullWrapper"><div class="fullTitle">Det Akademiske Kvarter</div><div class="lead">Navnet er et ordspill på et «akademisk kvarter». Tradisjonelt er det navnet man i dannede kretser har satt på forsinkelser som man bør se gjennom fingrene med.</p>'+
					'<p>Det Akademiske Kvarter er studentenes kulturhus i Bergen. I 2007 startet en utbygging av huset som førte til en stillere periode i midlertidige lokaler. Nå åpner hovedhuset igjen med utvidet areal og utvidet tilbud.</p>'+
					'<p>Kvarteret rommer ca. 2200 arrangementer årlig og har nå etter utvidelsen plass til hele 1500 besøkende. Huset går over tre etasjer, har ni rom / scener og 14 skjenkepunkt. Før utbyggingen hadde huset ca 10 000 besøkende hver uke.</p>'+
					'<p>Kvarteret baserer seg på frivillig arbeid. Det trengs til enhver tid rundt 400 personer til å drive huset; stå i baren, være dørvakt, dekorere rom og mye annet. Huset utgjør et ungt og hektisk miljø, og er kanskje den enkleste og beste billetten inn til kjernen av studentverdenen. På Kvarteret er du garantert å få mange gode venner, jobbe med artige ting og få delta på arrangementer du sent vil glemme.</p>'+
					'<p>Denne våren kommer det til å florere med begreper som er nye for alle som ikke har vært på Kvarteret før. Ett av disse er Helhus. Kort fortalt er det et samarbeid mellom kulturarrangørene på Kvarteret og hver lørdag kommer de forskjellige rommene på Kvarteret til å fylles med en mengde arrangementer. Med en fast inngangspris på bare femtilappen vil man for eksempel kunne høre på Are Kalvø OG gå på fire konserter på en kveld!</p>'+
					'</div></div>',
			title: 'Om Kvarteret',
			scroll:'vertical'
		});

		DAK.MainPanel = new Ext.TabPanel ({
			id:'mainpanel',
			tabBar : { 
				layout : { 
					pack : 'center'
				},
				dock:'bottom'
			},
			items: [DAK.EventList, DAK.Info],
			dockedItems: [DAK.DefaultToolbar],
		});
		
		
		DAK.Viewport = new Ext.Panel ({
			fullscreen: true,
			layout:'card',
			cardSwitchAnimation: 'fade',
			items: [DAK.MainPanel, DAK.SingleEvent],
		});
		
	}
});