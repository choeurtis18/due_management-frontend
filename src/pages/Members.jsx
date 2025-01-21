import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await fetchAPI('members', {
          method: 'GET',
        });
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.firstName} {member.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
