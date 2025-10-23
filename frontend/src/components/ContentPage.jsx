import {useEffect, useState} from 'react';


function ContentPage({token}){
	const [apiMessage, setApiMessage] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async() => {
			try{
				const api_response = await fetch("http://127.0.0.1:8000/", {
					headers: {'Authorization': "Bearer " + token}
				});
				const json_response = await api_response.json();
				setApiMessage(json_response.message);
			}
			catch(err){
				console.error("Error fetching data:", err);
				setApiMessage("Error fetching API data");
			}
			finally{
				setLoading(false);
			}
		};
		fetchData();
	}, [token]);

	if(loading) return <p>Loading...</p>;

	return(
	<div className="container">
		<h1>Successfuly connected to the API</h1>
		<p>Api message: {apiMessage}</p>
		<p>Your access token: {token}</p>
	</div>
	)
	
}


export default ContentPage