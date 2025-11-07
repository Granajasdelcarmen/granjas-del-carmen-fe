import { useAnimals } from 'src/hooks/useAnimals';
import { useInventory } from 'src/hooks/useInventory';
import { useInventoryProducts } from 'src/hooks/useInventoryProducts';
import { ANIMAL_SPECIES, ANIMAL_SPECIES_ICONS, ANIMAL_SPECIES_LABELS } from 'src/constants/animals';
import { StatsCard } from './StatsCard';

export function DashboardStats() {
  // Fetch all animal types
  const { data: rabbits } = useAnimals(ANIMAL_SPECIES.RABBIT, undefined, false);
  const { data: cows } = useAnimals(ANIMAL_SPECIES.COW, undefined, false);
  const { data: sheep } = useAnimals(ANIMAL_SPECIES.SHEEP, undefined, false);
  const { data: inventory } = useInventory();

  // Calculate totals
  const totalRabbits = Array.isArray(rabbits) ? rabbits.length : 0;
  const totalCows = Array.isArray(cows) ? cows.length : 0;
  const totalSheep = Array.isArray(sheep) ? sheep.length : 0;
  const totalAnimals = totalRabbits + totalCows + totalSheep;

  // Calculate by gender for each species
  const maleRabbits = Array.isArray(rabbits) ? rabbits.filter(r => r.gender === 'MALE').length : 0;
  const femaleRabbits = Array.isArray(rabbits) ? rabbits.filter(r => r.gender === 'FEMALE').length : 0;
  const maleCows = Array.isArray(cows) ? cows.filter(c => c.gender === 'MALE').length : 0;
  const femaleCows = Array.isArray(cows) ? cows.filter(c => c.gender === 'FEMALE').length : 0;
  const maleSheep = Array.isArray(sheep) ? sheep.filter(s => s.gender === 'MALE').length : 0;
  const femaleSheep = Array.isArray(sheep) ? sheep.filter(s => s.gender === 'FEMALE').length : 0;

  // Inventory stats (old inventory)
  const lowStockItems = Array.isArray(inventory) ? inventory.filter(item => item.quantity < 10).length : 0;
  const outOfStockItems = Array.isArray(inventory) ? inventory.filter(item => item.quantity === 0).length : 0;

  // Inventory Products stats (new system)
  const { data: inventoryProducts } = useInventoryProducts('AVAILABLE');
  const availableProducts = inventoryProducts?.length || 0;
  const expiredProducts = inventoryProducts?.filter(p => p.status === 'EXPIRED').length || 0;

  return (
    <div className="space-y-3">
      {/* Animals Section - All together in a compact grid */}
      <div>
        <h2 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-1.5 text-sm">🐾</span>
          Animales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatsCard
            title="Total"
            value={totalAnimals}
            icon="🐾"
            color="stone"
            subtitle={`${totalRabbits} conejos • ${totalCows} vacas • ${totalSheep} ovejas`}
          />
          
          <StatsCard
            title={ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.RABBIT]}
            value={totalRabbits}
            icon={ANIMAL_SPECIES_ICONS[ANIMAL_SPECIES.RABBIT]}
            color="green"
            subtitle={`${maleRabbits} machos • ${femaleRabbits} hembras`}
          />
          
          <StatsCard
            title={ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.COW]}
            value={totalCows}
            icon={ANIMAL_SPECIES_ICONS[ANIMAL_SPECIES.COW]}
            color="blue"
            subtitle={`${maleCows} machos • ${femaleCows} hembras`}
          />
          
          <StatsCard
            title={ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.SHEEP]}
            value={totalSheep}
            icon={ANIMAL_SPECIES_ICONS[ANIMAL_SPECIES.SHEEP]}
            color="yellow"
            subtitle={`${maleSheep} machos • ${femaleSheep} hembras`}
          />
        </div>
      </div>

      {/* Inventory Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-1.5 text-sm">📦</span>
          Inventario
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <StatsCard
            title="Productos Disponibles"
            value={availableProducts}
            icon="📦"
            color="green"
            subtitle="Listos para venta"
          />
          
          <StatsCard
            title="Items en Inventario"
            value={Array.isArray(inventory) ? inventory.length : 0}
            icon="📋"
            color="blue"
            subtitle={`${lowStockItems} con stock bajo`}
          />
          
          <StatsCard
            title={expiredProducts > 0 ? "Productos Vencidos" : "Sin Stock"}
            value={expiredProducts > 0 ? expiredProducts : outOfStockItems}
            icon={expiredProducts > 0 ? "⚠️" : "⚠️"}
            color={expiredProducts > 0 || outOfStockItems > 0 ? 'red' : 'green'}
            subtitle={expiredProducts > 0 ? 'Necesita atención' : outOfStockItems > 0 ? 'Necesita atención' : 'Todo en orden'}
          />
        </div>
      </div>
    </div>
  );
}
