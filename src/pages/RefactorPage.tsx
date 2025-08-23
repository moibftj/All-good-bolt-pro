import React from 'react';
import { RefactorTool } from '../components/refactor/RefactorTool';

export const RefactorPage: React.FC = () => {
  const sampleCode = `import React, { useState, useEffect } from 'react';

function UserProfile({ userId, onUpdate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/users/\${id}\`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedData) => {
    onUpdate(updatedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => handleUpdate(user)}>Update Profile</button>
    </div>
  );
}

export default UserProfile;`;

  return (
    <div className="min-h-screen bg-gray-50">
      <RefactorTool 
        initialCode={sampleCode}
        componentName="UserProfile"
      />
    </div>
  );
};