const Analytics = ({ users, campaigns, donations }) => {
  return (
    <div>
      <h3 className="text-xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded">
          <h4>Total Campaigns</h4>
          <p>{campaigns.length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded">
          <h4>Total Donations</h4>
          <p>{donations.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
