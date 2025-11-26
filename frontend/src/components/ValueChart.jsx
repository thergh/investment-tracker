import {PieChart, ResponsiveContainer, Pie, Cell, Tooltip, Legend} from "recharts";
import "./ValueChart.css";


function ValueChart({stocksValue, bondsValue, totalValue}){
	return(
		<div className="pieChartDiv">
			{totalValue > 0 ? (
				<ResponsiveContainer width="100%" height="90%">
					<PieChart>
						<Pie
							data={[
								{name: "Stocks", value: stocksValue},
								{name: "Bonds", value: bondsValue}
							]}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={100}
						>
							<Cell fill="#ffb70fe1" />
							<Cell fill="#cb2c05ff" />
						</Pie>
						<Legend wrapperStyle={{ color: '#e0e0e0' }} />
					</PieChart>
				</ResponsiveContainer>
			) : (
				<p>Values are not available.</p>
			)}
		</div>
	);
}


export default ValueChart
