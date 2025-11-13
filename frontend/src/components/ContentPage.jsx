import {useEffect, useState} from "react";
import InvestmentList from "./InvestmentList";
import Sidebar from "./Sidebar"
import AddInvestmentModal from "./AddInvestmentModal";
import {PieChart, ResponsiveContainer, Pie, Cell, Tooltip, Legend} from "recharts";
import './ContentPage.css'


function ContentPage({token, userId}){
	const [apiMessage, setApiMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [totalValue, setTotalValue] = useState(0);
	const [stocksValue, setStocksValue] = useState(0);
	const [bondsValue, setBondsValue] = useState(0);
	const [totalProfit, setTotalProfit] = useState(0);
	const [stocksProfit, setStocksProfit] = useState(0);
	const [bondsProfit, setBondsProfit] = useState(0);

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
					headers: {"Authorization": "Bearer " + token}
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


	const handleInvestmentAdded = () => {
		setRefreshKey(prev => prev + 1);
	};


	const handleRefreshData = async() => {
		console.log("Refreshed investment data.");

		try{
			const response = await fetch(
				"http://127.0.0.1:8000/investments/user/" + userId + "/update", {
					method: "POST",
					headers: {"Authorization": "Bearer " + token}
				}
			);

			if(!response.ok){
				throw new Error("HTTP error:  " + response.status);
			}

			setRefreshKey(prev => prev + 1);
		}
		catch(err){
			console.error("Error refreshing user " + userId + " investments:", err);
			alert("Failed to refresh investments.");
		}
	};


	const handleRefreshValues = async() => {
		console.log("Clicked to get portfolio values data.");

		try{
			const response = await fetch(
				"http://127.0.0.1:8000/investments/user/" + userId + "/portfolioValue", {
					headers: {"Authorization": "Bearer " + token}
				}
			);

			if(!response.ok){
				throw new Error("HTTP error:  " + response.status);
			}

			const data = await response.json();
			setTotalValue(data.value);
			setStocksValue(data.stocks_value);
			setBondsValue(data.bonds_value);
			setTotalProfit(data.total_profit);
			setStocksProfit(data.stocks_profit);
			setBondsProfit(data.bonds_profit);

		}
		catch(err){
			console.error("Error getting values for user " + userId + ": ", err);
			alert("Failed to get values.");
		}
	}

	
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
				token={token}
				userId={userId}
			/>
			<div style={{marginLeft: "220px", padding: "20px", flexGrow: 1}}>
				<div className="dashboard">
					<div className="pieChartDiv">
						{totalValue > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={[
											{name: "Stocks", value: stocksValue},
											{name: "Bonds", value: bondsValue}
										]}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={100}
										label={({name, value}) => `${name}: ${(value / totalValue * 100).toFixed(1)}%`}
									>
										<Cell fill="#4caf50" />
										<Cell fill="#2196f3" />
									</Pie>
									<Tooltip formatter={(val) => `$${val.toFixed(2)}`} />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<p>Values are not available.</p>
						)}
					</div>
					<div className="valuesDiv">
						<p><strong>Total value:</strong> ${totalValue.toFixed(2)}</p>
						<p><strong>Total profit:</strong> ${totalProfit.toFixed(2)}</p>
						<p><strong>Stocks value:</strong> ${stocksValue.toFixed(2)}</p>
						<p><strong>Stocks profit:</strong> ${stocksProfit.toFixed(2)}</p>
						<p><strong>Bonds value:</strong> ${bondsValue.toFixed(2)}</p>
						<p><strong>Bonds profit:</strong> ${bondsProfit.toFixed(2)}</p>
					</div>
				</div>

				<button onClick={() => setShowAddModal(true)}>
					Add Investment
				</button>
				<button onClick={handleRefreshData}>Refresh investment data</button>
				<button onClick={handleRefreshValues}>Refresh portfolio values</button>

				<InvestmentList
					token={token}
					userId={userId}
					refreshKey={refreshKey}
				/>
			</div>

			{showAddModal && (
				<AddInvestmentModal 
					token={token}
					userId={userId}
					onClose={() => setShowAddModal(false)}
					onInvestmentAdded={handleInvestmentAdded}
				/>
			)}
			
		</div>
		
	);
	
}


export default ContentPage