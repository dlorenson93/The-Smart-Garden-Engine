// Companion planting data for common crops
// Based on traditional companion planting wisdom

export const companionData: Record<string, { companions: string; avoid: string }> = {
  // Tomatoes
  'tomato': {
    companions: 'basil,carrots,onions,parsley,marigold,nasturtium,garlic,chives',
    avoid: 'cabbage,broccoli,cauliflower,kohlrabi,fennel,dill,potatoes'
  },
  'cherry tomato': {
    companions: 'basil,carrots,onions,parsley,marigold,nasturtium,garlic,chives',
    avoid: 'cabbage,broccoli,cauliflower,kohlrabi,fennel,dill,potatoes'
  },
  'beefsteak tomato': {
    companions: 'basil,carrots,onions,parsley,marigold,nasturtium,garlic,chives',
    avoid: 'cabbage,broccoli,cauliflower,kohlrabi,fennel,dill,potatoes'
  },
  
  // Peppers
  'bell pepper': {
    companions: 'basil,onions,spinach,tomatoes,parsley,carrots',
    avoid: 'fennel,kohlrabi,beans'
  },
  'jalapeño': {
    companions: 'basil,onions,spinach,tomatoes,parsley,carrots',
    avoid: 'fennel,kohlrabi,beans'
  },
  'chili pepper': {
    companions: 'basil,onions,spinach,tomatoes,parsley,carrots',
    avoid: 'fennel,kohlrabi,beans'
  },
  
  // Lettuce & Greens
  'lettuce': {
    companions: 'carrots,radishes,strawberries,cucumbers,beets,onions',
    avoid: 'parsley,celery'
  },
  'spinach': {
    companions: 'strawberries,peas,beans,eggplant,cabbage,celery',
    avoid: 'potatoes'
  },
  'kale': {
    companions: 'onions,beets,celery,herbs,potatoes,nasturtium',
    avoid: 'strawberries,tomatoes,peppers,beans'
  },
  'arugula': {
    companions: 'beans,carrots,cucumbers,lettuce,spinach',
    avoid: 'strawberries'
  },
  
  // Brassicas
  'broccoli': {
    companions: 'beets,carrots,chamomile,dill,mint,nasturtium,onions,oregano,rosemary,sage,thyme',
    avoid: 'tomatoes,peppers,strawberries,beans'
  },
  'cabbage': {
    companions: 'beets,celery,chamomile,dill,mint,nasturtium,onions,oregano,potatoes,sage,thyme',
    avoid: 'tomatoes,peppers,strawberries,beans,grapes'
  },
  'cauliflower': {
    companions: 'beets,celery,chamomile,dill,mint,nasturtium,onions,oregano,sage,thyme',
    avoid: 'tomatoes,peppers,strawberries,beans'
  },
  'brussels sprouts': {
    companions: 'beets,carrots,celery,chamomile,dill,mint,nasturtium,onions,oregano,thyme',
    avoid: 'tomatoes,peppers,strawberries'
  },
  
  // Root Vegetables
  'carrots': {
    companions: 'beans,lettuce,onions,peas,radishes,rosemary,sage,tomatoes,chives,leeks',
    avoid: 'dill,parsnips'
  },
  'beets': {
    companions: 'broccoli,cabbage,lettuce,onions,kohlrabi,garlic',
    avoid: 'beans,mustard'
  },
  'radishes': {
    companions: 'beans,carrots,cucumbers,lettuce,peas,squash,nasturtium',
    avoid: 'hyssop'
  },
  'potatoes': {
    companions: 'beans,cabbage,corn,horseradish,marigold,peas',
    avoid: 'tomatoes,peppers,cucumbers,pumpkins,squash,sunflowers'
  },
  'turnips': {
    companions: 'peas,beans,brussels sprouts',
    avoid: 'potatoes,carrots'
  },
  
  // Beans & Legumes
  'green beans': {
    companions: 'carrots,corn,cucumbers,peas,potatoes,radishes,strawberries,cabbage',
    avoid: 'onions,garlic,peppers,fennel,sunflowers'
  },
  'peas': {
    companions: 'beans,carrots,corn,cucumbers,radishes,turnips,aromatic herbs',
    avoid: 'onions,garlic,potatoes'
  },
  
  // Cucurbits
  'cucumbers': {
    companions: 'beans,peas,radishes,sunflowers,lettuce,cabbage,nasturtium,oregano,dill',
    avoid: 'aromatic herbs,potatoes,melons'
  },
  'zucchini': {
    companions: 'beans,corn,peas,radishes,nasturtium,oregano,marigold',
    avoid: 'potatoes'
  },
  'pumpkin': {
    companions: 'beans,corn,peas,radishes,nasturtium,oregano,marigold',
    avoid: 'potatoes'
  },
  'watermelon': {
    companions: 'radishes,nasturtium,oregano,marigold',
    avoid: 'potatoes,cucumbers'
  },
  
  // Alliums
  'onions': {
    companions: 'beets,cabbage,carrots,lettuce,peppers,potatoes,strawberries,tomatoes',
    avoid: 'beans,peas,sage,asparagus'
  },
  'garlic': {
    companions: 'beets,cabbage,lettuce,peppers,potatoes,roses,tomatoes',
    avoid: 'beans,peas,asparagus,sage'
  },
  'leeks': {
    companions: 'carrots,celery,onions',
    avoid: 'beans,peas'
  },
  
  // Herbs
  'basil': {
    companions: 'tomatoes,peppers,asparagus,oregano',
    avoid: 'rue,sage'
  },
  'cilantro': {
    companions: 'tomatoes,beans,peas,spinach',
    avoid: 'fennel'
  },
  'dill': {
    companions: 'cabbage,lettuce,onions,cucumbers',
    avoid: 'carrots,tomatoes,fennel'
  },
  'parsley': {
    companions: 'tomatoes,asparagus,carrots,corn',
    avoid: 'mint,onions'
  },
  'mint': {
    companions: 'cabbage,tomatoes,peas',
    avoid: 'parsley,rue'
  },
  'rosemary': {
    companions: 'beans,cabbage,carrots,sage',
    avoid: 'basil,rue'
  },
  'thyme': {
    companions: 'cabbage,strawberries,tomatoes,eggplant',
    avoid: 'rue'
  },
  'oregano': {
    companions: 'broccoli,cabbage,cauliflower,cucumbers,peppers,pumpkin',
    avoid: 'none'
  },
  'sage': {
    companions: 'broccoli,cabbage,carrots,rosemary,strawberries',
    avoid: 'cucumbers,onions'
  },
  'chives': {
    companions: 'carrots,tomatoes,roses,grapes',
    avoid: 'beans,peas'
  },
  
  // Flowers
  'marigold': {
    companions: 'tomatoes,beans,cabbage,cucumbers,squash',
    avoid: 'none'
  },
  'nasturtium': {
    companions: 'tomatoes,radishes,cabbage,cucumbers,beans,broccoli',
    avoid: 'none'
  },
  'sunflower': {
    companions: 'corn,cucumbers,squash',
    avoid: 'beans,potatoes'
  },
  
  // Corn
  'corn': {
    companions: 'beans,cucumbers,peas,pumpkin,squash,sunflowers',
    avoid: 'tomatoes,celery'
  },
  
  // Eggplant
  'eggplant': {
    companions: 'beans,peppers,potatoes,spinach,thyme',
    avoid: 'fennel'
  },
  
  // Strawberries
  'strawberry': {
    companions: 'beans,borage,lettuce,onions,spinach,thyme',
    avoid: 'cabbage,broccoli,cauliflower'
  }
};
