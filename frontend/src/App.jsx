import './App.css'
import {useEffect, useState} from 'react';


function App(){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('')
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(true);

	const handleLogin = async(event) => {
		event.preventDefault();

		try{
			const body = new URLSearchParams();
			body.append('username', email);
			body.append('password', password);

			const res = await fetch('http://127.0.0.1:8000/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				body: body.toString()
			});

			const data = await res.json();

			if(!res.ok){
				setMessage(data.detail || "Invalid credentials");
				return;
			}

			setToken(data.access_token);
			setMessage('Login successful!');

		}
		catch(error){
			console.error("Error when logging in: ", error);
			setMessage("Connection error");
		}
	};


	useEffect(() => {
		fetch("http://127.0.0.1:8000/")
		.then(res => res.json())
		.then(json => {
			setMessage(json.message);
			setLoading(false);
		})
		.catch(err => {
			console.error("Error fetching data", err);
			setLoading(false);
		})
	}, [token]);


	if(!token){
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
			{message && <p>{message}</p>}
		</div>
		);
	}


	if(loading) return <p>Loading...</p>;

	return(
	<div className="container">
		<h1>Successfuly connected to the API</h1>
		<p>Api message: {message}</p>
		<p>Your access token: {token}</p>
	</div>
	)
}

export default App
