<script lang="ts">
  import { PLANS } from '$lib/products';

  let loading = false;
  let error = '';

  async function subscribe(priceId: string) {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      error = (e as Error).message;
      loading = false;
    }
  }
</script>

<main>
  <h1>Pricing</h1>
  <p class="muted">Simple, subscription-based pricing powered by Stripe Checkout.</p>

  {#each PLANS as plan}
    <div class="plan">
      <h2>{plan.name} — {plan.price}</h2>
      <ul>
        {#each plan.features as f}<li>{f}</li>{/each}
      </ul>
      <button on:click={() => subscribe(import.meta.env[plan.priceIdEnv])} disabled={loading}>
        {loading ? 'Redirecting…' : `Subscribe to ${plan.name}`}
      </button>
    </div>
  {/each}

  {#if error}<p style="color:#f85149">{error}</p>{/if}
</main>
