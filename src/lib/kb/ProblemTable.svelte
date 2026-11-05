<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket, tickets }: { ticket: number; tickets: Record<string, string> } = $props();

  const rows = (reports as Report[]).filter((r) => r.mergedInto === ticket).length;
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} (from {rows} export rows) ·
  <strong>{groups.length}</strong> problems ·
  {groups.map((g) => g.reports.length).join(' + ')}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td><a href={tickets[g.cause]}>#{tickets[g.cause].split('/').pop()}</a></td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">{moved} of the <code>{g.cause}</code> reports read as a one-day move: {g.reports.filter((r) => notes.oneDayMove.includes(r.id)).map((r) => r.id).join(', ')}.</p>
  {/if}
{/each}

<style>
  .note { color: var(--muted); font-size: 0.85em; }
</style>
