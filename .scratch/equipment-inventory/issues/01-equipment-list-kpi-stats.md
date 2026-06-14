# Equipment list: KPI stat cards

Status: needs-triage

## Context

Deferred from the equipment inventory list work (card grid + data table + filters).
The hybrid Stitch mockup ("Operational Hybrid List Variant") shows a row of four KPI
stat cards above the inventory:

- Operativas (count)
- En Servicio (count)
- Alerta Crítica (count)
- Media de Comb. (percentage)

## What's in / out

The mockup's KPIs partly rely on fictions we dropped from the inventory list:
"Media de Combustible" and "Alerta Crítica" map to a fuel/battery telemetry the
`equipment` schema does not have. Do **not** rebuild those as-is.

What is real and computable today are **counts per `equipment_status`**
(`in_use`, `available`, `in_transit`, `maintenance`, `retired`). A defensible first
version is a strip of status-count cards driven by a Supabase count query (one
grouped count, not N round-trips).

## Acceptance (draft)

- A KPI strip above the equipment list showing counts per status, using real data.
- Counts respect... TBD: do they reflect the active filters, or always show the
  whole fleet? (Decide at triage.)
- Uses the UI kit Card; no new fuel/telemetry fields invented.
- Fuel/alert KPIs are explicitly out until a telemetry source exists.

## Notes

Use the Spanish UI term **Equipo / Equipos** (not Máquina) per CONTEXT.md.
