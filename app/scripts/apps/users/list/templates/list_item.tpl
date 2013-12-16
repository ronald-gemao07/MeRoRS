<td><%= lastName %>, <%= firstName %></td>
<td><%= email %></td>
<td><%= position %></td>
<td><%= group %></td>
<td><%= status %></td>
<td>
  <!-- <a href='#users/<%= _id %>' class='btn btn-small js-show'>
    <i class='icon-eye-open'></i>
    Show
  </a> -->
  <a href='#users/<%= _id %>/edit' class='btn btn-small js-edit'>
    <i class='icon-pencil'></i>
      Edit
  </a>
  <button class='btn btn-small js-delete'>
    <i class='icon-remove'></i>
    Delete
  </button>
</td>