<script lang="ts">
  import { env } from '$env/dynamic/public';

  const plans = [
    { name: 'Starter', price: '$9 / mo', priceId: env.PUBLIC_STRIPE_STARTER_PRICE_ID },
    { name: 'Pro', price: '$29 / mo', priceId: env.PUBLIC_STRIPE_PRO_PRICE_ID }
  ];

  let loading: string | null = null;
  let errorMsg: string | null = null;

  async function checkout(priceId?: string) {
    if (!priceId) {
      alert('Set PUBLIC_STRIPE_*_PRICE_ID in your .env first.');
      return;
    }
    loading = priceId;
    errorMsg = null;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        errorMsg = data.error ?? 'Checkout failed';
      }
    } catch {
      errorMsg = 'Network error';
    } finally {
      loading = null;
    }
  }
</script>

<svelte:head>
  <title>{{PROJECT_NAME}}</title>
</svelte:head>

<main class="container">
  <h1>{{PROJECT_NAME}}</h1>
  <p>Production-ready SvelteKit + Stripe SaaS starter.</p>

  <div class="plans">
    {#each plans as plan}
      <div class="plan">
        <h3>{plan.name}</h3>
        <div class="plan-price">{plan.price}</div>
        <button on:click={() => checkout(plan.priceId)} disabled={loading === plan.priceId}>
          {loading === plan.priceId ? 'Redirecting…' : 'Subscribe'}
        </button>
      </div>
    {/each}
  </div>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}
</main>
