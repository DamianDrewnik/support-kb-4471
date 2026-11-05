<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitProblems } from '#lib/kb/problems';

  let { ticket, tickets }: { ticket: number; tickets: Record<string, string> } = $props();

  const rows = (reports as Report[]).filter((r) => r.mergedInto === ticket).length;
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const problems = $derived(splitProblems(merged, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} (from {rows} export rows) ·
  <strong>{problems.length}</strong> problems ·
  {problems.map((p) => p.group.reports.length).join(' + ')}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each problems as p (p.name)}
      <tr>
        <td><code>{p.name}</code></td>
        <td>{p.group.reports.length}</td>
        <td>{p.group.tenants}</td>
        <td>{p.group.firstSeen} → {p.group.lastSeen}</td>
        <td><a href={tickets[p.name]}>#{tickets[p.name].split('/').pop()}</a></td>
      </tr>
    {/each}
  </tbody>
</table>
