import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { tasksApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PillTabs from '../components/ui/PillTabs';
import EmptyState from '../components/ui/EmptyState';

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [scope, setScope] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Check for prefilled task from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('prefill');
    const desc = params.get('desc');
    
    if (prefill) {
      setShowQuickAdd(true);
      // Store prefill data for form (would need to be implemented in the form component)
      sessionStorage.setItem('taskPrefill', JSON.stringify({ title: prefill, description: desc }));
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [scope]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await tasksApi.getAll(scope);
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await tasksApi.incomplete(taskId);
      } else {
        await tasksApi.complete(taskId);
      }
      loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const getEmptyStateContent = () => {
    switch (scope) {
      case 'today':
        return {
          icon: '🎉',
          title: 'No tasks for today',
          description: 'All caught up! Want to add a task or get AI recommendations?',
          primaryAction: {
            label: 'Add Task',
            onClick: () => setShowQuickAdd(true)
          },
          secondaryAction: {
            label: 'Ask AI Assistant',
            onClick: () => navigate('/ai-assistant')
          }
        };
      case 'upcoming':
        return {
          icon: '📅',
          title: 'No upcoming tasks',
          description: 'You don\'t have any tasks scheduled for the future yet.',
          primaryAction: {
            label: 'Add Task',
            onClick: () => setShowQuickAdd(true)
          }
        };
      case 'completed':
        return {
          icon: '✓',
          title: 'No completed tasks',
          description: 'Complete some tasks and they\'ll appear here!',
          primaryAction: {
            label: 'View All Tasks',
            onClick: () => setScope('all')
          }
        };
      default:
        return {
          icon: '📝',
          title: 'No tasks yet',
          description: 'Start by creating tasks for your plantings to stay organized.',
          primaryAction: {
            label: 'Add First Task',
            onClick: () => setShowQuickAdd(true)
          },
          secondaryAction: {
            label: 'Go to Gardens',
            onClick: () => navigate('/gardens')
          }
        };
    }
  };

  const tabs = [
    { id: 'today', label: 'Today', icon: '📅', count: scope === 'today' ? tasks.length : undefined },
    { id: 'upcoming', label: 'Upcoming', icon: '⏰', count: scope === 'upcoming' ? tasks.length : undefined },
    { id: 'completed', label: 'Completed', icon: '✓', count: scope === 'completed' ? tasks.length : undefined },
    { id: 'all', label: 'All', icon: '📋', count: scope === 'all' ? tasks.length : undefined }
  ];

  return (
    <Layout>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <PageHeader
        title="Tasks"
        description="Manage and track your garden tasks and activities"
        actions={
          <Button
            variant="primary"
            leftIcon="+"
            onClick={() => setShowQuickAdd(true)}
          >
            Quick Add
          </Button>
        }
      />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <PillTabs
          tabs={tabs}
          activeTab={scope}
          onChange={(tabId) => setScope(tabId as any)}
        />
      </div>

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)' }}>
            Loading tasks...
          </div>
        </Card>
      ) : tasks.length === 0 ? (
        <EmptyState {...getEmptyStateContent()} />
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)'
        }}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              variant="default"
              style={{
                opacity: task.completed ? 0.7 : 1,
                transition: 'all var(--transition-base)'
              }}
            >
              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'flex-start'
              }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: 'var(--color-primary)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: 0,
                    marginBottom: 'var(--space-1)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--color-gray-500)' : 'var(--color-gray-900)'
                  }}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p style={{
                      margin: 0,
                      marginBottom: 'var(--space-2)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-gray-600)'
                    }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-600)'
                  }}>
                    <button
                      onClick={() => navigate(`/plantings/${task.planting.id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        fontWeight: 'var(--font-medium)',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      {task.planting.crop.name}
                    </button>
                    <span>•</span>
                    <span>{task.planting.bed.name}</span>
                    <span>•</span>
                    <span>{task.planting.garden.name}</span>
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 'var(--space-2)'
                }}>
                  <span style={{
                    padding: 'var(--space-1) var(--space-3)',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-semibold)'
                  }}>
                    {task.type}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                    {task.completed
                      ? `✓ ${new Date(task.completedAt).toLocaleDateString()}`
                      : `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
