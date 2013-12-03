(function($){
	jQuery.fn.timepicker = function(inputclass){
		this.each(function(){
			var i = this.id;
			var v = $(this).val();
			var hrs = new Array('08','09','10','11','12','01','02','03','04','05','06','07');
			var mins = new Array('00','15','30','45');
			var output = '';
			var changeAp= 'am';
			output += '<select id="h_' + i + '" class="h timepicker" name="'+inputclass+'">';				
			for(hr in hrs){
				if(hrs[hr] == 12){
					changeAp = 'pm';
				}
				for(mn in mins){
					if(hrs[hr]==7 && mins[mn]==15){
						break;
					}
					if(inputclass=='endTime' && hrs[hr]==7 && mins[mn]==00){
						break;
					}
					if(inputclass=='endTime' && hrs[hr]==8 && mins[mn]==00){}
					else{
						output += '<option value="'+ hrs[hr] + ":" + mins[mn] + changeAp +'"';
						output += '>'+ hrs[hr] + ':' + mins[mn] + changeAp +'</option>';						
					}
				}
			}
			output += '</select>';							
			$(this).attr('type','hidden').after(output);
		});
		return this;
	};
})(jQuery);