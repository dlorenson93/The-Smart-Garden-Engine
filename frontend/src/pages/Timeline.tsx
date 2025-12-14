import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { plantingsApi, tasksApi, photosApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import PillTabs from '../components/ui/PillTabs';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';

interface TimelineEvent {
  id: string;
  type: 'planting_created' | 'stage_change' | 'task_completed' | 'harvest_logged' | 'photo_added' | 'watering_adjusted' | 'health_changed';
  timestamp: Date;
  title: string;
  description: string;
  icon: string;
  color: string;
  linkTo?: string;
  metadata?: any;
}

export default function Timeline() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const [plantingsRes, tasksRes, photosRes] = await Promise.all([
        plantingsApi.getAll(),
        tasksApi.getAll('all'),
        photosApi.getAll(),
      ]);

      const timelineEvents: TimelineEvent[] = [];

      // Planting created events
      plantingsRes.data.forEach((planting: any) => {
        const displayName = planting.variety 
          ? `${planting.crop.name} (${planting.variety})`
          : planting.crop.name;
        
        timelineEvents.push({
          id: `planting-${planting.id}`,
          type: 'planting_created',
          timestamp: new Date(planting.createdAt || planting.plantingDate),
          title: `${displayName} planted`,
          description: `Started growing ${displayName} in ${planting.garden.name}`,
          icon: '🌱',
          color: '#10b981',
          linkTo: `/plantings/${planting.id}`,
          metadata: { planting }
        });

        // Calculate stage changes
        const stages = getPlantingStages(planting);
        stages.forEach(stage => {
          timelineEvents.push({
            id: `stage-${planting.id}-${stage.name}`,
            type: 'stage_change',
            timestamp: stage.date,
            title: `${displayName} → ${stage.name}`,
            description: `Growth stage: ${stage.name}`,
            icon: stage.icon,
            color: '#8b5cf6',
            linkTo: `/plantings/${planting.id}`,
            metadata: { stage: stage.name }
          });
        });

        // Harvest events
        if (planting.harvestLogs && planting.harvestLogs.length > 0) {
          planting.harvestLogs.forEach((harvest: any) => {
            timelineEvents.push({
              id: `harvest-${harvest.id}`,
              type: 'harvest_logged',
              timestamp: new Date(harvest.date),
              title: `Harvested ${displayName}`,
              description: `${harvest.amount} ${harvest.units}${harvest.surplusFlag ? ' (surplus available)' : ''}`,
              icon: '🍅',
              color: '#f59e0b',
              linkTo: `/plantings/${planting.id}`,
              metadata: { harvest }
            });
          });
        }
      });

      // Task completed events
      tasksRes.data.forEach((task: any) => {
        if (task.completed && task.completedAt) {
          timelineEvents.push({
            id: `task-${task.id}`,
            type: 'task_completed',
            timestamp: new Date(task.completedAt),
            title: task.title,
            description: `Completed for ${task.planting?.crop?.name || 'garden'}`,
            icon: '✅',
            color: '#3b82f6',
            linkTo: `/tasks`,
            metadata: { task }
          });
        }

        // Watering adjusted events
        if (task.skippedByWeather) {
          timelineEvents.push({
            id: `watering-${task.id}`,
            type: 'watering_adjusted',
            timestamp: new Date(task.updatedAt || task.dueDate),
            title: 'Smart watering adjustment',
            description: task.weatherReason || 'Watering skipped due to weather',
            icon: '💧',
            color: '#06b6d4',
            linkTo: `/tasks`,
            metadata: { task }
          });
        }
      });

      // Photo events
      photosRes.data.forEach((photo: any) => {
        timelineEvents.push({
          id: `photo-${photo.id}`,
          type: 'photo_added',
          timestamp: new Date(photo.createdAt),
          title: `Photo added: ${photo.type}`,
          description: photo.caption || `${photo.planting?.crop?.name || 'Garden'} photo`,
          icon: '📸',
          color: '#ec4899',
          linkTo: photo.plantingId ? `/plantings/${photo.plantingId}` : undefined,
          metadata: { photo }
        });
      });

      // Sort by timestamp (newest first)
      timelineEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setEvents(timelineEvents);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlantingStages = (planting: any) => {
    const plantingDate = new Date(planting.plantingDate);
    const harvestDate = new Date(planting.expectedHarvestStart);
    const totalDays = (harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24);

    const stages = [
      { name: 'Seedling', icon: '🌱', percentage: 25 },
      { name: 'Vegetative', icon: '🌿', percentage: 50 },
      { name: 'Flowering', icon: '🌸', percentage: 75 },
      { name: 'Fruiting', icon: '🍃', percentage: 90 },
    ];

    const now = new Date();
    return stages
      .map(stage => ({
        ...stage,
        date: new Date(plantingDate.getTime() + (totalDays * stage.percentage / 100) * 24 * 60 * 60 * 1000)
      }))
      .filter(stage => stage.date <= now && stage.date >= plantingDate);
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const groupEventsByDate = (events: TimelineEvent[]) => {
    const grouped: Record<string, TimelineEvent[]> = {};
    events.forEach(event => {
      const dateKey = event.timestamp.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(filteredEvents);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading timeline...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackButton to="/dashboard" label="Back to Dashboard" />
      <div style={{ position: 'relative' }}>
        {/* Subtle vineyard background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '350px',
          backgroundImage: 'url(/images/vineyard.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PageHeader
            title="📅 Garden Timeline"
            description="A complete history of your garden activities and milestones"
          />

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Filter Tabs */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <PillTabs
                tabs={[
                  { id: 'all', label: 'All Events', count: events.length },
                  { id: 'planting_created', label: 'Plantings', icon: '🌱' },
                  { id: 'stage_change', label: 'Growth Stages', icon: '🌿' },
                  { id: 'task_completed', label: 'Tasks', icon: '✅' },
                  { id: 'harvest_logged', label: 'Harvests', icon: '🍅' },
                  { id: 'photo_added', label: 'Photos', icon: '📸' }
                ]}
                activeTab={filter}
                onChange={setFilter}
              />
            </div>

            {/* Timeline */}
            {filteredEvents.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No timeline events yet"
                description="Your timeline will show plantings, tasks, harvests, photos, and watering adjustments as they happen in your garden."
                primaryAction={{
                  label: 'Go to Gardens',
                  onClick: () => navigate('/gardens')
                }}
                secondaryAction={{
                  label: 'Add Planting',
                  onClick: () => navigate('/gardens')
                }}
              />
            ) : (
              Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                padding: '0.5rem 0',
                zIndex: 10
              }}>
                {date}
              </h3>

              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }} />

                {dayEvents.map((event, index) => (
                  <div key={event.id} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-1.5rem',
                      top: '0.5rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: event.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      border: '3px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      {event.icon}
                    </div>

                    {/* Event card */}
                    <div className="card" style={{
                      border: `2px solid ${event.color}`,
                      transition: 'transform 0.2s',
                      cursor: event.linkTo ? 'pointer' : 'default'
                    }}
                    onClick={() => event.linkTo && (window.location.href = event.linkTo)}>
                      <div className="card-body" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                            {event.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {event.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                          {event.description}
                        </p>
                        {event.linkTo && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: event.color, fontWeight: 'bold' }}>
                              View details →
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
