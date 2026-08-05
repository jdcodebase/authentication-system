import {
  FaUserCircle,
  FaEnvelope,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

import UserInfoItem from "./UserInfoItem";

const ProfileCard = ({ user }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <FaUserCircle className="mb-4 text-8xl text-indigo-600" />

        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>

        <p className="mt-1 text-gray-500">Authenticated User</p>
      </div>

      <div className="mt-8 space-y-5">
        <UserInfoItem
          icon={<FaEnvelope className="text-xl text-indigo-600" />}
          label="Email"
          value={user?.email}
        />

        <UserInfoItem
          icon={<FaCheckCircle className="text-xl text-green-500" />}
          label="Status"
          value="Authenticated"
          valueClassName="text-green-600"
        />

        <UserInfoItem
          icon={<FaCalendarAlt className="text-xl text-indigo-600" />}
          label="Joined On"
          value={user?.createdAt.split("T")[0]}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
