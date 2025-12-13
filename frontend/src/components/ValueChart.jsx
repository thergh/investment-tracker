import {PieChart, ResponsiveContainer, Pie, Cell, Tooltip, Legend} from "recharts";
import "./ValueChart.css";


const COLORS = ['#ffb70fe1', '#cb2c05ff'];

function ValueChart({stocksValue, bondsValue, totalValue}){
	const data = [
		{name: "Stocks", value: stocksValue},
		{name: "Bonds", value: bondsValue}
	];

	return(
		<div className="pieChartDiv">
			{totalValue > 0 ? (
				<ResponsiveContainer width="100%" height="90%">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={50}
							outerRadius={80}
							paddingAngle={5}
							cornerRadius={4}
							label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip 
							formatter={(value) => `$${value.toFixed(2)}`}
							contentStyle={{backgroundColor: '#333', borderColor: '#444', borderRadius: '8px'}}
							itemStyle={{color: '#fff'}}
						/>
						<Legend wrapperStyle={{ color: '#e0e0e0' }} iconType="circle"/>
					</PieChart>
				</ResponsiveContainer>
			) : (
				<p>Values are not available.</p>
			)}
		</div>
	);
}


export default ValueChart
