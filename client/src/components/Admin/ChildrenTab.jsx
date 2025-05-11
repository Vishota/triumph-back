import { useEffect, useState } from 'react';
import { getTeams } from '../../api/teams';
import ChildCard from '../Cards/ChildCard';

export default function ChildrenTab({ users, onDeleteChild }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data.map((team) => team.name));
      } catch (error) {
        console.error('Ошибка загрузки команд:', error);
      }
    };

    fetchTeams();
  }, []);

  const childrenWithParents = [];

  users.forEach(parent => {
    parent.children.forEach(child => {
      childrenWithParents.push({ child, parent });
    });
  });

  return (
    <div className="cards">
      {childrenWithParents.length > 0 ? (
        childrenWithParents.map((item, idx) => (
          <ChildCard
            key={idx}
            child={item.child}
            parent={item.parent}
            teams={teams}
            onDelete={onDeleteChild}
          />
        ))
      ) : (
        <p>Детей нет</p>
      )}
    </div>
  );
}
