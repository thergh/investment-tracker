import {useEffect, useState} from 'react';
import './InvestmentList.css'


function InvestmentList({token, userId}){
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInvestments = async() => {
			try{
				const response = await fetch(
					"http://127.0.0.1:8000/investments/user/" + userId
					// "http://127.0.0.1:8000/investments/user/" + {userId}, 
					// {headers: {"Authorization": "Bearer" + token}}
				);

				if(!response.ok){
					throw new Error("Failed to fetch investments. (status " + response.status + ")");
				}

				const investmetsData = await response.json();
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
	}, [token, userId]);


	const handleRemove = async(investment_id) => {
		try{
			const response = await fetch(
				// "http://127.0.0.1:8000/investments/" + investment_id
				"http://127.0.0.1:8000/investments/" + investment_id, {
					method: "DELETE",
					headers: {"Authorization": "Bearer " + token}
				}
			);

			if(!response.ok){
				throw new Error("Failed to delete investment (status " + response.status + ")");
			}

			setInvestments(prev => prev.filter(inv => inv.id !== investment_id));
		}
		catch(err){
			console.error("Error deleting investment " + investment_id + ":", err);
			alert("Failed to remove investment.");
		}
	};


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
								<button
									onClick={() => handleRemove(inv.id)}
								>
									Remove
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);

}


export default InvestmentList