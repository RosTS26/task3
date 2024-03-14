<!-- Modal add/update -->
<div class="modal fade" id="addUpdateModal" tabindex="-1" aria-labelledby="addUpdateModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <form class="modal-content update-or-create">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="addUpdateModalLabel"></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div>
            <p class="mb-2">First name</p>
            <input type="text" class="form-control mb-3" id="first-name-text" required>
            <p class="mb-2">Last name</p>
            <input type="text" class="form-control mb-3" id="last-name-text" required>
            <p class="mb-2">Status</p>
            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" role="switch" id="status-check">
            </div>
            <p class="mb-2">Role</p>
            <select class="form-select mb-3" aria-label="Default select example" id="select-status" required>
              <option value="" disabled selected>-Please select-</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary" id="submit-btn"></button>
      </div>
    </form>
  </div>
</div>

<!-- Modal delete -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Confirmation</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body delete-info"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" id="sent-delete">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal error operation -->
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="errorModalLabel">Error Operation</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body modal-info-error"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>