export default function Alerts() {
    return (
        <div className="bg-yellow-100 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2">⚠ Live Alerts</h3>

            <ul className="text-sm">
                <li>🔥 Demand spike detected</li>
                <li>📉 Inventory running low</li>
                <li>🎉 Festival demand expected</li>
            </ul>
        </div>
    );
}