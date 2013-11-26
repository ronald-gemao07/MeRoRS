<td><%= reservationName %></td>
<td><%= capacity %></td>
<td><%= reservationDescription%></td>
<td>
  <!--<a href="#reservations/<%= id %>" class="btn btn-small js-show">
  <i class="icon-eye-open"></i>
    Show
  </a> -->
  <!-- removed by nad -->
  <a href="#reservations/<%= id %>/edit" class="btn btn-small js-edit">
    <i class="icon-pencil"></i>
      Edit
  </a>
  <button class="btn btn-small js-delete">
    <i class="icon-remove"></i>
    Delete
  </button>
</td>
