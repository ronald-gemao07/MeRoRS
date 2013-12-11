<div class="row">
	<div id="date-picker" class="pull-left"></div><br>
	<div type="hidden" id="hover" class="left" style="background-color:#8dc640;border-color:#8dc640;color:#111111"></div>
	<div class="pull-right">
		<div id="calendar"></div>
	</div>
</div>
<div id="dialog" title="" style="display:none;">
	<div class="text-left">
    	<form id="test-form">
    		<div class="control-group">
                <input type="hidden" id="user" value="User123"/>
                <input type="hidden" id="email" value="User.123@globalzeal.net"/>
                <input type="hidden" id="start-time"/>
                <input type="hidden" id="end-time"/>
    			<label for="title" class="control-label">Title:</label>
    			<input name="text" name="title" id="title" value="" class="form-control">
    		</div>
    		<div class="control-group">
    			<label for="description" class="control-label">Description:</label>
    			<textarea id="description" name="purpose" class="form-control"> </textarea>
    		</div>
           <!--  <div class="control-group"><br>
              <select class="form-control">
                <option>One Time Reservation</option>
                <option>Daily Reservation</option>
                <option>Weekly Reservation</option>
              </select>
            </div> -->
    	</form>
    </div>	
</div>