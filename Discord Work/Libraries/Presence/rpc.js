const RPC = require('discord-rpc');
const client = new RPC.Client({ transport: 'ipc' });

const serverName = 'Your Server Name';
const serverInvite = 'Your Server Invite';
const serverDetails = 'Your Server Details';
const cientId = 'Your App ID');

// Add your RPC icon in your app's details at https://discord.com/developers/applications -> your app -> "Rich Presence" -> "Art Assets" with the name 'rpc_icon'

(async () => {
    client.on('ready', async () => {
        await client.setActivity({
            buttons: [{ label: serverName, url: serverInvite }],
            details: serverDetails,
            largeImageKey: "rpc_icon"
        }).catch(err => console.log(err));

        console.log("Discord Rich Presence has been enabled.");
    });

    await client.login({ clientId: clientId }).catch(console.error);
})();
