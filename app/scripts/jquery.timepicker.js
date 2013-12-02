/* jQuery timepicker
 * replaces a single text input with a set of pulldowns to select hour, minute, and am/pm
 *
 * Copyright (c) 2007 Jason Huck/Core Five Creative (http://www.corefive.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 1.0
 */

(function($){
	jQuery.fn.timepicker = function(){
		this.each(function(){
			// get the ID and value of the current element
			var i = this.id;
			var v = $(this).val();
			// the options we need to generate
			var hrs = new Array('08','09','10','11','12','01','02','03','04','05','06','07');
			var mins = new Array('00','15','30','45');
			var ap = new Array('am','pm');
			
			// default to the current time
			var d = new Date;
			var h = d.getHours();
			var m = d.getMinutes();
			var p = (h >= 1 ? 'pm' : 'am');
			
			// adjust hour to 12-hour format
			if(h > 12) h = h - 12;
				
			// round minutes to nearest quarter hour
			for(mn in mins){
				if(m <= parseInt(mins[mn])){
					m = parseInt(mins[mn]);
					break;
				}
			}
			
			// increment hour if we push minutes to next 00
			if(m > 45){
				m = 0;
				
				switch(h){
					case(11):
						h += 1;
						p = (p == 'am' ? 'pm' : 'am');
						break;
						
					case(12):
						h = 1;
						break;
						
					default:
						h += 1;
						break;
				}
			}

			// override with current values if applicable
			if(v.length == 7){
				h = parseInt(v.substr(0,2));
				m = parseInt(v.substr(3,2));
				p = v.substr(5);
			}
			
			// build the new DOM objects
			var output = '';
			var changeAp= 'am';
			output += '<select id="h_' + i + '" class="h timepicker">';				
			for(hr in hrs){
				if(hrs[hr] == 12){
					changeAp = 'pm';
				}
				if(hrs[hr]!=7){
					for(mn in mins){
						output += '<option value="'+ hrs[hr] + mins[mn] + '"';
						if(parseInt(mins[mn]) == m) output += ' selected';
						output += '>'+ hrs[hr] + ':' + mins[mn] + changeAp +'</option>';
					}
				}
				
			}
			output += '</select>';							
	
			// hide original input and append new replacement inputs
			$(this).attr('type','hidden').after(output);
		});
		return this;
	};
})(jQuery);



/* SVN: $Id: jquery.timepicker.js 456 2007-07-16 19:09:57Z Jason Huck $ */
