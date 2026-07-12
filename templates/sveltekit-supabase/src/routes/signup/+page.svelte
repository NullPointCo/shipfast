<script lang="ts">
  import { enhance } from '$app/forms';
  export let form;
</script>

<svelte:head>
  <title>Sign up &middot; {{PROJECT_NAME}}</title>
</svelte:head>

<main class="container">
  <h1>Sign up</h1>

  <div class="card">
    <form method="POST" use:enhance>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" value={form?.email ?? ''} required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" minlength="6" required />

      <button type="submit">Create account</button>
    </form>

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <p style="margin-top:1rem">Already have an account? <a href="/login">Log in</a></p>
  </div>
</main>
