<script lang="ts">
  import { enhance } from '$app/forms';
  export let data;
  export let form;
</script>

<svelte:head>
  <title>Dashboard &middot; {{PROJECT_NAME}}</title>
</svelte:head>

<main class="container">
  <h1>Dashboard</h1>
  <div class="card">
    <p>Signed in as <strong>{data.user?.email}</strong>.</p>
    <p>This protected route is only reachable with a valid session.</p>
    <form method="POST" action="?/signout" use:enhance>
      <button type="submit">Sign out</button>
    </form>
  </div>
</main>
