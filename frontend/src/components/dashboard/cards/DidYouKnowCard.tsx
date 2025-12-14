import { useState } from 'react';
import DashboardCard from '../DashboardCard';

const GARDEN_FACTS = [
  "🌱 Companion planting can naturally repel pests and improve crop yields.",
  "💧 Watering in the morning reduces water loss from evaporation.",
  "🌿 Mulching helps retain soil moisture and suppress weeds.",
  "🐝 Native plants attract beneficial pollinators to your garden.",
  "🌾 Crop rotation prevents soil depletion and reduces disease.",
  "☀️ Most vegetables need 6-8 hours of direct sunlight daily.",
  "🍅 Tomatoes grow better when planted with basil and marigolds.",
  "🥕 Carrots and onions make excellent companion plants.",
  "🌻 Sunflowers can help draw toxins from contaminated soil.",
  "🪴 Container gardens can be just as productive as in-ground beds."
];

export default function DidYouKnowCard() {
  const [currentFactIndex, setCurrentFactIndex] = useState(
    Math.floor(Math.random() * GARDEN_FACTS.length)
  );

  const showNextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % GARDEN_FACTS.length);
  };

  return (
    <DashboardCard
      title="Did You Know?"
      subtitle="Garden wisdom & tips"
      glass={true}
    >
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(252, 231, 243, 0.5)',
        borderRadius: '12px',
        marginBottom: '1rem',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#1f2937',
          textAlign: 'center'
        }}>
          {GARDEN_FACTS[currentFactIndex]}
        </p>
      </div>
      <button
        onClick={showNextFact}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'transparent',
          color: '#ec4899',
          border: '2px solid #ec4899',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        Show Another Tip 🔄
      </button>
    </DashboardCard>
  );
}
