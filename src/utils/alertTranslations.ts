/**
 * Traducciones de nombres de alertas al español
 */
export const ALERT_NAME_TRANSLATIONS: Record<string, string> = {
  'DEWORMING_REMINDER': 'Recordatorio de Desparasitación',
  'VACCINATION_REMINDER': 'Recordatorio de Vacunación',
  'VITAMINS_REMINDER': 'Recordatorio de Vitaminas',
  'BREEDING_REMINDER': 'Recordatorio de Reproducción',
  'HEALTH_CHECK_REMINDER': 'Recordatorio de Revisión de Salud',
  'FEEDING_REMINDER': 'Recordatorio de Alimentación',
  'CLEANING_REMINDER': 'Recordatorio de Limpieza',
  'POST_BIRTH_CARE': 'Cuidado Post Parto',
  'PREGNANCY_DEWORMING': 'Desparasitación en Gestación',
  'STOP_MINERAL_SALT': 'Suspender Sal Mineralizada',
  'PREPARTUM_FOOD': 'Alimento Pre Parto',
  'EXPECTED_BIRTH': 'Nacimiento Esperado',
  'DRY_OFF_UDDER': 'Secado de Ubre',
  'REST_PERIOD': 'Período de Reposo',
  'BREEDING_READY': 'Lista para Reproducción',
  'SLAUGHTER_REMINDER': 'Recordatorio de Sacrificio',
  'SEPARATE_LITTER': 'Separar Camada',
};

/**
 * Traduce el nombre de una alerta al español
 * Si no hay traducción, devuelve el nombre formateado de manera más amigable
 */
export function translateAlertName(alertName: string): string {
  // Si ya está en español o tiene una traducción directa
  if (ALERT_NAME_TRANSLATIONS[alertName]) {
    return ALERT_NAME_TRANSLATIONS[alertName];
  }
  
  // Si no hay traducción, formatear el nombre de manera más amigable
  // Convertir SNAKE_CASE a Title Case
  return alertName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Traduce la descripción de una alerta al español
 */
export function translateAlertDescription(description: string): string {
  // Traducciones comunes
  const translations: Record<string, string> = {
    'Deworming due for cow': 'Desparasitación pendiente para vaca',
    'Deworming due for sheep': 'Desparasitación pendiente para oveja',
    'Deworming due for rabbit': 'Desparasitación pendiente para conejo',
    'Deworming due for chicken': 'Desparasitación pendiente para gallina',
  };
  
  if (translations[description]) {
    return translations[description];
  }
  
  // Si no hay traducción directa, devolver la descripción original
  return description;
}

