<form>
  <div class="control-group">
    <select class="roomName" name = "room">
      <option value="room">room</option>
      <option value="room1">room1</option>
    </select>
  </div>
  <div class="control-group">
    <label for="reservation-description" class="control-label">Title:</label>
    <input id="reservation-description" name="title" type="text" value="<%= description %>"/>
  </div>
  <div class="control-group">
    <label for="reservation-purpose" class="control-label">Description: </label>
    <input id="reservation-purpose" name="description" type="text" value="<%= description %>"/>
  </div>
  <div class="control-group">
    <select class="reservation">
      <option>One-Time Reservation</option>
      <option>Daily Reservation</option>
    </select>
  </div>
  <label for="start">Time Starts: </label>
  <input class="start"/>
  <label for="end">Time Ends: </label>
  <input class="end"/><br>
  <button class="btn js-submit">Reserve</button>
</form>