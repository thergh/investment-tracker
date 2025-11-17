import {useEffect, useState} from 'react';
import './InvestmentList.css'


function InvestmentList({token, userId, refreshKey}){
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState({sortColumn: "purchaseDate", direction: "asc"});

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


	const handleSort = (sortColumn) => {
		let direction = "asc";
		if(sortConfig.sortColumn === sortColumn && sortConfig.direction === "asc"){
			direction = "desc";
		}
		setSortConfig({sortColumn, direction})
	}


	const sortedInvestments = [...investments].sort((a, b) => {
		if(!sortConfig.sortColumn){
			return 0;
		}

		let aValue, bValue;
		// let flatDifference = inv.asset.stock.price - inv.purchase_price;
		// let percentDifference = 100 * flatDifference / inv.purchase_price;
		// let value = inv.asset.stock.price * inv.quantity;

		// if
		// const flatDifference = inv.asset.stock.price - inv.purchase_price;
		// const percentDifference = 100 * flatDifference / inv.purchase_price;
		// const value = inv.asset.stock.price * inv.quantity;

		switch(sortConfig.sortColumn){
			case "purchaseDate":
				aValue = new Date(a.purchase_date);
				bValue = new Date(b.purchase_date);
				break;
			case "symbol":
				aValue = a.asset.symbol;
				bValue = b.asset.symbol;
				break;
			case "volume":
				aValue = a.quantity;
				bValue = b.quantity;
				break;
			case "purchasePrice":
				aValue = a.purchase_price;
				bValue = b.purchase_price;
				break;
			// TODO
			// case "currentPrice":

			// 	aValue = a.asset;
			// 	bValue = ;
			// 	break;
			// case "currentValue":
			// 	aValue = ;
			// 	bValue = ;
			// 	break;
			// case "priceDifference":
			// 	aValue = ;
			// 	bValue = ;
			// 	break;
			// case "priceIncrease":
			// 	aValue = ;
			// 	bValue = ;
			// 	break;
			default:
				return 0;
		}

		if(aValue < bValue){
			return sortConfig.direction === "asc" ? -1 : 1;
		}
		if(aValue > bValue){
			return sortConfig.direction === "asc" ? 1 : -1;
		}
		else{
			return 0;
		}

	});


	if(loading){
		return(
			<p>Loading investments...</p>
		);
	}

	return(
		<div className="investmentContainer">
			{sortedInvestments.length === 0 ? (
				<p>No investments found.</p>
			): (
				<div className='tableWrapper'>
					<table className="investmentsTable">
						<thead>
							<tr>
								<th onClick={() => handleSort("purchaseDate")}>Purchase Date</th>
								<th onClick={() => handleSort("symbol")}>Symbol</th>
								<th onClick={() => handleSort("volume")}>Volume</th>
								<th onClick={() => handleSort("purchasePrice")}>Purchase Price</th>
								<th>Current Price</th>
								<th>Current Value</th>
								<th>Price Difference</th>
								<th>Price Increase</th>
								<th>Remove</th>
							</tr>
						</thead>
						<tbody>
							{sortedInvestments.map(inv => {
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
										<td><button className='actionButton' onClick={() => handleRemove(inv.id)}>Remove</button></td>
									</tr>
								);
							})}
						</tbody>

					</table>
				</div>
			)}
		</div>
	);

}


export default InvestmentList