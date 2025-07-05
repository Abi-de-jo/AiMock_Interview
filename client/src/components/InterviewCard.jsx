import { format } from "date-fns";

export default function InterviewCard({ company, role, score, difficulty, user, startedAt }) {
  const formattedDate = startedAt ? format(new Date(startedAt), "dd MMM yyyy") : "—";
  const scoreColor =
    score >= 80 ? "text-green-400" :
    score >= 60 ? "text-yellow-400" :
    "text-red-400";

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-xl cursor-pointer">
      <div className="mb-3">
        <h3 className="text-xl font-bold text-blue-400">{company}</h3>
        <p className="text-sm text-gray-300">{role} • {difficulty}</p>
      </div>

      <div className="text-sm text-gray-400 space-y-1">
        <p><span className="text-white font-medium">Date:</span> {formattedDate}</p>
        {user?.name && (
          <p><span className="text-white font-medium">Candidate:</span> {user.name}</p>
        )}
      </div>

      <div className="mt-4 text-right">
        <span className={`text-lg font-semibold ${scoreColor}`}>
          {score !== undefined ? `${score}%` : "Pending"}
        </span>
      </div>
    </div>
  );
}
