import fetch from 'node-fetch';

let handler = async (m, { conn, command, args, usedPrefix, isOwner }) => {
  switch (command) {
    case 'listusr': {
      let page = args[0] || '1';
      let res = await fetch(`${domain}/api/application/users?page=${page}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
      }).then(res => res.json());

      let users = res.data;
      let messageText = 'Berikut list user:\n\n';

      for (let user of users) {
        let u = user.attributes;
        messageText += `ID: ${u.id} - Status: ${u.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
        messageText += `${u.username}\n`;
        messageText += `${u.first_name} ${u.last_name}\n\n`;
      }

      messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
      messageText += `Total Users: ${res.meta.pagination.count}`;

      await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });

      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
        m.reply(`Gunakan perintah ${usedPrefix}listusr ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
      }
      break;
    }
    
    
    case 'delsrv': {
      let srv = args[0];
      if (!srv) return m.reply('Nama Server apa?');

      let f = await fetch(`${domain}/api/application/servers/${srv}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
      });

      let res = f.ok ? { errors: null } : await f.json();
      if (res.errors) return m.reply('*SERVER NOT FOUND*');
      m.reply('*SUCCESSFULLY DELETE THE SERVER*');
      break;
    }
    
    case "createadmin": {
  if (!isOwner) return m.reply("Maaf Fitur Ini Hanya Bisa Digunakan Oleh Owner");

  let text = args.join(' '); 
  let s = text.split(',');
  let email = s[0];
  let username = s[0];
  let nomor = s[1];

  if (s.length < 2) return m.reply(`*Format salah!*
Penggunaan:
${usedPrefix + command} user,nomer`);

  if (!username) return m.reply(`Ex : ${usedPrefix + command} Username,@tag/nomor\n\nContoh :\n${usedPrefix + command} example,@user`);
  if (!nomor) return m.reply(`Ex : ${usedPrefix + command} Username,@tag/nomor\n\nContoh :\n${usedPrefix + command} example,@user`);

  let password = username + "46093";
  let nomornya = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  let f = await fetch(domain + "/api/application/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey
    },
    body: JSON.stringify({
      email: username + "@gmail.com",
      username: username,
      first_name: username,
      last_name: "Memb",
      language: "en",
      root_admin: true,
      password: password.toString()
    })
  });

  let data = await f.json();

  if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));

  let user = data.attributes;

  let tks = `TYPE: user

📡ID: ${user.id}
🌷UUID: ${user.uuid}
👤USERNAME: ${user.username}
📬EMAIL: ${user.email}
🦖NAME: ${user.first_name} ${user.last_name}
🔥LANGUAGE: ${user.language}
📊ADMIN: ${user.root_admin}
☢️CREATED AT: ${user.created_at}

🖥️LOGIN: ${domain}
`;

  await conn.sendMessage(m.chat, { text: tks });
  await conn.sendMessage(nomornya, {
    text: `*BERIKUT DETAIL AKUN ADMINPANEL ANDA*\n
USERNAME :${username}
PASSWORD: ${password}
LOGIN: ${domain}

*NOTE : OWNER HANYA MENGIRIM 1X DATA AKUN ANDA MOHON DI SIMPAN BAIK BAIK KALAU DATA AKUN ANDA HILANG OWNER TIDAK DAPAT MENGIRIM AKUN ANDA LAGI*`
  });
}
break;
         case "listadmin": {
  if (!isOwner) return m.reply(`Maaf, Anda tidak dapat melihat daftar pengguna.`);
  let page = args[0] ? args[0] : '1';
  let f = await fetch(domain + "/api/application/users?page=" + page, {
  "method": "GET",
  "headers": {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": "Bearer " + apikey
  }
  });
  let res = await f.json();
  let users = res.data;
  let messageText = "Berikut list admin:\n\n";
  
  for (let user of users) {
  let u = user.attributes;
  if (u.root_admin) {
  messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
  messageText += `${u.username}\n`;
  messageText += `${u.first_name} ${u.last_name}\n\n`;
  }
  }
  
  messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
  messageText += `Total Admin: ${res.meta.pagination.count}`;
  
  await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });
  
  if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
  m.reply(`Gunakan perintah ${_p}listadmin ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
  }
  }
  break;
              case 'suspend': {
      if (!isOwner) return m.reply(`Khusus Ownerku`)
      let srv = args[0]
      if (!srv) return m.reply('ID nya mana?')
      let f = await fetch(domain + "/api/application/servers/" + srv + "/suspend", {
          "method": "POST",
          "headers": {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
          }
      })
      let res = f.ok ? {
          errors: null
      } : await f.json()
      if (res.errors) return m.reply('*SERVER NOT FOUND*')
      m.reply('*BERHASIL SUSPEND..*')
  }
      break
      case 'unsuspend': {
      if (!isOwner) return m.reply (`Khusus Ownerku`)
      let srv = args[0]
      if (!srv) return m.reply('ID nya mana?')
      let f = await fetch(domain + "/api/application/servers/" + srv + "/unsuspend", {
          "method": "POST",
          "headers": {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apikey
          }
      })
      let res = f.ok ? {
          errors: null
      } : await f.json()
      if (res.errors) return m.reply('*SERVER NOT FOUND*')
     m.reply('*BERHASIL BUKA SUSPEND..*')
  }
      break
        case "startsrv":
        case "stopsrv":
        case "restartsrv": {
            let action = command.replace("srv", "")
            if (!isOwner) return global.dfail("rowner", m, conn)
            let srv = args[0]
            if (!srv) return m.reply("ID nya mana?")
            let f = await fetch(domain + "/api/client/servers/" + srv + "/power", {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + c_apikey,
                },
                "body": JSON.stringify({
                    "signal": action
                })
            })

            let res = f.ok ? {
                errors: null
            } : await f.json()
            if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))
            m.reply(`*Sukses ${action.toUpperCase()} THE SERVER*`)
        }
    break
    case 'listsrv': {
      let page = args[0] || '1';
      let res = await fetch(`${domain}/api/application/servers?page=${page}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
      }).then(res => res.json());

      let servers = res.data;
      let messageText = 'Berikut adalah daftar server:\n\n';

      for (let server of servers) {
        let s = server.attributes;

        let f3 = await fetch(`${domain}/api/client/servers/${s.uuid.split('-')[0]}/resources`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${capikey}`,
          },
        });

        let data = await f3.json();
        let status = data.attributes ? data.attributes.current_state : s.status;

        messageText += `ID Server: ${s.id}\n`;
        messageText += `Nama Server: ${s.name}\n`;
        messageText += `Status: ${status}\n\n`;
      }

      messageText += `Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
      messageText += `Total Server: ${res.meta.pagination.count}`;

      await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });

      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
        m.reply(`Gunakan perintah ${usedPrefix}listsrv ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
      }
      break;
    }
  }
};

handler.command = ["listusr","delsrv","listsrv","createadmin","addusr","suspend","unsuspend", "delusr", "listadmin", "addsrv", "reinstall", "updatesrv", "startsrv", "stopsrv", "restartsrv"];
handler.help = handler.command;
handler.tags = ['panel'];
handler.owner = true;

export default handler;