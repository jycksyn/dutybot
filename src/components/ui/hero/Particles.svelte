<script>
	import Rand from "rand-seed";
	import { getContext } from "svelte";

    const seed = getContext('seed');

    const generator = new Rand(seed);

    const rand = () => generator.next();

    const particles = (
        [...Array(400)].map(_ => [
            rand() * 6 + 1, 
            rand() * 100,
            rand() * 200,
        ])
    );
</script>

{#each particles as [size, pos, start], i}
    <div class="-z-50 animate-particle absolute rounded bg-white" style="
        height: {size}px;
        width: {size}px;
        top: {pos}vh;
        left: {start}vw;
    " />
{/each}