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

		let aCompare, bCompare;
		let aPrice, bPrice;

		if(a.asset.asset_type === "STOCK"){
			aPrice = a.asset.stock.price;
		}
		else if(a.asset.asset_type === "BOND"){
			aPrice = a.asset.bond.price;
		}
		else{
			return;
		}

		if(b.asset.asset_type === "STOCK"){
			bPrice = b.asset.stock.price;
		}
		else if(b.asset.asset_type === "BOND"){
			bPrice = b.asset.bond.price;
		}
		else{
			return;
		}

		let aValue = aPrice * a.quantity
		let bValue = bPrice * b.quantity
		let aflatValueDifference = (aValue - a.purchase_price * a.quantity);
		let bflatValueDifference = (bValue - b.purchase_price * b.quantity);
		let aPercentDifference = 100 * aPrice / a.purchase_price;
		let bPercentDifference = 100 * bPrice / b.purchase_price;

		switch(sortConfig.sortColumn){
			case "purchaseDate":
				aCompare = new Date(a.purchase_date);
				bCompare = new Date(b.purchase_date);
				break;
			case "symbol":
				aCompare = a.asset.symbol;
				bCompare = b.asset.symbol;
				break;
			case "volume":
				aCompare = a.quantity;
				bCompare = b.quantity;
				break;
			case "purchasePrice":
				aCompare = a.purchase_price;
				bCompare = b.purchase_price;
				break;
			case "currentPrice":
				aCompare = aPrice;
				bCompare = bPrice;
				break;
			case "currentValue":
				aCompare = aValue;
				bCompare = bValue;
				break;
			case "valueDifference":
				aCompare = aflatValueDifference;
				bCompare = bflatValueDifference;
				break;
			case "valueIncrease":
				aCompare = aPercentDifference;
				bCompare = bPercentDifference;
				break;
			default:
				return 0;
		}

		if(aCompare < bCompare){
			return sortConfig.direction === "asc" ? -1 : 1;
		}
		if(aCompare > bCompare){
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
								<th onClick={() => handleSort("currentPrice")}>Current Price</th>
								<th onClick={() => handleSort("currentValue")}>Current Value</th>
								<th onClick={() => handleSort("valueDifference")}>Value Difference</th>
								<th onClick={() => handleSort("valueIncrease")}>Value Increase</th>
								<th>Remove</th>
							</tr>
						</thead>
						<tbody>
							{sortedInvestments.map(inv => {
								let price, flatValueDifference, percentDifference, value;
							
								if(inv.asset.asset_type === "STOCK"){
									price = inv.asset.stock.price;
									flatValueDifference = (price - inv.purchase_price) * inv.quantity;
									percentDifference = 100 * (price - inv.purchase_price) / inv.purchase_price;
									value = price* inv.quantity;
								}
								else if(inv.asset.asset_type === "BOND"){
									price = inv.asset.bond.price;
									flatValueDifference = (price - inv.purchase_price) * inv.quantity;
									percentDifference = 100 * (price - inv.purchase_price) / inv.purchase_price;
									value = price* inv.quantity;
								}
							
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
										<td>{price.toFixed(2)}</td>
										<td>{value.toFixed(2)}</td>
										<td>{flatValueDifference.toFixed(2)}</td>
										<td>{percentDifference.toFixed(2)}%</td>
										<td><button className='actionButtonHot' onClick={() => handleRemove(inv.id)}>Remove</button></td>
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