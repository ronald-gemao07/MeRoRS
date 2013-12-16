<form>
  <div class='control-group'>
    <label for='user-firstName' class='control-label'>First name:</label>
    <input id='user-firstName' name='firstName' type='text' value='<%= firstName %>'/>
  </div>
  <div class='control-group'>
    <label for='user-lastName' class='control-label'>Last name:</label>
    <input id='user-lastName' name='lastName' type='text' value='<%= lastName %>'/>
  </div>
  <div class='control-group'>
    <label for='user-email' class='control-label'>Email:</label>
    <input id='user-email' name='email' type='text' value='<%= email %>'/>
  </div>
  <div class='control-group'>
    <label for='user-position' class='control-label'>Position:</label>
    <input id='user-position' name='position' type='text' value='<%= position %>'/>
  </div>
  <div class='control-group'>
    <label for='user-group' class='control-label'>Group:</label>
    <select id='user-group' name='group'>
      <option value='User' <% if(group == 'User') { %>selected<% } %>>User</option>
      <option value='Administrator' <% if(group == 'Administrator') { %>selected<% } %>>Administrator</option>
    </select>
  </div>
  <div class='control-group'>
    <label for='user-status' class='control-label'>Status:</label>
    <select id='user-status' name='status'>
      <option value='Active' <% if(status == 'Active') { %>selected<% } %>>Active</option>
      <option value='Inactive' <% if(status == 'Inactive') { %>selected<% } %>>Inactive</option>
    </select>
  </div>
  <button class='btn js-submit pull-right'>Save</button>
</form>