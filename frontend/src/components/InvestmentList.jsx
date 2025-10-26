import {useEffect, useState} from 'react';


function InvestmentList({token}){
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInvestments = async() => {
			try{
				const apiResponse = await fetch("http://127.0.0.1:8000/", {
					headers: {"Authorization": "Bearer" + token}
				});
				const jsonResponse = await apiResponse.json();
				setApiMessage(jsonResponse.message);
			}
			catch(err){
				console.error("")
			}
			finally{
				setLoading(false);
			}
		};

		fetchInvestments();
	}, [token]);


	if(loading){
		return(
			<p>Loading investments...</p>
		);
	}

	return(
		<div className="container">
			<h1>Loaded investments</h1>

		</div>
	);

}


export default InvestmentList