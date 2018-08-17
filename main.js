var Discord = require("discord.js");
var bot = new Discord.Client();
var konfiguracja = require("./konfiguracja.json");
const ascii = require("ascii-art");
const moment = require("moment");
const fs = require("fs");
const ms = require("ms");
//const coins = require("./coins.json");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
//let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
//let userData = JSON.parse(fs.readFileSync('Storage/userData.json', `utf8`));
//let suggestChannel = JSON.parse(fs.readFileSync('Storage/suggestChannel.json', 'utf8'));

bot.on('ready', () => {
    console.log(`The bot has been turned on! His name is ${bot.user.tag}. Prefix: "cb!". I jest na ${bot.guilds.size} serwerach!`);
    bot.user.setStatus(`idle`);
    bot.user.setActivity(`Cookie Community`, {type: "WATCHING"});
});

bot.on("guildMemberRemove", member => {
  
    member.guild.channels.get("460664617996386304").setName(`✸ Użytkownicy: ${member.guild.memberCount}`);
    member.guild.channels.channels.get("467380660189921280").setName(`✸ Botów: ${member.guild.members.filter(m => m.user.bot).size}`);
});

bot.on("message", async message => {

    if(message.author.bot) return;
    //if(message.author.id === '396284197389729793') return message.channel.send('Masz bana w bocie');
    if(message.channel.type === "dm") return;
  
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: konfiguracja.prefix
        };
    }

    let language = JSON.parse(fs.readFileSync("./languages.json", "utf8"));

    if(!language[message.guild.id]){
        language[message.guild.id] = {
            language: konfiguracja.defaultLang
        };
    }

    let suggestChannels = JSON.parse(fs.readFileSync("./suggestChannels.json", "utf8"));

    if(!suggestChannels[message.guild.id]){
        suggestChannels[message.guild.id] = {
            suggestChannels: konfiguracja.defaultSuggestChannel
        };
    }

    let lang = language[message.guild.id].language;

    let suggestChannel = suggestChannels[message.guild.id].suggestChannels;

    let prefix = prefixes[message.guild.id].prefixes;
    //let prefix = konfiguracja.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let msg = message.content.startsWith;
    let args = messageArray.slice(1);

    if(cmd === `${prefix}bingo`){
        let y = Math.floor(Math.random() * (Math.floor(75) - Math.ceil(1) + 1)) + Math.ceil(1);
        let x = null;

        if (y < 15) { x = "B"; } 
        else if (y < 30){ x = "I"; } 
        else if (y < 45){ x = "N"; } 
        else if (y < 60){ x = "G"; } 
        else { x = "O"; }

        message.channel.send(x + y);
    }

    if(cmd === `${prefix}statsrefresh`){
        message.channel.send(`${bot.emojis.find(`name`, 'success')} Statystyki serwera **Cookie Community** zostały zaaktualizowane!`);
        bot.channels.get("478297357046382592").setName(`✸ Użytkownicy: ${message.guild.memberCount}`);
        bot.channels.get("478297464810635279").setName(`✸ Botów: ${message.guild.members.filter(m => m.user.bot).size}`);
    }

    if(cmd === `${prefix}kill`){
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        message.channel.send(`${bot.emojis.find(`name`, 'alert')} Użytkownik **${aUser.tag}** został(a) zabity(a) przez **${message.author.tag}**!`).then(Message => {
            setTimeout(() => { Message.edit(`${bot.emojis.find(`name`, 'alert')} Trwa odradzanie...`); }, 1000);
            setTimeout(() => { Message.edit(`${bot.emojis.find(`name`, 'alert')} Użytkownik narodził się na nowo. Witamy ponownie, ${aUser.tag}.`); }, 1000);
        });
    }

    if(cmd === `${prefix}votekick`){
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " Nie posiadasz wymaganych uprawnień, musisz mieć rangę `MODERATOR`.");
        const agree    = "✅";
        const disagree = "❎";

        if (message.mentions.users.size === 0){
            return message.channel.send(`${bot.emojis.find(`name`, 'error')} ` + "Ehh... Musisz oznaczyć poprawnego użytkownika!");
        }
        
        let kickmember = message.guild.member(message.mentions.users.first());

        if(!kickmember){
            message.channel.send(`${bot.emojis.find(`name`, 'error')} ` + "Mmmm... Czy oznaczony użytkownik istnieje? Bo ja nie mogę go znaleźć.");
        }
        
        if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")){
            return message.reply(`${bot.emojis.find(`name`, 'error')} ` + "O nie! Wygląda na to, że nie mam wymaganych uprawnień, muszę dodatkowo posiadać `KICK_MEMBERS`, aby móc kontynuować.").catch(console.error);
        }
        
        let msg = await message.channel.send(`${bot.emojis.find(`name`, 'alert')} Głosowanie o wyrzucenie użytkownika **${kickmember}** z serwera, aby zagłosować kliknij w odpowiednią reakcję. (10 sek.)`);
        
        await msg.react(agree);
        await msg.react(disagree);
        
        const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 10000});
        
        msg.delete();
        
        var NO_Count = reactions.get(disagree).count;
        var YES_Count = reactions.get(agree);

        if(YES_Count == undefined){
            var YES_Count = 1;
        }else{
            var YES_Count = reactions.get(agree).count;
        }
        
        var sumsum = new Discord.RichEmbed()
        .addField("Głosowanie ukończone, oto wyniki:", `~~----------------------------------------~~\n${bot.emojis.find(`name`, 'error')} Głosy na NIE: ${NO_Count-1}\n${bot.emojis.find(`name`, 'success')} Głosy na TAK: ${YES_Count-1}\nUWAGA! Aby wyrzucić go(ją) potrzeba 3+ głosów\n~~----------------------------------------~~`)
        .setColor("RANDOM")
        
        await message.channel.send(sumsum);
        
        if(YES_Count >= 4 && YES_Count > NO_Count){
        
            kickmember.kick().then(member => {
                message.reply(`${bot.emojis.find(`name`, 'success')} ${member.user.username} została poprawnie wyrzucony(a).`)
        })
        
        }else{
        
        message.channel.send("\n" + `${bot.emojis.find(`name`, 'error')} Użytkownik nie został wyrzucony, czyżby zabrakło głosów?`);
        
        }
    }

    if(cmd === `${prefix}say`){
        //message.delete();
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " Nie posiadasz wymaganych uprawnień, musisz mieć rangę `JRMODERATOR`.");
        if (args[0].includes('@everyone')) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} Przepraszam bardzo, w tym celu bota nie użyjesz!`);
        if (args[0].includes('@here')) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} Przepraszam bardzo, w tym celu bota nie użyjesz!`);
        let sayMessage = args.join(" ");
        message.delete();
        message.channel.send(sayMessage);
    }

    if(cmd === `<@456018252158730250>`){
        message.channel.send(`${bot.emojis.find(`name`, 'question')} O co chodzi? Jeśli o mój prefix, proszę... oto on: ` + "`" + `${prefix}` + "`");
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${bot.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has mention the bot on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}ascii`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        ascii.font(args.join(' '), 'Doom', function(rendered) {
          rendered = rendered.trimRight();
    
          if(rendered.length > 2000) return message.channel.send(`${bot.emojis.find(`name`, 'error')} Wybrana wiadomość jest zadługa i nie można jej dać w stylu ascii.`);
          message.channel.send(rendered, {
            code: 'md'
          });
        })
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${bot.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **ascii** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    //if (!userData[sender.id]) userData[sender.id] = {
        //messagesSent: 0
    //}

   //userData[sender.id].messagesSent++;

    //fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        //if (err) console.error(err);
    //});

    //if (cmd === `${prefix}points`) {
        //var embed = new Discord.RichEmbed()
        //.setColor("RANDOM")
        //.setDescription(`${bot.emojis.find(`name`, 'alert')} You currently have **` + userData[sender.id].messagesSent + `** points on this server!`)
        //.setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`);
        //message.channel.send(embed);
    //}

    if(cmd === `${prefix}profile`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author;
        const userinfo = new Discord.RichEmbed()
        .setColor("FFA07A")
        .setAuthor(`${aUser.username}'s profile`, `https://cdn.discordapp.com/emojis/472480341299298304.png?v=1`)
        .setThumbnail(aUser.displayAvatarURL)
        .addField("ID:", `${aUser.id}`)
        .addField("Pseudonim:", `${aUser.nickname ? aUser.nickname : "None"}`)
        .addField("Konto utworzone:", `${moment.utc(aUser.createdAt).format('dd, Do MM YYYY')}`)
        .addField("Dołączył(a) do serwera:", `${moment.utc(aUser.joinedAt).format('dd, Do MM YYYY')}`)
        .addField("Czy jest botem:", `${aUser.bot}`)
        .addField("Status:", `${aUser.presence.status.replace("dnd", "Niedostępny")}`)
        .addField("Aktualna gra:", `${aUser.presence.game ? aUser.presence.game.name : 'Brak'}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Użyto przez ${message.author.tag}.`)
        message.channel.send(userinfo);
    }

    if(cmd === `${prefix}server` || cmd === `${prefix}server-info` || cmd === `${prefix}serverinfo`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);

        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setColor("FFA07A")
        .setAuthor(`${message.guild.name}`, `https://cdn.discordapp.com/emojis/473897310414176266.png?v=1`)
        .setThumbnail(sicon)
        //.addField("Name:", message.guild.name)
        .addField("Serwer utworzony:", `${moment.utc(message.guild.createdAt).format('dd, Do MM YYYY')}`)
        .addField("Dołączyłeś(aś):",`${moment.utc(message.author.joinedAt).format('dd, Do MM YYYY')}`)
        .addField("Liczba użytkoników:", message.guild.memberCount)
        .addField("Region:", `${message.guild.region.replace("eu-central", ":flag_eu: EU Central")}`)
        .addField("Kanały tekstowe:", message.guild.channels.findAll("type", "text").length)
        .addField("Kanały głosowe:", message.guild.channels.findAll("type", "voice").length)
        .addField("Liczba ról:", `${message.guild.roles.size}`)
        .addField("Emotki:", message.guild.emojis.size)
        .addField("Założyciel(ka):", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Użyto przez ${message.author.tag}.`);
    
        message.channel.send(serverembed);
    }

    if(cmd === `${prefix}channel`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " Nie posiadasz wymaganych uprawnień, musisz mieć rangę `JRADMIN`.");
        let channelname = args.slice(1).join(" ");
        let everyone = message.guild.roles.find(`name`, "@everyone");
        if(args[0] == 'lock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false }), message.channel.send(`${bot.emojis.find(`name`, 'success')} Wedle twojego życzenia zablokowałem kanał. Inni już nie mogą tu pisać.`);
        if(args[0] == 'unlock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: true, ADD_REACTIONS: true }), message.channel.send(`${bot.emojis.find(`name`, 'success')} Wedle twojego życzenia odblokowałem kanał. Inni znów mogą tu pisać.`);
        if(args[0] == 'setname') return message.channel.edit({ name: `${channelname}` }), message.channel.send(`${bot.emojis.find(`name`, 'success')} Nazwa kanału została zmieniona na: ${channelname}`);
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} The correct use of this command: ` + "`cb!channel <lock/unlock/setname>`.")
        //if(args[0] == 'setname') return message.channel.setName(channelname), message.channel.send(`${bot.emojis.find(`name`, 'success')} Mmm... You asked for a channel name change. It has been done! The new name of this channel is: **${channelname}**.`);
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${bot.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **channel** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

   // if(cmd === `${prefix}webhook`){
      //  let webhookid = args[0].split("/")[5]
      //  let webhooktoken = args[0].split("/")[6]
      //  const hook = new Discord.WebhookClient(webhookid, webhooktoken);
       // if(args[0] == 'create') return message.channel.createWebhook(args.join(" ").split(" | ")[0], args.join(" ").split(" | ")[1])
       // .then(webhook => message.author.send(`${bot.emojis.find(`name`, 'success')} Your webhook has been created! Link to him: https://canary.discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`))
       // .then(webhook => message.channel.send(`${bot.emojis.find(`name`, 'success')} Oh yes! Webhook on this server was created! See private messages for more information!`))
        //.catch(console.error);
        //if(args[0] == 'send') return hook.send(args.join(" ").slice(args[0].length));
        //if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')}` + " Oh no! An error occurred, did not you give the action? The correct usage is: `cb!webhook <create>`.");
    //}


    //fs.writeFile('Storage/suggestChannel.json', JSON.stringify(suggestChannel), (err) => {
        //if (err) console.error(err);
    //})

    if(cmd === `${prefix}eval`){
        //if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(message.author.id !== '396284197389729793') return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `developer` permissions, check them using `cb!permissions`.")
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')}` + " Please, give me the code. If you do not know how to use the command, use `cb!help eval`.")
        let result = eval(args.join(" ")).toString()
          let embed = new Discord.RichEmbed()
          //.setTitle("Eval")
          .addField(`${bot.emojis.find(`name`, 'jsonfile')} WEJŚCIE`, "```"+args.join(" ")+"```")
          .addField(`${bot.emojis.find(`name`, 'txt')} WYJŚCIE`, "```"+result+"```")
          .setColor("RANDOM")
          .setFooter(`Kod evalował(a) ${message.author.tag}`, `https://cdn.discordapp.com/emojis/472480341299298304.png?v=1`)
          message.channel.send(embed);
    }

    if(message.author.id === "396284197389729793"){
        if(cmd === `${prefix}botsetname`){
          let nowaNazwa = args.join(" ");
          bot.user.setUsername(nowaNazwa);
          console.log(`Nick został zmieniony.`);
          message.channel.send(`${bot.emojis.find(`name`, 'success')} The name of the bot has been changed to: **${nowaNazwa}**.`);
        }
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${bot.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **botsetname** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(message.author.id === "396284197389729793"){
        if(cmd === `${prefix}botsetavatar`){
          let nowyAvatar = args.join(" ");
          bot.user.setAvatar(nowyAvatar);
          console.log(`Avatar został zmieniony.`);
          message.channel.send(`${bot.emojis.find(`name`, 'success')} The avatar of the bot has been changed to: **${nowyAvatar}**.`);
        }
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${bot.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **botsetavatar** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}help`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        const helpmsg = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle('Moje komendy')
        .setDescription("Zobacz moje komendy poniżej, są naprawde fajne!")
        .addField('Podstawowe (5):', '`info`, `help`, ~~`serverlist`~~, `permissions`')
        .addField('Zabawa (6):', '`ascii`, `reverse`, `choose`, `avatar`, `hug`, `8ball`, `wheel`')
        .addField('Administracyjne (9):', '`ban`, ~~`kick`~~, `votekick`, `survey`, `addrole`, `removerole`, `channel`, `setprefix`, `setSuggestChannel`, `clear`')
        .addField('Zdjęcia (1):', '`cat`')
        .addField('Informacje (2):', '`serverinfo`, `userinfo`')
        .addField('Inne (1):', '`suggest`')
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`)
        if(!args[0]) return message.channel.send(helpmsg);
        if(args[0] == 'invite') return message.channel.send('Help with the **INVITE** command. \n```Usage: ' + `${prefix}invite` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'info') return message.channel.send('Help with the **INFO** command. \n```Usage: ' + `${prefix}info` + '``` \n**Aliases:** None \n**Description:** It will display information about the bot.');
        if(args[0] == 'help') return message.channel.send('Help with the **HELP** command. \n```Usage: ' + `${prefix}help` + '``` \n**Aliases:** None \n**Description:** Shows a list of bot commands.');
        if(args[0] == 'serverlist') return message.channel.send('Help with the **SERVERLIST** command. \n~~```Usage: ' + `${prefix}serverlist` + '```~~ \n~~**Aliases:** None \n**Description:** Displays a list of servers on which the bot is located.~~ ' + `\n${bot.emojis.find(`name`, 'alert')} ***__COMMAND DISABLED__*** ${bot.emojis.find(`name`, 'alert')}`);
        if(args[0] == 'permissions') return message.channel.send('Help with the **PERMISSIONS** command. \n```Usage: ' + `${prefix}permissions` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'ascii') return message.channel.send('Help with the **ASCII** command. \n```Usage: ' + `${prefix}ascii <text>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'reverse') return message.channel.send('Help with the **REVERSE** command. \n```Usage: ' + `${prefix}reverse <text>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'choose') return message.channel.send('Help with the **CHOOSE** command. \n```Usage: ' + `${prefix}choose <text1>;<text2>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'avatar') return message.channel.send('Help with the **AVATAR** command. \n```Usage: ' + `${prefix}avatar [<@user>]` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
        if(args[0] == 'hug') return message.channel.send('Help with the **HUG** command. \n```Usage: ' + `${prefix}hug <@user>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the bot and a link to invite it to your server!');
    }

    if(cmd === `${prefix}news`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let newsEmbed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle('Najnowsze Info')
        .setDescription(`-`)
        .setFooter('-')
        message.channel.send(newsEmbed);
    }

    if(cmd === `${prefix}ban`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send(":x: Musisz oznaczyć poprawnego uzytkownika!");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " Nie posiadasz wymaganych uprawnień, musisz mieć rangę `MODERATOR`.");
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: Ten użytkownik nie może zostać zbanowany!");
        if(!args[0]) return message.channel.send(`Nie podałeś powodu bana? Lub użytkownika? Więc bana nie ma :grinning:.`);
    
        const banEmbed = new Discord.RichEmbed()
        //.setDescription("WARN")
        //.setAuthor(`[BAN] ${bUser.tag}`, bUser.displayAvatarURL)
        .setColor("#9b0090")
        //.addField("Warned user:", `${wUser}`)
        .addField("Zbanowany(a):", bUser)
        .addField("Kanał:", message.channel)
        //.addField("O godzinie", moment(message.createdAt).format("YYYY.MM.DD, HH:mm:ss"))
        .addField("Moderator:", message.author.tag)
        .addField("Powód:", bReason)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Zbanowany(a) na ${message.guild.name}.`)
    
        let banChannel = message.guild.channels.find(`name`, "➕-bany");
        if(!banChannel) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} The '**modlogs**' channel does not exist, but the **${bUser}** user got the ban anyway!`);

        message.channel.send(`${bot.emojis.find(`name`, 'success')} Użytkownik ${bUser} został zbanowany za ${bReason}.`)
        message.guild.member(bUser).ban(bReason);
        banChannel.send(banEmbed);
    
        //let logiKomend = bot.channels.get("458569305341296641");
        //logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **ban** na serwerze **${message.guild.name}**, zbanował **${bUser}** za **${bReason}**.`);
        return;
    }

    if(cmd === `${prefix}serverlist9929319238109310901931039010930190391903`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        const guildArray = bot.guilds.map((guild) => {
          return `${guild.name}`
        })
      
        let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("A full list of servers on which the bot is:", guildArray.join(", "))
        .setFooter(`There are ${bot.guilds.size} servers in total.`, 'https://cdn.discordapp.com/emojis/472688143389425665.png?v=1')
        
        message.channel.send(embed);
      
    }

    if(cmd === `${prefix}serverlist`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        message.channel.send(`${bot.emojis.find(`name`, 'alert')} ***__COMMAND DISABLED__*** ${bot.emojis.find(`name`, 'alert')}`);
    }

    if(cmd === `${prefix}permissions`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if (message.author.id === '396284197389729793') return message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `Creator of CookieBOT` (5)");
        if (message.author.id === '372026600989917195') return message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `Global Support` (4)")
        if (message.guild.owner) return message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `Server Owner` (3)");
        if (message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `Server Admin` (2)");
        //if (message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `Manage Server` (1)");

        message.channel.send(`${bot.emojis.find(`name`, 'pass')}` + " Your permission level is: `User` (0)");
    }

    if(cmd === `${prefix}removerole`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let rMember = message.guild.member(message.mentions.users.first()) ||  message.guild.members.get(args[0]);
        if(!rMember) return message.channel.send(`${bot.emojis.find(`name`, 'error')} You must enter the correct user!`);
        let role = args.join(" ").slice(22);
        if(!role) return message.channel.send(`${bot.emojis.find(`name`, 'error')} You must provide a role (give its name, it can not be a mention)`);
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.channel.send(`${bot.emojis.find(`name`, 'error')} The role you entered was not found.`);

        if(!rMember.roles.has(gRole.id)) return message.reply('On nie ma tej roli.');
        await(rMember.removeRole(gRole.id));

        try{
            await rMember.send(`${bot.emojis.find(`name`, 'alert')} You lost the role named **${gRole.name}** on the **${message.guild.name}** server!`)
            await message.channel.send(`${bot.emojis.find(`name`, 'success')} You have remove **${gRole.name}** role for **<@${rMember.id}>** user!`);
        }catch(error){
            console.log(error);
        }
    }

    if(cmd === `${prefix}addrole`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!rMember) return message.channel.send(`${bot.emojis.find(`name`, 'error')} You must enter the correct user!`);
        let role = args.join(" ").slice(22);
        //if(!args[1]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} You must provide a role (give its name, it can not be a mention)`);
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.channel.send(`${bot.emojis.find(`name`, 'error')} The role you entered was not found.`);

        if(rMember.roles.has(gRole.id)) return;
        await(rMember.addRole(gRole.id));

        try{
            rMember.send(`${bot.emojis.find(`name`, 'alert')} You have received a rank called **${gRole.name}** on the **${message.guild.name}** server!`)
            message.channel.send(`${bot.emojis.find(`name`, 'success')} The role named **${gRole.name}** has been successfully assigned to the **<@${rMember.id}>** user!`)
        }catch(error){
            console.log(error);
        }
    }


    if(cmd === `${prefix}info`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        const infoembed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField('Bot username:', `${bot.user.tag}`)
        .addField('Creator:', 'xCookieTM#9613')
        .addField('Library:', 'discord.js')
    }

    if(cmd === `${prefix}avatar`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let avEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        //.setDescription(`Avatar ${aUser.username}:`)
        //.setThumbnail(aUser.displayAvatarURL)
        .setDescription(`${bot.emojis.find(`name`, 'user')} Avatar ${aUser.username}:`)
        .setImage(aUser.displayAvatarURL)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`);
        message.channel.send(avEmbed);
        return;
    }

    if(cmd === `${prefix}hug`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let huglinks = ["https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif", "https://media.giphy.com/media/xT39CXg70nNS0MFNLy/giphy.gif", "https://media.giphy.com/media/143v0Z4767T15e/giphy.gif", "https://media.giphy.com/media/BVRoqYseaRdn2/giphy.gif", "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif"];
        let math = Math.floor((Math.random() * huglinks.length));
        let hugEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`${bot.emojis.find(`name`, 'like1')} Użytkownik ${message.author.tag} przytulił(a) ${aUser.tag}.`)
        .setImage(huglinks[math])

        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} Kogo chcesz przytulić?`);
        message.channel.send(hugEmbed);
    }

    if(cmd === `${prefix}kiss`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let kisslinks = ["https://media.giphy.com/media/4dCj46k0Qtyxy/giphy.gif", "https://media.giphy.com/media/bCY7hoYdXmD4c/giphy.gif", "https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif", "https://media.giphy.com/media/5GdhgaBpA3oCA/giphy.gif", "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif", "https://media.giphy.com/media/Ka2NAhphLdqXC/giphy.gif", "https://media.giphy.com/media/QGc8RgRvMonFm/giphy.gif"];
        let math = Math.floor((Math.random() * kisslinks.length));
        let kissEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`${bot.emojis.find(`name`, 'like1')} Użytkownik ${message.author.tag} pocałował(a) ${aUser.tag}.`)
        .setImage(kisslinks[math])

        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} Kogo chcesz pocałować?`);
        if(args[0] == `<@${message.author.id}>`) return message.channel.send('Samego siebie nie pocałujesz!')
        message.channel.send(kissEmbed);
    }

    if(cmd === `${prefix}pat`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let patlinks = ["https://media.giphy.com/media/ye7OTQgwmVuVy/giphy.gif", "https://media.giphy.com/media/L2z7dnOduqEow/giphy.gif", "https://media.giphy.com/media/109ltuoSQT212w/giphy.gif", "https://media.giphy.com/media/osYdfUptPqV0s/giphy.gif", "https://media.giphy.com/media/osYdfUptPqV0s/giphy.gif", "https://media.giphy.com/media/SvQ7tWn8zeY2k/giphy.gif"];
        let math = Math.floor((Math.random() * patlinks.length));
        let patEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`${bot.emojis.find(`name`, 'like1')} Użytkownik ${message.author.tag} poklepał(a) ${aUser.tag}.`)
        .setImage(patlinks[math])

        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} Kogo chcesz poklepać?`);
        if(args[0] == `<@${message.author.id}>`) return message.channel.send('Samego siebie nie poklepiesz!')
        message.channel.send(patEmbed);
    }

    if(cmd === `${prefix}survey` || cmd === `${prefix}vote`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You do not have sufficient permissions to create a survey.");
        const ankietaMessage = args.join(" ");
        //let ankieta = await message.channel.send(ankietaEmbed);
        let ankietaEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`New survey`, `https://cdn.discordapp.com/emojis/472694503229358080.png?v=1`)
        .setDescription(ankietaMessage)
        .setFooter(`The survey was created by ${message.author.tag}`);
    
        let ankieta = await message.channel.send(ankietaEmbed);
        ankieta.react(bot.emojis.find(`name`, 'success'));
        ankieta.react(bot.emojis.find(`name`, 'error'));
        message.delete();
        return;
    }

    if (cmd.includes('Japierdole')) {
        //if (message.author.id === '396284197389729793') return;
        message.delete();
        var lol = await message.reply('Napisane slowo zostalo zablokowane! Slowo: ```Slowo wyslane w prywatnych wiadomosciach```')
        lol.delete(10000)
    }

    if(cmd === `${prefix}reverse`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!args[0]) return message.channel.send(':x: You must enter some text!');
        if (args[0].includes('enoyreve@')) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} You will not use a bot for this purpose! You are not a good user!`);
        if (args[0].includes('ereh@')) return message.channel.send(`${bot.emojis.find(`name`, 'alert')} You will not use a bot for this purpose! You are not a good user!`);
    
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
        let sreverse = reverseString(args.join(' '))
        //if(sreverse === '@here' || sreverse === '@everyone' || sreverse === `https://discord.gg/${invite.code}`) return message.channel.send("Nie możesz tego odwrócić!")
        if(args[0] === sreverse) {
        sreverse = `${args.join(' ')} [it comes out the same ;(]`
        }
        message.channel.send(`${bot.emojis.find(`name`, 'repeat')} Inverted text: **${sreverse}**`);
    }

    if(cmd === `${prefix}cat`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let catlinks = ["https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", "https://media.giphy.com/media/l1J3pT7PfLgSRMnFC/giphy.gif", "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", "https://media.giphy.com/media/6uMqzcbWRhoT6/giphy.gif", "https://media.giphy.com/media/nNxT5qXR02FOM/giphy.gif", "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif", "https://media.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif", "https://media.giphy.com/media/Q56ZI04r6CakM/giphy.gif"];
        let math = Math.floor((Math.random() * catlinks.length));
        let catEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`${bot.emojis.find(`name`, 'cat')} Random cat`, `Here is one of my random cats:`)
        .setImage(catlinks[math])
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | ${message.author.tag}`);
    
        message.channel.send(catEmbed);
    }

    if(cmd === `${prefix}wheel`){
        let arrows = [":arrow_up:", ":arrow_down:", ":arrow_left:", ":arrow_down:"]
        let math = Math.floor((Math.random() * arrows.length));
        const embed = new Discord.RichEmbed()
        .setDescription(`:cookie:    :banana:     :peach:\n \n:ice_cream:    ${arrows[math]}   :tomato:\n \n:tangerine:     :cherries:     :grapes:`)
        message.channel.send(embed);
    }

    if(cmd === `${prefix}8ball`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        //if(!args[2]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} Please, give me the full question!`);
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} Ahh... You did not give a question, can I know why?`);
        let replies = ["Yes of course...", "Sorry but no...", "How can I know that?", "You can ask later?", "Mmm... No."];
    
        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");
    
        let ballembed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
        .setColor("RANDOM")
        .setDescription(question)
        //.addField("Pytanie", question)
        .addField("Answer:", replies[result])
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | ${message.author.tag}`);
    
        message.channel.send(ballembed);
        return;
    }

    if(cmd === `${prefix}profilei23289239829832983`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let aUser = message.mentions.users.first() || message.author;
        const profileEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`${bot.emojis.find(`name`, 'user')} ${aUser.username}'s profile`, `Username: ${aUser.username} \nDiscriminator: ${aUser.discriminator} \nGlobal points: 0 \nServer points: 0`)
        message.channel.send(profileEmbed);
    }


    if(cmd === `${prefix}choose`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        var odp = Math.floor(Math.random() *2) + 1
        var a = args.join(" ").split(";")[0]
        var b = args.join(" ").split(";")[1]
        var odp2
        switch(odp) {
          case 1:
          odp2 = a;
          break;
      
          case 2:
          odp2 = b;
        }
        let messagechoose = await message.channel.send(`${bot.emojis.find(`name`, 'thinke')} Hmm...`)
        messagechoose.edit(`${bot.emojis.find(`name`, 'chat')} So, I choose: **${odp2}**`)
    }

    if(cmd === `${prefix}clear`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MESSAGES` permissions, check them using `cb!permissions`.");
    
        let messagecount = parseInt(args.join(' '));
        message.channel.fetchMessages({
          limit: messagecount
        }).then(messages => message.channel.bulkDelete(messages));
        let purgeSuccessMessage = await message.channel.send(`${bot.emojis.find(`name`, 'success')} As you wish, I cleaned the **${messagecount}** messages!`);
        purgeSuccessMessage.delete(10000);
    }

    if(cmd === `${prefix}ping`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        const m = await message.channel.send("Ping :ping_pong: ");
        m.edit(`:ping_pong: Pong! ${m.createdTimestamp - message.createdTimestamp}ms. API is ${Math.round(bot.ping)}ms`);
    }

    if(cmd === `${prefix}setprefix`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_SERVER` permissions.");
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} An error occurred, apparently you did not enter a value. Use **${prefix}help setprefix** for help.`);

        let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

        prefixes[message.guild.id] = {
            prefixes: args[0]
        }

        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
            if (err) console.error(err);
        });

        let sEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle('Zapisano!')
        .setDescription(`Prefix dla serwera został zmieniony na: ${args[0]}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Zmieniono przez ${message.author.tag}.`)

        message.channel.send(sEmbed);
    }

    if(cmd === `${prefix}setSuggestChannel`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_SERVER` permissions.");
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'lock')} An error occurred, apparently you did not enter a value. Use **${prefix}help** setprefix for help.`);

        let sChannelName = message.guild.channels.find(`name`, args.join(" "));
        if(!sChannelName) return message.channel.send(`${bot.emojis.find(`name`, 'error')} The channel specified does not exist!`);

        let suggestChannels = JSON.parse(fs.readFileSync("./suggestChannels.json", "utf8"));

        suggestChannels[message.guild.id] = {
            suggestChannels: args[0]
        }

        fs.writeFile("./suggestChannels.json", JSON.stringify(suggestChannels), (err) => {
            if (err) console.error(err);
        });

        let sEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle('Zapisano!')
        .setDescription(`Kanał sugestii został ustawiony na: ${args[0]}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Zmieniono przez ${message.author.tag}.`)

        message.channel.send(sEmbed);
    }

    if(cmd === `${prefix}settings`){
        if(!args[0]) return message.channel.send("```List of settings for the server: \n[1] prefix \n[2] suggestChannel```" + `If you want to set, enter ` + "`" + `${prefix}settings <->` + "`.")
    }

    if(cmd === `${prefix}suggest`){
        if(konfiguracja.commands === "disabled") return message.channel.send(`${bot.emojis.find(`name`, 'error')} All commands in the bot have been disabled!`);
        let suggestContent = args.join(" ");
        if(!args[0]) return message.channel.send(`${bot.emojis.find(`name`, 'error')} What is your suggestion? Because from what I see it is nothing.`)
        const suggestEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(suggestContent)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Suggestion writed by ${message.author.tag}.`);
        message.guild.channels.find(`name`, `${suggestChannel}`).send(suggestEmbed);
        message.channel.send(`${bot.emojis.find(`name`, 'success')} Suggestion has been successfully sent!`)
    }

    if(message.author.id === "396284197389729793"){
        if(cmd === `${prefix}rich`){
          //if(message.author.id !== "396284197389729as93") return message.channel.send("Nie tego!");
        let stream = args.slice(1).join(" ");
        let game = args.slice(1).join(" ");
        let listen = args.slice(1).join(" ");
        let watch = args.slice(1).join(" ");
        let reset = args.slice(1).join(" ");
          if(!args[0]) return message.channel.send(':x: You must provide a value! Correct use: `cb!rich <game/stream/watch/listen> <text>`');
          if(args[0] == 'game') return bot.user.setActivity(game),  message.channel.send(`${bot.emojis.find(`name`, 'alert')} Bot started playing in **${game}**.`);
            //message.channel.send(`:wink: Bot zaczął grać w **${game}**.`);
        //let stream = args.slice(1).join(" ");
          if(args[0] == 'stream') return bot.user.setGame(`${stream}`, 'https://twitch.tv/xcookietm'), message.channel.send(`${bot.emojis.find(`name`, 'alert')} Bot started broadcasting live **${stream}**.`);
            //message.channel.send(`:wink: Bot zaczął nadawać na żywo **${stream}**.`);
          if(args[0] == 'listen') return bot.user.setActivity(`${listen}`, {type: 'LISTENING'}), message.channel.send(`${bot.emojis.find(`name`, 'alert')} Bot started to listen **${listen}**.`);
          if(args[0] == 'watch') return bot.user.setActivity(`${watch}`, {type: 'WATCHING'}), message.channel.send(`${bot.emojis.find(`name`, 'alert')} Bot began to watch **${watch}**.`);
          if(args[0] == 'reset') return bot.user.setActivity(`${reset}`), message.channel.send(`${bot.emojis.find(`name`, 'alert')} The status of the bot has been reset.`);
          if(args[0] == 'servers') return bot.user.setActivity(`${bot.guilds.size} servers`), message.channel.send(`${bot.emojis.find(`name`, 'alert')} The status of the bot has been set to the number of servers.`);
        }
    }

    if(cmd === `${prefix}ticket`){
        let everyone = message.guild.roles.find(`name`, "@everyone");
        let ticketCreator = message.guild.members.find(`id`, `${message.author.id}`)
        let helpText = args.join(" ");
        let newTicketChannel = await message.guild.createChannel(`request-${message.author.id}`);
        let ticketEmbed = new Discord.RichEmbed()
        .addField('Request for help!', `**CREATED BY:** ${message.author.tag} \n**CONTENT:** ${helpText} \nAfter completing the help, the administration or the user waiting for help should react to the react below.`)
        let tChanelSend = await newTicketChannel.send(ticketEmbed);
        let reactChannel = await tChanelSend.react(bot.emojis.find(`name`, 'success')).then(em => { message.channel.send('lol') });
        newTicketChannel.overwritePermissions(everyone, { SEND_MESSAGES: false, READ_MESSAGES: false });
        newTicketChannel.overwritePermissions(ticketCreator, { SEND_MESSAGES: true, READ_MESSAGES: true })
        message.channel.send(`${bot.emojis.find(`name`, 'success')} Your request for help is ready, wait for a response from the administration on the **${newTicketChannel}** channel`);
        const filter = (reaction, user) => (reaction.emoji.name === '🇦') && user.id === message.author.id
        const collector = tChannelSend.createReactionCollector(filter);
        collector.on('collect', r => {
            if (r.emoji.name === "🇦") {
                message.channel.send('lOl');
            }
        });
    }

    if(cmd === `${prefix}warn`){
        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        //if (args[0] == `${message.author.bot}`) return;
        if (args[0] == `${message.author}`) return message.channel.send(`${bot.emojis.find(`name`, 'error')} You can not give yourself a warn!`)
        let wUser = message.mentions.users.first();
        if (!wUser) return message.channel.send(`${bot.emojis.find(`name`, 'error')} Is this user exists? Because I can not find him!`);
        const reason = args.join(" ").slice(22);

        if (!warns[wUser.id]) {
            warns[wUser.id] = {
                warns: 0
            };
        }

        warns[wUser.id].warns++;

        fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
            if (err) console.log(err);
        });

        const warnEmbed = new Discord.RichEmbed()
        //.setDescription("WARN")
        .setAuthor(`[OSTRZEZENIE] ${wUser.tag}`, wUser.displayAvatarURL)
        .setColor("#9b0090")
        //.addField("Warned user:", `${wUser}`)
        .addField("Kanał:", message.channel)
        //.addField("O godzinie", moment(message.createdAt).format("YYYY.MM.DD, HH:mm:ss"))
        .addField("Numer ostrzeżeń:", warns[wUser.id].warns)
        .addField("Moderator:", message.author.tag)
        .addField("Powód:", reason)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Ostrzeżony na ${message.guild.name}.`)

        const warnchannel = message.guild.channels.find("name", "➕-ostrzezenia");
        if (!warnchannel) return message.reply(`${bot.emojis.find(`name`, 'error')} The 'modlogs' channel does not exist! Create it, otherwise I will not give a warning!`);
        warnchannel.send(warnEmbed);

        if (warns[wUser.id].warns === 15) {
            message.guild.member(wUser).ban(reason);
            message.channel.send(`${bot.emojis.find(`name`, 'alert')} Użytkownik ${wUser.tag} został(a) zbanowany(a) za osiągnięcie maksymalnej ilości ostrzeżeń (15).`);
        }

        message.channel.send(`${bot.emojis.find(`name`, 'success')} Użytkownik **${wUser.tag}** został ostrzeżony za **${reason}**!`);

    };

    if(cmd === `${prefix}warns`){
        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply(`${bot.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let wUser = message.mentions.users.first();
        if (!wUser) return message.reply(`${bot.emojis.find(`name`, 'error')} Is this user exists? Because I can not find him!`);
        const warns = warns[wUser.id].warns;
        let warnsEmbed = new Discord.RichEmbed()
        .addField(`User:`, wUser.tag)
        .addField(`Number of warnings:`, warns)
        message.channel.send(warnsEmbed);
    }
    
    if(cmd === `${prefix}partnere`){
        const pEmbed = new Discord.RichEmbed()
        .addField("PARTNER #1", ":hibiscus: Interesujesz się Azją?\n:rice_ball: lub azjatycką kuchnią?\n:cherry_blossom: Lubisz anime, k-pop, koreańskie dramy, chińskie seriale czy japońskie reality show?\n:dagger: Chcesz popełnić Seppuku?\n:dango: Twój dziadek walczył w Wietnamie?\n:shinto_shrine: Fascynuje Cie Singapur, a może po prostu jesteś fanem chińskiej architektury?\n \n*Jeśli choć trochę interesujesz się dalekim wschodem, zapraszamy na AsianCulture!!!*\n:flag_jp: :flag_kr: :flag_kp: :flag_cn: :flag_vn: :flag_ph: :flag_my: :flag_sg: :flag_th: :flag_la: :flag_kh: :flag_tw: :flag_id: :flag_mm:")
        .addField("Link:", "https://discord.gg/VKNxGEE")
        .setImage("https://cdn.discordapp.com/attachments/460669749148516355/461072328781070337/AsianCultureBanner-1-1.png")
        .setFooter("Partner: Egzoster#5485")
        message.channel.send(pEmbed);
    }
    
    if(cmd === `${prefix}partnerwym`){
        const pEmbed = new Discord.RichEmbed()
        .addField("Wymagania na partnerstwo", `${bot.emojis.find(`name`, 'success')} Min. 50 osób na serwerze,\n${bot.emojis.find(`name`, 'success')} Serwer musi być aktywny,\n${bot.emojis.find(`name`, 'success')} Serwer musi mieć dobrą opinię,\n${bot.emojis.find(`name`, 'success')} Serwer nie może reklamować się w prywatnych wiadomościach, na kanałach na innych serwerach bez zezwolenia, oraz nalatywać na inne serwery w celu reklamy.`)
        .addField("Zainteresowany(a) partnerstwem?", "Napisz do xCookieTM#9613!")
        .setFooter("Jeśli nie spełniasz wymagań to nie pisz do nas w celu partnerstwa!")
        message.channel.send(pEmbed);
    }
    
});

//let everyone = message.guild.roles.find(`name`, "@everyone");
//if(args[0] == 'lock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false }), message.channel.send(`${bot.emojis.find(`name`, 'success')} Okay, according to your wishes, I blocked this channel! Others can not write here.`);

bot.login(process.env.TOKEN);
