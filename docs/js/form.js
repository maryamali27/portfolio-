// Contact form — sends via Web3Forms (works on localhost + live)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const btnText = document.getElementById('btnText');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  btnText.textContent = 'Sending…';
  submitBtn.disabled = true;
  formNote.textContent = '';
  formNote.className = 'form-note';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: '89b7f652-880b-4169-99b3-b75240b86207',
        name,
        email,
        subject: `Portfolio: ${subject}`,
        message,
        from_name: name,
      })
    });
    const result = await res.json();
    if (result.success) {
      btnText.textContent = 'Sent ✓';
      formNote.textContent = "Thanks! I'll get back to you soon.";
      formNote.className = 'form-note success';
      form.reset();
      setTimeout(() => {
        btnText.textContent = 'Send Message';
        formNote.textContent = '';
        formNote.className = 'form-note';
        submitBtn.disabled = false;
      }, 4000);
    } else {
      throw new Error('Submission failed');
    }
  } catch {
    btnText.textContent = 'Send Message';
    formNote.textContent = 'Could not send — email me directly: m3ryamali27@gmail.com';
    formNote.className = 'form-note error';
    submitBtn.disabled = false;
  }
});
