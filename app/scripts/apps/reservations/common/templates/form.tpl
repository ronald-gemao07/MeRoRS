<form>
  <div class="control-group">
    <select class="roomName">
      <option value="room">room</option>
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
  <div class="control-group">
    <label for="start">Time Starts: </label>
    <select>
      <option id="start" value="8:00 AM"></option>
    </select>
  </div>

  <div class="demo-section">
    <label for="end">Time Ends: </label>
    <input class="timepicker" name="timepicker"/>
  </div>
  <button class="btn js-submit">Reserve</button>
</form>