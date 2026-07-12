<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>{{PROJECT_NAME}}</title>
</svelte:head>

<main class="container">
  <h1>{{PROJECT_NAME}}</h1>
  <p>Production-ready SvelteKit + Supabase SaaS starter.</p>

  {#if data.user}
    <div class="card">
      <p>Signed in as <strong>{data.user.email}</strong>.</p>
      <p><a href="/dashboard">Go to your dashboard &rarr;</a></p>
    </div>
  {:else}
    <div class="card">
      <p>
        <a href="/login">Log in</a> &middot; <a href="/signup">Sign up</a>
        to get started.
      </p>
    </div>
  {/if}
</main>
