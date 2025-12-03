import React, {useRef, useState} from "react"
import './Sidebar.css'

function Sidebar({onLogout, onImportStocks, onImportBonds, userId}){

	const handleLogoutClick = () => {

	}

	const stocksInputRef = useRef(null);
	const bondsInputRef = useRef(null);
	const [importType, setImportType] = useState(null);

	const handleImportStocksClick = () => {
		setImportType("stocks");
		stocksInputRef.current.click();
	}

	const handleImportBondsClick = () => {
		setImportType("bonds");
		bondsInputRef.current.click();
	}

	const handleFileChange = (event) => {
		if(event.target.files.length > 0){
			const file = event.target.files[0];
			if(importType === "stocks") onImportStocks(file);
			else if(importType === "bonds") onImportBonds(file);
		}
	}

	
	const handleExportClick = () => {

	}


	return (
		<div className="sidebar">
			<div className="sidebar-header">
				<p className="user-info">User ID: {userId}</p>
			</div>
			<nav className="sidebar-nav">
				<button className="sidebar-button" onClick={handleImportStocksClick}>
					Import Stocks
				</button>
				<button className="sidebar-button" onClick={handleImportBondsClick}>
					Import Bonds
				</button>
				{/* <button className="sidebar-button" onClick={handleImportBondsClick}>
					Settings
				</button>
				<button className="sidebar-button" onClick={handleImportBondsClick}>
					Profile
				</button>
				<button className="sidebar-button" onClick={handleImportBondsClick}>
					Help
				</button> */}
			</nav>
			<div className="sidebar-footer">
				<button className="sidebar-button" onClick={handleLogoutClick}>Log Out</button>
			</div>

			<input
				type="file"
				accept=".xlsx"
				style={{display: "none"}}
				ref={stocksInputRef}
				onChange={handleFileChange}
			/>

			<input
				type="file"
				accept=".xls"
				style={{display: "none"}}
				ref={bondsInputRef}
				onChange={handleFileChange}
			/>
		</div>
	)
}

export default Sidebar;