<form>
  <div class="control-group">
    <input id="room-name" name="roomName" type="hidden" value = "<%= roomName %>"/>
    <label for="reservation-title" class="control-label">Title : </label>
    <input id="reservation-title" name="reservationTitle" type="text"/>
  </div>
  <div class="control-group">
    <label for="reservation-purpose" class="control-label">Purpose : </label>
    <textarea id="reservation-purpose" name="reservationPurpose"></textarea>
  </div>
  <div class = "control-group">
    <label for = "reservation-options" class = "control-label">Reservation : </label>
    <select>
      <option>One-Time Reservation</option>
    </select>
  <div>
  <button class="btn js-submit">Save</button>
</form>