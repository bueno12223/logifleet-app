// Field labels: an equipment column/attribute -> the Spanish header used wherever
// that field surfaces (card subtitle, table header, future detail rows). Keyed by
// the display column, including the two joined fields (type, operator).
export const EQUIPMENT_FIELD_LABELS = {
  name: "Equipo",
  type: "Tipo",
  status: "Estado",
  operator: "Operador",
  serialNumber: "N.º de serie",
  totalHours: "Horas de uso",
  nextMaintenance: "Próx. mantenimiento",
} as const

export const UNASSIGNED_OPERATOR = "—"
