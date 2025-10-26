import './App.css'
import LoginPage from './components/LoginPage.jsx';
import ContentPage from './components/ContentPage.jsx';
import {useEffect, useState} from 'react';


function App(){
	const [token, setToken] = useState('');
	const [user_id, setUserId] = useState('');

	if(!token){
		return <LoginPage onLogin={(token, user_id) => {
			setToken(token);
			setUserId(user_id);
		}}/>
	}

	return <ContentPage token={token} user_id={user_id} ></ContentPage>
}

export default App
