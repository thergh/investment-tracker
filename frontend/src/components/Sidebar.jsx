import React, {useRef, useState} from "react"
import './Sidebar.css'


function Sidebar({onLogout, onImportStocks, onImportBonds, onExportFile, token, userId}){

	const handleLogoutClick = () => {

	};


	const fileInputRef = useRef(null);
	const [importType, setImportType] = useState(null);

	const handleImportStocksClick = () => {
		setImportType("stocks");
		fileInputRef.current.click();
	};

	const handleImportBondsClick = () => {
		setImportType("bonds");
		fileInputRef.current.click();
	}

	const handleFileChange = (event) => {
		if(event.target.files.length > 0){
			const file = event.target.files[0];
			if(importType === "stocks") onImportStocks(file);
			else if(importType === "bonds") onImportBonds(file);
		}
	};

	
	const handleExportClick = () => {

	};


	return (
		<div className="sidebar">
			{/* <p>Your access token: {token}</p> */}
			<p>Your user ID: {userId}</p>
			<button onClick={handleLogoutClick}>Log out</button>
			<button onClick={handleImportStocksClick}>Import stocks</button>
			<button onClick={handleImportBondsClick}>Import bonds</button>
			
			<button onClick={handleExportClick}>Export</button>

			<input
				type="file"
				accept=".xlsx"
				style={{display: "none"}}
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
		</div>
	)
}

export default Sidebar;