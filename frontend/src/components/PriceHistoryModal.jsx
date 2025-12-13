import {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import './PriceHistoryModal.css';
import API_URL from '../config';


function PriceHistoryModal({symbol, token, onClose}) {
	const [historyData, setHistoryData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchHistory = async () => {
			try{
				const response = await fetch(
					`${API_URL}/assets/stocks/${symbol}/history`, {
						headers: {"Authorization": "Bearer " + token}
					}
				);

				if(!response.ok){
					throw new Error("HTTP error: " + response.status);
				}

				const data = await response.json();
				const formattedData = data.map(item => ({
					...item,
					date: new Date(item.date).toLocaleDateString()
				}));
				
				setHistoryData(formattedData);
			}

			catch(err){
				console.error("Error fetching history:", err);
				setError("Could not load price history.");
			}
			finally{
				setLoading(false);
			}
		};

		if(symbol){
			fetchHistory();
		}
	}, [symbol, token]);

	return(
		<div className="modalOverlay" onClick={onClose}>
			<div className="modal chartModal" onClick={e => e.stopPropagation()}>
				<h2>Price History: {symbol}</h2>
				
				{loading && <p>Loading history...</p>}
				{error && <p className="error">{error}</p>}
				
				{!loading && !error && (
					<div className="chartContainer">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={historyData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#444" />
								<XAxis dataKey="date" stroke="#e0e0e0" />
								<YAxis stroke="#e0e0e0" domain={['auto', 'auto']} />
								<Tooltip 
									contentStyle={{backgroundColor: '#333', borderColor: '#444'}}
									itemStyle={{color: '#fff'}}
									formatter={(value) => `${value.toFixed(2)} USD`} 
								/>
								<Line 
									type="monotone" 
									dataKey="price" 
									stroke="#ffb70f" 
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}

				<div className="modalButtons">
					<button type="button" onClick={onClose}>Close</button>
				</div>
			</div>
		</div>
	);
}

export default PriceHistoryModal;
