import React, { useState } from 'react';
import '../style/login.css';

function Login({ onLogin }) {
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginName, password: loginPassword })
    })
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          setLoginError(msg);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          onLogin(data);
        }
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError('');
    fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        username: signupUsername,
        password: signupPassword
      })
    })
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          setSignupError(msg);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setShowSignup(false);
          setLoginName(data.username);
          setLoginPassword('');
          setSignupName('');
          setSignupEmail('');
          setSignupUsername('');
          setSignupPassword('');
        }
      });
  };

  return (
    <div className="login-page">
      {!showSignup ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login to ChatBOT</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginName}
            onChange={e => setLoginName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            required
          />
          {loginError && <div className="login-error">{loginError}</div>}
          <button type="submit">Login</button>
          <div className="login-switch">
            New user?{' '}
            <span className="login-link" onClick={() => { setShowSignup(true); setLoginError(''); }}>Sign up</span>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSignup}>
          <h2>Sign up for ChatBOT</h2>
          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={e => setSignupName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={e => setSignupUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            required
          />
          {signupError && <div className="login-error">{signupError}</div>}
          <button type="submit">Sign up</button>
          <div className="login-switch">
            Already have an account?{' '}
            <span className="login-link" onClick={() => { setShowSignup(false); setSignupError(''); }}>Login</span>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login; 