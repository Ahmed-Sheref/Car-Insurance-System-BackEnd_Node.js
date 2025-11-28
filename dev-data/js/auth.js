document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('status');
      status.textContent = 'Logging in...';
      status.className = 'status';

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const auth = 'Basic ' + btoa(username + ':' + password);

      try {
        const res = await fetch('http://127.0.0.1:3000/api/v1/login', {
          method: 'POST',
          headers: { 'Authorization': auth }
        });

        const data = await res.json();

        if (data.status === 'success') {
          localStorage.setItem('authToken', data.data.token);
          status.textContent = 'Success! Redirecting...';
          status.className = 'status success';
          setTimeout(() => window.location.href = 'Policy.html', 1000);
        } else {
          status.textContent = data.data.message || 'Login failed';
          status.className = 'status error';
        }
        e.preventDefault();
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        status.textContent = 'Connection error: Is the server running on port 3000?';
        status.className = 'status error';
      }
    });

