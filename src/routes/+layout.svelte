<script>
	import { setContext } from "svelte";
  import "../app.css";
	import Rand from "rand-seed";

  export let data;

  setContext('seed', data.seed);
</script>

<slot />