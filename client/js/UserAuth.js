// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userid = document.getElementById('userid').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, username, email, password })
      });

      const msg = document.getElementById('msg');
      msg.textContent = await res.text();
      msg.style.color = res.ok ? 'green' : 'red';
    } catch (err) {
      console.error(err);
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const msg = document.getElementById('msg');
      msg.textContent = await res.text();
      msg.style.color = res.ok ? 'green' : 'red';
    } catch (err) {
      console.error(err);
    }
  });
}
