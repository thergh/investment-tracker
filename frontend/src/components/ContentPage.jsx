import {useEffect, useState} from 'react';
import InvestmentList from './InvestmentList';
import Sidebar from './Sidebar'


function ContentPage({token, userId}){
	const [apiMessage, setApiMessage] = useState('');
	const [loading, setLoading] = useState(true);

	const handleLogout = () => {
		console.log("Login clicked");
	}

	const handleImport = () => {
		console.log("Import clicked");
	}

	const handleExport = () => {
		console.log("Export clicked");
	}

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
		<div>
			<Sidebar 
				onLogoutClick={handleLogout}
				onImportClick={handleImport}
				onExportClick={handleExport}
			/>
			<div style={{marginLeft: "220px", padding: "20px", flexGrow: 1}}>
				<h1>Successfuly connected to the API</h1>
				<p>Api message: {apiMessage}</p>
				<p>Your access token: {token}</p>
				<p>Your user ID: {userId}</p>
				<InvestmentList token={token} userId={userId}/>
			</div>
			
		</div>
		
	);
	
}


export default ContentPage