import {useEffect, useState} from "react";
import InvestmentList from "./InvestmentList";
import Sidebar from "./Sidebar"
import AddInvestmentModal from "./AddInvestmentModal";
import ValueChart from "./ValueChart";
import './ContentPage.css'


function ContentPage({token, userId}){
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

		handleRefreshValues();
	
		fetchData();
	}, [token]);


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

		handleRefreshValues();
	};


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

		handleRefreshValues();
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

		handleRefreshValues();
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

			<div className="contentDiv">
				<div className="dashboard">
					<ValueChart
						stocksValue={stocksValue}
						bondsValue={bondsValue}
						totalValue={totalValue}
					/>

					<div className="values-section">
						<div className="portfolio-summary">
							<div className="summary-item total-value">
								<span className="label">Portfolio Value</span>
								<span className="value">
									${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
								<div className="profit-loss">
									<span className={totalProfit >= 0 ? 'profit' : 'loss'}>
										${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
									<span className={totalProfit >= 0 ? 'profit' : 'loss'}>
										({totalValue > 0 ? ((totalProfit / totalValue) * 100).toFixed(2) : '0.00'}%)
									</span>
								</div>
							</div>
							<div className="sub-summary">
								<div className="summary-item">
									<span className="label">Stocks</span>
									<span className="value">
										${stocksValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
									<div className="profit-loss">
										<span className={stocksProfit >= 0 ? 'profit' : 'loss'}>
											${stocksProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</span>
										<span className={stocksProfit >= 0 ? 'profit' : 'loss'}>
											({stocksValue > 0 ? ((stocksProfit / stocksValue) * 100).toFixed(2) : '0.00'}%)
										</span>
									</div>
								</div>
								<div className="summary-item">
									<span className="label">Bonds</span>
									<span className="value">
										${bondsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
									<div className="profit-loss">
										<span className={bondsProfit >= 0 ? 'profit' : 'loss'}>
											${bondsProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</span>
										<span className={bondsProfit >= 0 ? 'profit' : 'loss'}>
											({bondsValue > 0 ? ((bondsProfit / bondsValue) * 100).toFixed(2) : '0.00'}%)
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="actionsDiv">
						<button className="actionButtonHot" onClick={() => setShowAddModal(true)}>
							Add Investment
						</button>
						<button className="actionButtonHot" onClick={handleRefreshData}>Refresh Data</button>
						<button className="actionButtonHot" onClick={handleRefreshValues}>Refresh Values</button>
					</div>
					
				</div>
				<div className="restOfPage">
					<InvestmentList
						token={token}
						userId={userId}
						refreshKey={refreshKey}
						onInvestmentRemoved={handleRefreshValues}
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