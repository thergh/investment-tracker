import {useEffect, useState} from 'react';


function LoginPage({onLogin}){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginMessage, setLoginMessage] = useState('');


	const handleLogin = async(event) => {
		event.preventDefault();

		try{
			const body = new URLSearchParams();
			body.append('username', email);
			body.append('password', password);

			const loginResponse = await fetch('http://127.0.0.1:8000/login', {
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
		<div className="container">
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={event => setEmail(event.target.value)}
					/><br/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={event => setPassword(event.target.value)}
				/><br/>
				<button type="submit">Login</button>
			</form>
			{loginMessage && <p>{loginMessage}</p>}
		</div>
		);
}


export default LoginPage;