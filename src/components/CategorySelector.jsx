import React from 'react';
import { 
  Cpu, 
  Zap, 
  Home, 
  House, 
  TreePine, 
  Droplets
} from 'lucide-react';

const CategorySelector = ({ value, onChange }) => {
  const categories = [
    {
      id: 'Appliances',
      icon: Cpu,
      label: 'Appliances',
      description: 'Stove, dishwasher, fridge, heating & cooling'
    },
    {
      id: 'Electrical',
      icon: Zap,
      label: 'Electrical',
      description: 'Lights, outlets, breakers, telephone systems'
    },
    {
      id: 'House Exterior',
      icon: Home,
      label: 'House Exterior',
      description: 'Roof, doors, windows, air conditioning'
    },
    {
      id: 'Household',
      icon: House,
      label: 'Household',
      description: 'Doors, windows, closets, flooring, pest control'
    },
    {
      id: 'Outdoors',
      icon: TreePine,
      label: 'Outdoors',
      description: 'Landscaping, fencing, pool, porch, parking'
    },
    {
      id: 'Plumbing',
      icon: Droplets,
      label: 'Plumbing',
      description: 'Drains, faucets, pipes, pumps, sprinkler systems'
    }
  ];

  return (
    <div className="space-y-4">
      <center>
        <label className="block mb-2 font-medium text-gray-500 text-xl">Category: What is this request about</label>
    </center>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange({ target: { name: 'category', value: category.id } })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
              value === category.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            type="button"
          >
            <category.icon className={`w-8 h-8 mb-2 ${
              value === category.id ? 'text-blue-500' : 'text-gray-500'
            }`} />
            <div className="text-center">
              <div className="font-medium mb-1">{category.label}</div>
              <div className="text-xs text-gray-500 line-clamp-2">
                {category.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;