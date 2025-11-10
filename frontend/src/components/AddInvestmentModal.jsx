import {useState} from "react";
import "./AddInvestmentModal.css";


function AddInvestmentModal({token, userId, onClose, onInvestmentAdded}){

	const [formData, setFormData] = useState({
		asset_symbol: "",
		asset_type: "STOCK",
		quantity: "",
		purchase_price: "",
		purchase_date: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);


    // todo
	const handleChange = e => {
		const {name, value} = e.target;
		setFormData(prev => ({...prev, [name]: value}));
	};


	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try{
			const response = await fetch("http://127.0.0.1:8000/investments/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				},
				body: JSON.stringify(formData)
			});

			if(!response.ok){
				throw new Error("HTTP error: " + response.status);
			}

			const newInvestment = await response.json();
			onInvestmentAdded(newInvestment);
			onClose();
		}

		catch(err){
			setError("Failed to add investment: " + err.message);
		}

		finally{
			setLoading(false);
		}
	};

	return(
		<div className="modalOverlay">
			<div className="modal">
				<h2>Add Investment</h2>
				<form onSubmit={handleSubmit}>
					<label>Asset Symbol:</label>
					<input
						name="asset_symbol"
						value={formData.asset_symbol}
						onChange={handleChange}
						required 
					/>

					<label>Asset Type:</label>
					<select name="asset_type" value={formData.asset_type} onChange={handleChange}>
						<option value="STOCK">STOCK</option>
						<option value="BOND">BOND</option>
					</select>

					<label>Quantity:</label>
					<input
						type="number"
						name="quantity"
						value={formData.quantity}
						onChange={handleChange}
						required
					/>

					<label>Purchase Price:</label>
					<input
						type="number"
						step="0.01"
						name="purchase_price"
						value={formData.purchase_price}
						onChange={handleChange}
						required
					/>

					<label>Purchase Date:</label>
					<input
						type="date"
						name="purchase_date"
						value={formData.purchase_date}
						onChange={handleChange}
						required
					/>

					{error && <p className="error">{error}</p>}

					<div className="modalButtons">
						<button	type="submit" disabled={loading}>
							{loading ? "Adding..." : "Add"}
						</button>
						<button type="button" onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}


export default AddInvestmentModal;
