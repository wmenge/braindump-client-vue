const UnsavedChangesConfirmationResult = Object.freeze({
  DISCARD: 'DISCARD',
  CANCEL: 'CANCEL',
  SAVE: 'SAVE'
});

const confirmationModalComponent = {
    methods: {
        cancel() {
            outsideResolve(UnsavedChangesConfirmationResult.CANCEL);
        },
        discard() {
            outsideResolve(UnsavedChangesConfirmationResult.DISCARD);
        },
        save() {
          outsideResolve(UnsavedChangesConfirmationResult.SAVE);
      }
    },
    template: `
<div class="modal fade" id="confirmationUnsavedChangesModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <span id="confirmationUnsavedChangesBody"></span>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancel">Cancel</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="discard">Discard Changes</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="save">Save Changes</button>
      </div>
    </div>
  </div>
</div>`
};

var outsideResolve;
var outsideReject;

function confirm(message) {
  $("#confirmationUnsavedChangesBody").html(message);
  $("#confirmationUnsavedChangesModal").modal("show");

  let promise = new Promise((resolve, reject) => {
    outsideResolve = resolve;
    outsideReject = reject;
  });

  return promise;
}

export { confirm, confirmationModalComponent, UnsavedChangesConfirmationResult };