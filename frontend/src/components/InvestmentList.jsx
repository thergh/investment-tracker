import {useEffect, useState} from 'react';


function InvestmentList({token, userId}){
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInvestments = async() => {
			try{
				const investmentsResponse = await fetch(
					"http://127.0.0.1:8000/investments/user/" + userId
					// "http://127.0.0.1:8000/investments/user/" + {userId}, 
					// {headers: {"Authorization": "Bearer" + token}}
				);

				if(!investmentsResponse.ok){
					throw new Error("HTTP error: " + investmentsResponse.status);
				}

				const investmetsData = await investmentsResponse.json();
				setInvestments(investmetsData);
			}
			catch(err){
				console.error("Error fetching investments: " + err);
				setError("Could not load investments.");
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
			<h1>Loaded investments for user {userId}</h1>
			{investments.length === 0 ? (
				<p>No investments found.</p>
			): (
				<ul>
					{investments.map(inv => {
						const flatDifference = inv.purchase_price - inv.asset.stock.price;
						const percentDifference = 100 * flatDifference / inv.purchase_price;
						const value = inv.asset.stock.price * inv.quantity;

						return(
							<li key={inv.id}>
								<strong>{inv.asset.symbol} </strong>
								quantity: {inv.quantity}; 
								purchase price: {inv.purchase_price}; 
								current price: {inv.asset.stock.price}; 
								current value: {value}; 
								price difference: {flatDifference.toFixed(2)}; 
								price change: {percentDifference.toFixed(2)}%; 

							</li>
						);
					})}
				</ul>
			)}
		</div>
	);

}


export default InvestmentList