<td><%= room %> </td>
<td><%= title %></td>
<td><%= description %></td>
<td><%= date %>, <%= startTime %> - <%= endTime %></td>
<td>
  <a href='#reservations/<%= _id %>/edit' class='btn btn-small js-edit'>
    <i class='icon-pencil'></i>
      Edit
  </a>
  <button class='btn btn-small js-delete'>
    <i class='icon-remove'></i>
    Delete
  </button>
</td>