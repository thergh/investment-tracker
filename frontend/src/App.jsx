import './App.css'
import LoginPage from './components/LoginPage.jsx';
import ContentPage from './components/ContentPage.jsx';
import {useState} from 'react';


function App(){
	const [token, setToken] = useState('');
	const [userId, setUserId] = useState('');

	if(!token){
		return <LoginPage onLogin={(token, userId) => {
			setToken(token);
			setUserId(userId);
		}}/>
	}

	return <ContentPage token={token} userId={userId} ></ContentPage>
}

export default App



