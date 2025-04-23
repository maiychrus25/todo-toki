const ProgressCircle = ({ percentage, onClick }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div onClick={onClick} className="cursor-pointer relative w-10 h-10">
      <svg className="w-full h-full" viewBox="0 0 40 40">
        {/* Background circle (màu nền xám nhạt) */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-gray-200"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle (màu xanh) */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-green-500"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 20 20)" // Xoay -90° để bắt đầu từ trên cùng
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
        {percentage}%
      </span>
    </div>
  );
};

export default ProgressCircle;
