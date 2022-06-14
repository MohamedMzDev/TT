
const Discord = require("discord.js")
const client = new Discord.Client()
require('discord-reply');
const data = require("./data.json")
const fs = require("fs")
const prefix = "E"
require('discord-buttons')(client);
const disbut = require("discord-buttons");
const messages = {}
const deletes = {}


// Functions


function fetch(url, options = {}) {
	const https = require('https');
	const http = require('http');
	return new Promise((resolve, reject) => {
		try{
	  if (!url) return reject(new Error('Url is required'));
  
	  const { body, method = 'GET', ...restOptions } = options;
	  const client = url.startsWith('https') ? https : http;
  
	  const request = client.request(url, { method, ...restOptions }, (res) => {
		let chunks = '';
  
		res.setEncoding('utf8');
  
		res.on('data', (chunk) => {
		  chunks += chunk;
		});
  
		res.on('end', () => {
		  resolve({ statusCode: res.statusCode, body: chunks });
		});
	  })
  
	  request.on('error', (err) => {
		reject(err);
	  });
  
	  if (body) {
		request.setHeader('Content-Length', body.length);
		request.write(body);
	  }
	  request.end()
	}catch{

	}
	});
  }


const stringIsAValidUrl = (url) => {
	var m = false
	try {
		new URL(url);
		m = true
	  } catch {
		m = false
	  }
	  return m
  };



const CreateEmbed = (title,desc,color) => {
	const Embed = new Discord.MessageEmbed()
		.setTitle(title)
		.setDescription(desc)
		.setColor(color)
	return Embed
}

// Uptime


setInterval(() => {
	for(const key in data){
		fetch(data[key].url).catch(() => {})
	}
},10000)

// Ready


client.on("ready", () => {
    console.log(`Im' ${client.user.username}`)
    client.user.setPresence({
        status: 'dnd',//idle|online|dnd
        activity: {
            name: ``,
            type: "STREAMING", url: "https://www.twitch.tv/Discord"
        }
    })
})




client.on("message", message => {
	if(message.content != prefix + "help") return
	message.channel.send(CreateEmbed("Egypt Uptime Commands",`
  > **<:Arw:972572340854599770> monitor** `,"BLACK"))
  })

 client.on("message", message => {
	 if(!message.content.startsWith(prefix + "monitor")) return
	 const url = message.content.split(" ")[1]
	 if(!url) return message.channel.send(CreateEmbed("Error <:X_:972575410397270036> ",`Please enter url Example:\n**${prefix}monitor https://example.com**`,"BLACK")).catch(() => {})
	 if(stringIsAValidUrl(url) === false) return message.channel.send(CreateEmbed("<:X_:972575410397270036>"," Please provide a project url!","BLACK")).catch(() => {})
	 var check = true
	 for(const key in data){
		 if(data[key].url === url) check = false
	 }
	 if(!check) return message.channel.send(CreateEmbed("Error <:X_:972575410397270036> ",`Url has Already exists in uptime`,"BLACK")).catch(() => {})
	 function getId(len){
			var text = "";

			var charset = "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

			for( var i=0; i < len; i++ )
				text += charset.charAt(Math.floor(Math.random() * charset.length));

			return text;
	}
	const id = getId(40)
	data[id] = {
		url: url,
		owner: message.author.id,
		time: new Date().getTime()
	}
	fs.writeFile("./data.json", JSON.stringify(data, null, 2), function(err) {
		if (err) console.log;
	  });
	message.delete().catch(() => {})
	message.channel.send(CreateEmbed("successful <:TT:972577575987708044>  ",`<@!${message.author.id}> Done add Url in uptime<:TT:972577575987708044> `,"BLACK")).catch(() => {})
	message.author.send(CreateEmbed("New url",`Done added new url: **${url}**\nId: \`${id}\``,"BLACK")).catch(() => {})
 })

 


setInterval(() => {
  const channelid = "959202856253128704" //ايدي الروم
  const channel = client.channels.cache.get(channelid);
  if (!channel) return
  channel.join()
}, 1000); 




client.on("clickButton", button => {
	if(button.id === "deleteMsg"){
		if(!messages[button.message.id]) return button.reply.send({content: "Sorry but this message not found", ephemeral: true}).catch(() => {})
		if(messages[button.message.id].owner != button.clicker.id) return button.reply.send({content: "Sorry but you can't press this button", ephemeral: true}).catch(() => {})
		button.message.delete().catch(() => {})
		delete messages[button.message.id]
		button.reply.send({content: "Done delete message <:TT:972577575987708044> ", ephemeral: true}).catch(() => {})
	}else if(button.id === "sure"){
		if(!deletes[button.message.id]) return button.reply.send({content: "Sorry but this message not found", ephemeral: true}).catch(() => {})
		if(deletes[button.message.id].owner != button.clicker.id) return button.reply.send({content: "Sorry but you can't press this button", ephemeral: true}).catch(() => {})
		for(const key in data){
			if(data[key].owner === button.clicker.id && data[key].url === deletes[button.message.id].url) delete data[key]
		}
		fs.writeFile("./data.json", JSON.stringify(data, null, 2), function(err) {
			if (err) console.log;
		  });
		button.message.edit({content: CreateEmbed("successful","Done delete url","BLACK"),components: []}).catch(() => {})
	}else if(button.id === "notsure"){
		if(!deletes[button.message.id]) return button.reply.send({content: "Sorry but this message not found", ephemeral: true}).catch(() => {})
		if(deletes[button.message.id].owner != button.clicker.id) return button.reply.send({content: "Sorry but you can't press this button", ephemeral: true}).catch(() => {})
		button.message.edit({content: CreateEmbed("fail","The operation has been cancelled","BLACK"),components: []})
	}else{
		button.reply.defer()
	}
})


client.login(`OTUwOTAwNDU3MzE0ODY5Mjk4.GOUc6g.hnlLEyMfaSV78qjiQ8C1da3bG04_83GQx5jA9o`)
