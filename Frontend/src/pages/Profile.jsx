import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold">Profile</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;