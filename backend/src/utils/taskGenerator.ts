import prisma from '../lib/prisma';

/**
 * Generate care tasks for a planting
 * - Every 2 days for first 2 weeks (7 tasks)
 * - Weekly afterwards for 12 weeks (12 tasks)
 */
export async function generateTasksForPlanting(
  plantingId: string,
  userId: string,
  plantingDate: Date
): Promise<void> {
  const tasks = [];

  // First 2 weeks: water every 2 days
  for (let day = 2; day <= 14; day += 2) {
    const dueDate = new Date(plantingDate);
    dueDate.setDate(dueDate.getDate() + day);
    
    tasks.push({
      userId,
      plantingId,
      type: 'water',
      title: 'Water plants',
      description: 'Water thoroughly, especially during establishment phase',
      dueDate,
      completed: false,
    });
  }

  // After 2 weeks: water weekly for 12 weeks
  for (let week = 1; week <= 12; week++) {
    const dueDate = new Date(plantingDate);
    dueDate.setDate(dueDate.getDate() + 14 + (week * 7));
    
    tasks.push({
      userId,
      plantingId,
      type: 'water',
      title: 'Water plants',
      description: 'Regular weekly watering',
      dueDate,
      completed: false,
    });
  }

  // Add a fertilize task at 4 weeks
  const fertilizeDate = new Date(plantingDate);
  fertilizeDate.setDate(fertilizeDate.getDate() + 28);
  tasks.push({
    userId,
    plantingId,
    type: 'fertilize',
    title: 'Fertilize plants',
    description: 'Apply balanced fertilizer according to package directions',
    dueDate: fertilizeDate,
    completed: false,
  });

  // Create all tasks
  await prisma.task.createMany({
    data: tasks,
  });
}
