import './App.css'
import LoginPage from './components/LoginPage.jsx';
import ContentPage from './components/ContentPage.jsx';
import {useEffect, useState} from 'react';


function App(){
	const [token, setToken] = useState('')

	if(!token){
		return <LoginPage onLogin={setToken}></LoginPage>
	}

	return <ContentPage token={token}></ContentPage>
}

export default App
