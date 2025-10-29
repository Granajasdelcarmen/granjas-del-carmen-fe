import React from 'react';
import { useUsers } from 'src/hooks/useUsers';
import { useRabbits } from 'src/hooks/useRabbits';
import { useInventory } from 'src/hooks/useInventory';
import { StatsCard } from './StatsCard';

export function DashboardStats() {
  const { data: users } = useUsers();
  const { data: rabbits } = useRabbits();
  const { data: inventory } = useInventory();

  const activeUsers = Array.isArray(users) ? users.filter(user => user.is_active).length : 0;
  const maleRabbits = Array.isArray(rabbits) ? rabbits.filter(rabbit => rabbit.gender === 'MALE').length : 0;
  const femaleRabbits = Array.isArray(rabbits) ? rabbits.filter(rabbit => rabbit.gender === 'FEMALE').length : 0;
  const lowStockItems = Array.isArray(inventory) ? inventory.filter(item => item.quantity < 10).length : 0;
  const outOfStockItems = Array.isArray(inventory) ? inventory.filter(item => item.quantity === 0).length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Usuarios Activos"
        value={activeUsers}
        icon="👥"
        color="blue"
        subtitle={`de ${Array.isArray(users) ? users.length : 0} total`}
      />
      
      <StatsCard
        title="Conejos"
        value={Array.isArray(rabbits) ? rabbits.length : 0}
        icon="🐰"
        color="green"
        subtitle={`${maleRabbits} machos, ${femaleRabbits} hembras`}
      />
      
      <StatsCard
        title="Items en Inventario"
        value={Array.isArray(inventory) ? inventory.length : 0}
        icon="📦"
        color="purple"
        subtitle={`${lowStockItems} con stock bajo`}
      />
      
      <StatsCard
        title="Sin Stock"
        value={outOfStockItems}
        icon="⚠️"
        color={outOfStockItems > 0 ? 'red' : 'green'}
        subtitle={outOfStockItems > 0 ? 'Necesita atención' : 'Todo en orden'}
      />
    </div>
  );
}
