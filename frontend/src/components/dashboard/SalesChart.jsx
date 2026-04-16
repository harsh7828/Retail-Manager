import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function SalesChart({ data }) {
    return (
        <LineChart width={600} height={300} data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="actual" stroke="#000" />
            <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeDasharray="5 5" />
        </LineChart>
    );
}