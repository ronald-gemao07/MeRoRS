<td><%= roomName %></td>
<td><%= capacity %></td>
<td>
  <!--<a href="#rooms/<%= id %>" class="btn btn-small js-show">
  <i class="icon-eye-open"></i>
    Show
  </a> -->
  <!-- removed by nad -->
  <a href="#rooms/<%= id %>/edit" class="btn btn-small js-edit">
    <i class="icon-pencil"></i>
      Edit
  </a>
  <button class="btn btn-small js-delete">
    <i class="icon-remove"></i>
    Delete
  </button>
</td>
