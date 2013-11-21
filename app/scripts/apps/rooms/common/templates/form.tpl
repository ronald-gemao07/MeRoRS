<form>
  <div class="control-group">
    <label for="room-name" class="control-label">Room name:</label>
    <input id="room-name" name="roomName" type="text" value="<%= roomName %>"/>
  </div>
  <div class="control-group">
    <label for="room-capacity" class="control-label">Capacity:</label>
    <input id="room-capacity" name="capacity" type="text" value="<%= capacity %>"/>
  </div>
  <div class="control-group">
    <label for="room-description" class="control-label">Description:</label>
    <textarea id="room-description" name="roomDescription"> <%= roomDescription %> </textarea>
  </div>
  <button class="btn js-submit">Save</button>
</form>
