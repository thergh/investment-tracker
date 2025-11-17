import {PieChart, ResponsiveContainer, Pie, Cell, Tooltip, Legend} from "recharts";


function ValueChart({stocksValue, bondsValue, totalValue}){
	return(
		<div className="pieChartDiv">
			{totalValue > 0 ? (
				<ResponsiveContainer width="80%" height={300}>
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
							<Cell fill="#4caf50" />
							<Cell fill="#2196f3" />
						</Pie>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			) : (
				<p>Values are not available.</p>
			)}
		</div>
	);
}


export default ValueChart
