import { useNavigate } from 'react-router-dom';
import DashboardCard from '../DashboardCard';
import { GardenIcon, ContainerIcon, GreenhouseIcon, MetricIcon } from '../../icons';
import '../../icons/icons.css';

interface GardensOverviewCardProps {
  totalGardens: number;
  totalBeds: number;
  totalPlantings: number;
}

export default function GardensOverviewCard({ 
  totalGardens, 
  totalBeds, 
  totalPlantings 
}: GardensOverviewCardProps) {
  const navigate = useNavigate();

  return (
    <DashboardCard
      title="Your Gardens"
      subtitle="Overview of your growing spaces"
      glass={true}
      onClick={() => navigate('/gardens')}
    >
      {/* Garden visual header */}
      <div 
        style={{
          width: '100%',
          height: '120px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}
        role="presentation"
        aria-hidden="true"
      >
        {/* Gradient overlay for better icon visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(139, 92, 246, 0.15))'
        }} />
        
        {/* Central garden icon */}
        <div style={{
          position: 'relative',
          zIndex: 1,
        }}>
          <GardenIcon size={64} style={{ color: '#22C55E' }} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <MetricIcon
            icon={<GardenIcon size={24} />}
            color="#10b981"
          />
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '0.25rem'
          }}>
            {totalGardens}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Gardens
          </div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <MetricIcon
            icon={<ContainerIcon size={24} />}
            color="#3b82f6"
          />
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '0.25rem'
          }}>
            {totalBeds}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Containers
          </div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <MetricIcon
            icon={<GreenhouseIcon size={24} />}
            color="#8b5cf6"
          />
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#8b5cf6',
            marginBottom: '0.25rem'
          }}>
            {totalPlantings}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Greenhouses
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        textAlign: 'center',
        color: '#10b981',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        Click to manage gardens →
      </div>
    </DashboardCard>
  );
}
