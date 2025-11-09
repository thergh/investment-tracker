import React from "react"
import './Sidebar.css'


function Sidebar({onLogoutClick, onImportClick, onExportClick}){
    return (
        <div className="sidebar">
            <button onClick={onLogoutClick}>Log out</button>
            <button onClick={onImportClick}>Import</button>
            <button onClick={onImportClick}>Export</button>
        </div>
    )
}

export default Sidebar;