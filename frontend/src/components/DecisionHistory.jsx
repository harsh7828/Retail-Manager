export default function DecisionHistory() {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2">📜 Recent Decisions</h3>

            <ul className="text-sm space-y-2">
                <li>✔ Restock P-001 (High demand)</li>
                <li>✔ Discount P-004 (Low sales)</li>
                <li>✔ Hold P-002 (Stable trend)</li>
            </ul>
        </div>
    );
}