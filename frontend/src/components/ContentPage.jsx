import {useEffect, useState} from 'react';
import InvestmentList from './InvestmentList';


function ContentPage({token, userId}){
	const [apiMessage, setApiMessage] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async() => {
			try{
				const apiResponse = await fetch("http://127.0.0.1:8000/", {
					headers: {'Authorization': "Bearer " + token}
				});
				const jsonResponse = await apiResponse.json();
				setApiMessage(jsonResponse.message);
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

	
	if(loading){
		return(
			<p>Loading API message...</p>
		)
	}

	return(
		<div className="container">
			<h1>Successfuly connected to the API</h1>
			<p>Api message: {apiMessage}</p>
			<p>Your access token: {token}</p>
			<p>Your user ID: {userId}</p>
			<InvestmentList token={token} userId={userId}/>
		</div>
	);
	
}


export default ContentPage