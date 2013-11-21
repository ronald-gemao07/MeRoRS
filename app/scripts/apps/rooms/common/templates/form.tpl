<form>
  <div class="control-group">
    <label for="room-roomName" class="control-label">First name:</label>
    <input id="room-roomName" name="roomName" type="text" value="<%= roomName %>"/>
  </div>
  <div class="control-group">
    <label for="room-lastName" class="control-label">Last name:</label>
    <input id="room-lastName" name="lastName" type="text" value="<%= lastName %>"/>
  </div>
  <div class="control-group">
    <label for="room-phoneNumber" class="control-label">Phone number:</label>
    <input id="room-phoneNumber" name="phoneNumber" type="text" value="<%= phoneNumber %>"/>
  </div>
  <button class="btn js-submit">Save</button>
</form>