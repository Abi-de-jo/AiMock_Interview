import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-black text-white">
      <h1 className="text-xl font-bold text-blue-500">MockMate AI</h1>
      <nav className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/new">New Interview</Link>
        <button className="bg-blue-600 px-4 py-1 rounded">Logout</button>
      </nav>
    </header>
  );
}
