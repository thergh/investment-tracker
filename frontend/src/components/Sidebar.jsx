import React from "react"
import './Sidebar.css'


function Sidebar({onLogoutClick, onImportClick, onExportClick, token, userId}){
	return (
		<div className="sidebar">
			{/* <p>Your access token: {token}</p> */}
			<p>Your user ID: {userId}</p>
			<button onClick={onLogoutClick}>Log out</button>
			<button onClick={onImportClick}>Import</button>
			<button onClick={onImportClick}>Export</button>
		</div>
	)
}

export default Sidebar;