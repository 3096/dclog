interface Accounts {
    [key: string]: unknown;
}

interface Channels {
    [key: string]: string;
}

export interface Message {
    ID: number;
    Timestamp: string;
    Contents: string;
    Attachments: string;
    accountDir: string;
    channelId: string;
    dateObj: Date;
}

interface Data {
    accounts: Accounts;
    messages: Message[];
    channels: Channels;
}

const data: Data = {
    messages: [],
    accounts: {},
    channels: {},
};

// list directories in this folder
const accounts = Object.keys(import.meta.glob("./accounts/*/account/user.json")).map((key) => key.match(/\.\/accounts\/(.*)\/account\/user\.json/)![1]);

for (const account of accounts) {
    const user = (await import(`./accounts/${account}/account/user.json`)).default;
    const channels = (await import(`./accounts/${account}/messages/index.json`)).default;
    data.accounts[account] = user;
    Object.assign(data.channels, channels);
}

const messageChannelsJsons = Object.keys(import.meta.glob("./accounts/*/messages/*/messages.json"));
for (const messageChannelsJson of messageChannelsJsons) {
    const [account, channelId] = messageChannelsJson.match(/\.\/accounts\/(.*)\/messages\/c(.*)\/messages\.json/)!.slice(1);
    const messages = (await import(`./accounts/${account}/messages/c${channelId}/messages.json`)).default;
    for (const message of messages) {
        data.messages.push({
            ...message,
            accountDir: account,
            channelId,
            dateObj: new Date(message.Timestamp + "Z"),
        });
    }
}

data.messages.sort((a, b) => {
    return a.Timestamp < b.Timestamp ? -1 : a.Timestamp > b.Timestamp ? 1 : 0;
});

export default data;
