import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gardensApi } from '../../lib/api';
import AskTerraAICard from './cards/AskTerraAICard';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function GardenTab() {
  const { id } = useParams<{ id: string }>();
  const [garden, setGarden] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGarden();
  }, [id]);

  const loadGarden = async () => {
    try {
      const response = await gardensApi.get(id!);
      setGarden(response.data);
    } catch (error) {
      console.error('Error loading garden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading garden overview...</div>;
  }

  if (!garden) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Garden not found</div>;
  }

  // Calculate stats
  const bedCount = garden.beds?.length || 0;
  const plantings = garden.plantings || [];
  const activePlantings = plantings.filter((p: any) => p.status === 'growing').length;
  const stressedPlantings = plantings.filter((p: any) => p.healthStatus === 'stressed' || p.healthStatus === 'critical').length;
  const harvestSoonCount = plantings.filter((p: any) => {
    if (!p.harvestAt) return false;
    const daysUntilHarvest = Math.ceil((new Date(p.harvestAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilHarvest <= 7 && daysUntilHarvest >= 0;
  }).length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-6)'
    }}>
      {/* Your Gardens Card */}
      <Card title="🏡 Your Gardens" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            {garden.name}
          </div>
          {garden.description && (
            <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              {garden.description}
            </div>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)'
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>
              {bedCount}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Containers</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)' }}>
              {activePlantings}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Active Greenhouses</div>
          </div>
        </div>

        {garden.zip && (
          <div style={{ 
            padding: 'var(--space-3)', 
            backgroundColor: 'var(--color-bg-muted)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)'
          }}>
            <strong>Location:</strong> {garden.zip}
            {garden.usdaZone && ` • Zone ${garden.usdaZone}`}
            {garden.frostDateSpring && ` • Last Frost: ${new Date(garden.frostDateSpring).toLocaleDateString()}`}
          </div>
        )}

        <Button variant="outline" size="md" fullWidth onClick={() => window.location.href = `/gardens/${id}`}>
          Manage Containers & Details →
        </Button>
      </Card>

      {/* Garden Health Card */}
      <Card title="🌱 Garden Health" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
            Overall garden health status and alerts
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {stressedPlantings > 0 ? (
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-warning-light)',
              borderLeft: '4px solid var(--color-warning)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
                ⚠️ {stressedPlantings} Plant{stressedPlantings !== 1 ? 's' : ''} Need Attention
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Check for watering, pests, or nutrient issues
              </div>
            </div>
          ) : (
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-success-light)',
              borderLeft: '4px solid var(--color-success)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                ✅ All Plants Healthy
              </div>
            </div>
          )}

          {harvestSoonCount > 0 && (
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-primary-light)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
                🎉 {harvestSoonCount} Crop{harvestSoonCount !== 1 ? 's' : ''} Ready Soon
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Expected within the next 7 days
              </div>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
              <div style={{ textAlign: 'center', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{activePlantings}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Growing</div>
              </div>
              <div style={{ textAlign: 'center', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{harvestSoonCount}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Harvest Soon</div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="md" 
          fullWidth 
          style={{ marginTop: 'var(--space-4)' }}
          onClick={() => window.location.href = `/gardens/${id}/soil`}
        >
          View Soil Intelligence →
        </Button>
      </Card>

      {/* Soil Intelligence Card */}
      <Card title="🌍 Soil Intelligence" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
            Track soil health, amendments, and test results
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-4)', 
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            📊 Soil data and amendments tracked per bed
          </div>
        </div>

        <Button 
          variant="primary" 
          size="md" 
          fullWidth
          onClick={() => window.location.href = `/gardens/${id}/soil`}
        >
          Manage Soil Data
        </Button>
      </Card>

      {/* Smart Watering Card */}
      <Card title="💧 Smart Watering" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
            Watering recommendations based on weather and plant needs
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-4)', 
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>💦</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Watering schedule coming soon
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Set up automated watering reminders based on plant types and weather conditions
        </div>
      </Card>

      {/* Plant Recommendations Card */}
      <Card title="🌿 Plant Recommendations" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
            What to plant next based on season, zone, and space
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-4)', 
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)'
        }}>
          {garden.usdaZone ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                Zone {garden.usdaZone}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Recommendations tailored to your growing zone
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Add your location to get personalized recommendations
            </div>
          )}
        </div>

        <Button variant="outline" size="md" fullWidth onClick={() => window.location.href = '/seeds'}>
          Browse Seed Inventory →
        </Button>
      </Card>

      {/* Photo Journal Card */}
      <Card title="📸 Photo Journal" variant="default">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
            Track growth progress with photos over time
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-4)', 
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>📷</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {plantings.length > 0 
              ? `Document ${activePlantings} active greenhouse${activePlantings !== 1 ? 's' : ''}`
              : 'Start growing to begin your photo journal'
            }
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Upload photos of your plants to track their progress and identify issues
        </div>
      </Card>

      {/* Ask Terra AI Card - Full width on larger screens */}
      <div style={{ gridColumn: '1 / -1' }}>
        <AskTerraAICard
          gardenId={id!}
          gardenName={garden.name}
          bedCount={bedCount}
          activePlantings={activePlantings}
          usdaZone={garden.usdaZone}
          stressedPlantings={stressedPlantings}
          harvestSoonCount={harvestSoonCount}
        />
      </div>
    </div>
  );
}
