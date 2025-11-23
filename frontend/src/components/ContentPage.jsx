import {useEffect, useState} from "react";
import InvestmentList from "./InvestmentList";
import Sidebar from "./Sidebar"
import AddInvestmentModal from "./AddInvestmentModal";
import ValueChart from "./ValueChart";
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


	const handleImportStocks = async(file) => {
		if(!file){
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try{
			const response = await fetch(
				"http://127.0.0.1:8000/investments/user/" + userId + "/import/xtb", {
					method: "POST",
					headers: {"Authorization": "Bearer " + token},
					body: formData
				}
			);

			if(!response.ok){
				throw new Error("HTTP error " + response.status);
			}

			const result = await response.json();
			alert("Imported " + result.count + " investments.");

			setRefreshKey(prev => prev + 1);

		}
		catch(err){
			console.error("Import error: ", err);
			alert("Failed to import file.");
		}
	};


	const handleImportBonds = async(file) => {
				if(!file){
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try{
			const response = await fetch(
				"http://127.0.0.1:8000/investments/user/" + userId + "/import/ipko", {
					method: "POST",
					headers: {"Authorization": "Bearer " + token},
					body: formData
				}
			);

			if(!response.ok){
				throw new Error("HTTP error " + response.status);
			}

			const result = await response.json();
			alert("Imported " + result.count + " investments.");

			setRefreshKey(prev => prev + 1);

		}
		catch(err){
			console.error("Import error: ", err);
			alert("Failed to import file.");
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
				onImportStocks={handleImportStocks}
				onImportBonds={handleImportBonds}
				onExportClick={handleExport}
				token={token}
				userId={userId}
			/>

			<div style={{marginLeft: "220px", padding: "20px", flexGrow: 1}}>
				<div className="dashboard">
					<ValueChart
						stocksValue={stocksValue}
						bondsValue={bondsValue}
						totalValue={totalValue}
					/>

					<div className="valuesDiv">
						<p><strong>Total value:</strong> ${totalValue.toFixed(2)}</p>
						<p><strong>Total profit:</strong> ${totalProfit.toFixed(2)}</p>
						<p><strong>Stocks value:</strong> ${stocksValue.toFixed(2)}</p>
						<p><strong>Stocks profit:</strong> ${stocksProfit.toFixed(2)}</p>
						<p><strong>Bonds value:</strong> ${bondsValue.toFixed(2)}</p>
						<p><strong>Bonds profit:</strong> ${bondsProfit.toFixed(2)}</p>
					</div>
				</div>
				<div className="restOfPage">
					<button className="actionButton" onClick={() => setShowAddModal(true)}>
						Add Investment
					</button>
					<button className="actionButton" onClick={handleRefreshData}>Refresh investment data</button>
					<button className="actionButton" onClick={handleRefreshValues}>Refresh portfolio values</button>
					
					<InvestmentList
						token={token}
						userId={userId}
						refreshKey={refreshKey}
					/>
				</div>
				
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