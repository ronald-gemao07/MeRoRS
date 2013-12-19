<form id="add-form" autocomplete="off">
    <div class="control-group">
        <input type="hidden" id="start-date" name="dateStart"/>
        <input type="hidden" id="end-date" name="dateEnd"/>
        <input type="hidden" id="start-time" name="timeStart"/>
        <input type="hidden" id="end-time" name="timeEnd"/>
        <input type="hidden" id="room-name" name="roomName"/>
        <input type="hidden" id="room-id" name="roomId"/>
        <label for="title" class="control-label">Title:</label>
        <input type="text" name="title" id="title" value="" class="form-control">
        <div hidden class="board-error-message">*Please enter title</div>
    </div>
    <div class="control-group">
        <label for="description" class="control-label">Description:</label>
        <textarea id="description" name="description" class="form-control"></textarea>
        <div hidden class="board-error-message">*Please enter description</div>
    </div>
   <!--  <div class="control-group"><br>
      <select class="form-control">
        <option>One Time Reservation</option>
        <option>Daily Reservation</option>
        <option>Weekly Reservation</option>
      </select>
    </div> -->
    <button class="btn btn-danger js-delete hide">Delete</button>
    <button class="btn btn-primary js-edit hide">Update</button>
    <button class="btn btn-primary js-submit hide">Create</button>
</form>