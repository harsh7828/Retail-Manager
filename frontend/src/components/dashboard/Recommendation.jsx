export default function Recommendation() {
    return (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold">🔥 AI Recommendation</h2>
            <p className="text-2xl font-bold mt-2">DISCOUNT 20%</p>

            <div className="mt-3">
                <p>Confidence: 82%</p>
                <div className="bg-white/30 h-2 rounded">
                    <div className="bg-white h-2 rounded w-[82%]"></div>
                </div>
            </div>

            <ul className="mt-3 text-sm">
                <li>• High inventory</li>
                <li>• Low demand</li>
                <li>• Product aging</li>
            </ul>
        </div>
    );
}