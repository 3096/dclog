<script lang="ts">
	import type { Message } from '$lib/index';
	let {
		account,
		channelName,
		message
	}: { account: unknown; channelName: string; message: Message } = $props();

	function linkify(text: string) {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		return text.replace(urlRegex, (url) => {
			return `<a href="${url}" target="_blank">${url}</a>`;
		});
	}
</script>

{#if channelName}
	<hr />
	<h1>{channelName}</h1>
	<hr />
{/if}
<div style="transition: background-color 0.3s; padding: 1px 16px;">
	<!-- <div> -->
	{#if message.Contents}
		<p>{@html linkify(message.Contents)}</p>
	{/if}
	{#if /^https?:\/\/\S+\.(?:png|jpe?g|gif)/i.test(message.Attachments)}
		<img
			style="max-width: 100%; max-height: 100%;"
			src={message.Attachments}
			alt="attachment img"
		/>
	{:else if /^https?:\/\/\S+\.(?:mp4|webm|ogg)/i.test(message.Attachments)}
		<a href={message.Attachments}>{message.Attachments}</a>
		<!-- svelte-ignore a11y_media_has_caption -->
		<video controls style="max-width: 100%; max-height: 100%;">
			<source src={message.Attachments} type="video/mp4" />
			<source src={message.Attachments} type="video/webm" />
			<source src={message.Attachments} type="video/ogg" />
			Your browser does not support the video tag.
		</video>
	{:else if !message.Contents}
		<pre>{JSON.stringify(message, null, 2)}</pre>
	{/if}
	{#if /^https?:\/\/\S+\.(?:png|jpe?g|gif)/i.test(message.Contents)}
		<img style="max-width: 100%; max-height: 100%;" src={message.Contents} alt="message img" />
	{/if}
	<p style="color: grey;">
		{account.username} -- At: {message.dateObj}
	</p>
</div>
<hr />

<style>
	div:hover {
		background-color: #f0f0f0;
	}
</style>
