(function($){
	
	var initLayout = function() {
	
	
		$('#date').DatePicker({
			flat: true,
			date: '2008-07-31',
			current: '2008-07-31',
			calendars: 1,
			starts: 1,
			view: 'years'
		});
		
		var now3 = new Date();
		now3.addDays(-4);
		var now4 = new Date();
		$('#widgetCalendar').DatePicker({
			flat: true,
			format: 'd B, Y',
			date: [new Date(now3), new Date(now4)],
			calendars:1,
			mode: 'range',
			starts: 1,
			onChange: function(formated) {
				alert(formated);
				$('#widgetField #dateContainer').get(0).innerHTML = formated.join(' - ');
			}
		});
	 state = false;
		$('#widgetField #dateContainer').live('click', function(){
			$('#widgetCalendar').stop().animate({height: state ? 0 : $('#widgetCalendar div.datepicker').get(0).offsetHeight},1);
			state = !state;
			return false;
		});
		$('#widgetCalendar div.datepicker').css('position', 'absolute');
	};
	

	
	EYE.register(initLayout, 'init');
})(jQuery)