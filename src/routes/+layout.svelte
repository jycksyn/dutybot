<script>
	import { setContext } from "svelte";
  import "../app.css";

  export let data;

  setContext('seed', data.seed);
</script>

<slot />