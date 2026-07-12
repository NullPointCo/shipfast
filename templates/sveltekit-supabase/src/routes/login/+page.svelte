<script lang="ts">
  import { enhance } from '$app/forms';
  export let form;
</script>

<svelte:head>
  <title>Log in &middot; {{PROJECT_NAME}}</title>
</svelte:head>

<main class="container">
  <h1>Log in</h1>

  <div class="card">
    <form method="POST" use:enhance>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" value={form?.email ?? ''} required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button type="submit">Log in</button>
    </form>

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <p style="margin-top:1rem">No account? <a href="/signup">Sign up</a></p>
  </div>
</main>
