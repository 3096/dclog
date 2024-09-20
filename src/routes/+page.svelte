<script lang="ts">
	import data from '$lib/index';
	import Message from '$lib/components/Message.svelte';

	export const prerender = true;

	const uniqueMonths = ['0000-00'];
	for (const message of data.messages) {
		const dateStr = `${message.dateObj.getFullYear()}-${message.dateObj.getMonth() + 1}`;
		if (uniqueMonths.at(-1) !== dateStr) {
			uniqueMonths.push(dateStr);
		}
	}
	uniqueMonths.shift();

	let selectedYear = $state(-1);
	let selectedMonth = $state(-1);

	const displayingMessages = $derived(
		(() => {
			const filteredMessages = data.messages.filter((message) => {
				const date = message.dateObj;
				return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
			});
			let curHeadingMsgIdx = 0;
			for (let i = 1; i < filteredMessages.length; i++) {
				const message = filteredMessages[i];
				const curHeadingMsg = filteredMessages[curHeadingMsgIdx];
				if (message.channelId === curHeadingMsg.channelId) {
					message.channelId = '';
				} else {
					curHeadingMsgIdx = i;
				}
			}
			return filteredMessages;
		})()
	);
</script>

<h1>Welcome to SvelteKit</h1>
{#each uniqueMonths as monthStr}
	<button
		onclick={() => {
			const [year, month] = monthStr.split('-');
			selectedYear = parseInt(year);
			selectedMonth = parseInt(month) - 1;
		}}
		disabled={selectedYear === parseInt(monthStr.split('-')[0]) &&
			selectedMonth === parseInt(monthStr.split('-')[1]) - 1}
	>
		{monthStr}
	</button>
	{#if parseInt(monthStr.split('-')[1]) === 11}
		<br />
	{/if}
{/each}
{#each displayingMessages as message}
	<Message
		{message}
		account={data.accounts[message.accountDir]}
		channelName={((channelId) => {
			if (!data.channels[channelId]) {
				return '';
			}
			const channelName = data.channels[channelId];
			return channelName + (channelName === 'Unknown channel' ? ' ' + channelId : '');
		})(message.channelId)}
	/>
{/each}
