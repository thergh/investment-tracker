import {useEffect, useState} from 'react';
import './LoginPage.css';
import API_URL from '../config';


function LoginPage({onLogin}){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginMessage, setLoginMessage] = useState('');


	const handleLogin = async (event) => {
		event.preventDefault();

		try{
			const body = new URLSearchParams();
			body.append('username', email);
			body.append('password', password);

			const loginResponse = await fetch(`${API_URL}/login`, {
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				body: body.toString()
			});

			const loginJson = await loginResponse.json();

			if(!loginResponse.ok){
				setLoginMessage(loginJson.detail || "Invalid credentials");
				return;
			}

			setLoginMessage('Login successful!');
			onLogin(loginJson.access_token, loginJson.user_id);
			
		}
		catch(error){
			console.error("Error when logging in: ", error);
			setLoginMessage("Connection error");
		}
	};


	return(
		<div className="login-page-container">
			<div className="login-box">
				<h1 className="login-title">Welcome</h1>
				<p className="login-subtitle">Please enter email and password to log in</p>
				<form onSubmit={handleLogin} className="login-form">
					<label className="login-label">EMAIL</label>
					<input
						className="login-input"
						type="email"
						value={email}
						onChange={event => setEmail(event.target.value)}
						required
						/>
					<label className="login-label">PASSWORD</label>
					<input
						className="login-input"
						type="password"
						value={password}
						onChange={event => setPassword(event.target.value)}
						required
					/>
					<button type="submit" className="login-button">Login</button>
					<button  className="register-button">Register</button>
				</form>
				{loginMessage && <p className="login-message">{loginMessage}</p>}
			</div>
		</div>
		);
}


export default LoginPage;