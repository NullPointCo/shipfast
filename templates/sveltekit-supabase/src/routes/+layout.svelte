<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  export let data;
  $: user = data.user;
</script>

<nav>
  <span class="brand">{{PROJECT_NAME}}</span>
  {#if user}
    <span>{user.email}</span>
    <a href="/dashboard">Dashboard</a>
    <form method="POST" action="/dashboard?/signout">
      <button type="submit" style="width:auto;margin:0;padding:0.4rem 0.8rem;">Sign out</button>
    </form>
  {:else}
    <a href="/login">Log in</a>
    <a href="/signup">Sign up</a>
  {/if}
</nav>

<slot />
