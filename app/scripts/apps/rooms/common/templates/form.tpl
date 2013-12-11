<form>
  <div class="control-group">
    <label for="room-name" class="control-label">Room name:</label>
    <input id="room-name" name="room" type="text" value="<%= room %>"/>
    <div hidden class="room-error-message">*Please enter Room Name</div>
  </div>
  <div class="control-group">
    <label for="room-capacity" class="control-label">Capacity:</label>
    <input id="room-capacity" name="capacity" type="text" value="<%= capacity %>"/>
    <div hidden class="capacity-error-message">*Please enter number for Capacity</div>
  </div>
  <div class="control-group">
    <label for="room-description" class="control-label">Description:</label>
    <textarea id="room-description" name="description"><%= description %></textarea>
    <div hidden class="description-error-message">*Please enter Description</div>
  </div>
  <button class="btn js-submit">Save</button>
</form>