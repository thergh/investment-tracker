import './App.css'
import {useEffect, useState} from 'react';

function App(){
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(true);

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
	}, []);

	if(loading) return <p>Loading...</p>;

	return(
	<div className="container">
		<h1>{message}</h1>
	</div>
	)
}

export default App
