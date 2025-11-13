import {useEffect, useState} from 'react';
import './InvestmentList.css'


function InvestmentList({token, userId, refreshKey}){
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInvestments = async() => {
			try{
				const response = await fetch(
					"http://127.0.0.1:8000/investments/user/" + userId
				);

				if(!response.ok){
					throw new Error("HTTP error: " + response.status);
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
	}, [token, userId, refreshKey]);


	const handleRemove = async(investment_id) => {
		try{
			const response = await fetch(
				"http://127.0.0.1:8000/investments/" + investment_id, {
					method: "DELETE",
					headers: {"Authorization": "Bearer " + token}
				}
			);

			if(!response.ok){
				throw new Error("HTTP error:  " + response.status);
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
		<div className="investmentContainer">
			{investments.length === 0 ? (
				<p>No investments found.</p>
			): (
				<table className='investmentsTable'>
					<thead>
						<th>Purchase Date</th>
						<th>Name</th>
						<th>Volume</th>
						<th>Purchase Price</th>
						<th>Current Price</th>
						<th>Current Value</th>
						<th>Price Difference</th>
						<th>Price Increase</th>
						<th>Remove</th>
					</thead>
					<tbody>
						{investments.map(inv => {
							const flatDifference = inv.asset.stock.price - inv.purchase_price;
							const percentDifference = 100 * flatDifference / inv.purchase_price;
							const value = inv.asset.stock.price * inv.quantity;

							return(
								<tr key={inv.id}>
									<td>
										{new Date(inv.purchase_date).toLocaleString(
											"pl-PL", {
												year: "numeric",
												month: "2-digit",
												day: "2-digit",
												hour: "2-digit",
												minute: "2-digit"
											}
										)}
									</td>
									<td>{inv.asset.symbol}</td>
									<td>{inv.quantity.toFixed(2)}</td>
									<td>{inv.purchase_price.toFixed(2)}</td>
									<td>{inv.asset.stock.price.toFixed(2)}</td>
									<td>{value.toFixed(2)}</td>
									<td>{flatDifference.toFixed(2)}</td>
									<td>{percentDifference.toFixed(2)}%</td>
									<td><button onClick={() => handleRemove(inv.id)}>Remove</button></td>
								</tr>
							);
						})}
					</tbody>

				</table>
			)}
		</div>
	);

}


export default InvestmentList