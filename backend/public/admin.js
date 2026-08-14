// Minimal, CSP-safe confirmation for destructive actions.
// Any <form data-confirm="message"> asks before submitting.
document.addEventListener('submit', function (event) {
  var form = event.target;
  if (form && form.matches('[data-confirm]')) {
    var msg = form.getAttribute('data-confirm') || 'Are you sure?';
    if (!window.confirm(msg)) {
      event.preventDefault();
    }
  }
});
