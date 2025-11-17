import React, {useRef} from "react"
import './Sidebar.css'


function Sidebar({onLogout, onImportFile, onExportFile, token, userId}){

	const handleLogoutClick = () => {

	};


	const fileInputRef = useRef(null);

	const handleImportClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = (event) => {
		if(event.target.files.length > 0){
			onImportFile(event.target.files[0]);
		}
	};

	
	const handleExportClick = () => {

	};


	return (
		<div className="sidebar">
			{/* <p>Your access token: {token}</p> */}
			<p>Your user ID: {userId}</p>
			<button onClick={handleLogoutClick}>Log out</button>
			<button onClick={handleImportClick}>Import</button>
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