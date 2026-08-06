const UserInfoItem = ({ icon, label, value, valueClassName = "" }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
      {icon}

      <div>
        <p className="text-sm text-gray-500">{label}</p>

        <p className={`font-medium ${valueClassName}`}>{value || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfoItem;
