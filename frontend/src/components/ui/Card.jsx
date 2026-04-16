export default function Card({ title, value, color }) {
    const colorMap = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <div className={`p-4 rounded-xl shadow ${colorMap[color]} hover:scale-105 transition`}>
            <h3 className="text-sm">{title}</h3>
            <p className="text-xl font-bold mt-1">{value}</p>
        </div>
    );
}