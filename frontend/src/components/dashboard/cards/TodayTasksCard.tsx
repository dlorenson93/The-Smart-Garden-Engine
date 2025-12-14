import { Link } from 'react-router-dom';
import DashboardCard from '../DashboardCard';

interface TodayTasksCardProps {
  tasks: any[];
  onCompleteTask: (taskId: string) => void;
}

export default function TodayTasksCard({ tasks, onCompleteTask }: TodayTasksCardProps) {
  return (
    <DashboardCard
      title="Today's Tasks"
      subtitle={tasks.length === 0 ? 'Nothing on the agenda!' : `${tasks.length} task${tasks.length > 1 ? 's' : ''}`}
      glass={true}
    >
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            No tasks for today!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/tasks">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Add Task
              </button>
            </Link>
            <Link to="/ai-assistant">
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Ask AI
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: task.completed ? 'rgba(243, 244, 246, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onCompleteTask(task.id)}
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    cursor: 'pointer',
                    accentColor: '#10b981'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#9ca3af' : '#1f2937'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {task.planting?.crop?.name} • {task.planting?.bed?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/tasks" style={{ display: 'block' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#10b981',
              border: '2px solid #10b981',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              View All Tasks
            </button>
          </Link>
        </>
      )}
    </DashboardCard>
  );
}
