<form>
  <div class="control-group">
    <label for="reservation-name" class="control-label">Reservation name:</label>
    <input id="reservation-name" name="reservationName" type="text" value="<%= reservationName %>"/>
  </div>
  <div class="control-group">
    <label for="reservation-capacity" class="control-label">Capacity:</label>
    <input id="reservation-capacity" name="capacity" type="text" value="<%= capacity %>"/>
  </div>
  <div class="control-group">
    <label for="reservation-description" class="control-label">Description:</label>
    <textarea id="reservation-description" name="reservationDescription"> <%= reservationDescription %> </textarea>
  </div>
  <button class="btn js-submit">Save</button>
</form>
