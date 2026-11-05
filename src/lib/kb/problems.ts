// The problems inside a merged ticket. causes.ts files every report by tenant; this also takes out
// the reports the desk read differently (desk-notes.json), because they describe another symptom.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = { name: string; group: CauseGroup };

export function splitProblems(reports: Report[], tenantOf: (r: Report) => Tenant | undefined, oneDayMove: readonly string[]): Problem[] {
  const moved = reports.filter((r) => oneDayMove.includes(r.id));
  const rest = reports.filter((r) => !oneDayMove.includes(r.id));
  return [
    ...groupByCause(rest, tenantOf).map((group) => ({ name: group.cause, group })),
    ...groupByCause(moved, tenantOf).map((group) => ({ name: 'one-day shift', group })),
  ];
}
