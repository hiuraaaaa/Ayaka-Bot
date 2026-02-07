
let handler = async(m, { conn, text }) => {

let user = global.db.data.users[m.sender];

let armorList = `
*[🧥 LEVEL ARMOR ]*

1. 🛡️ Leather Armor ${user.armor == 1 ? '✓' : ''}
2. 🛡️ Padded Armor ${user.armor == 2 ? '✓' : ''}
3. 🛡️ Studded Leather Armor ${user.armor == 3 ? '✓' : ''}
4. 🛡️ Chainmail Armor ${user.armor == 4 ? '✓' : ''}
5. 🛡️ Scale Armor ${user.armor == 5 ? '✓' : ''}
6. 🛡️ Breastplate ${user.armor == 6 ? '✓' : ''}
7. 🛡️ Half Plate Armor ${user.armor == 7 ? '✓' : ''}
8. 🛡️ Full Plate Armor ${user.armor == 8 ? '✓' : ''}
9. 🛡️ Mithril Armor ${user.armor == 9 ? '✓' : ''}
10. 🛡️ Adamantine Armor ${user.armor == 10 ? '✓' : ''}
11. 🛡️ Dragonhide Armor ${user.armor == 11 ? '✓' : ''}
12. 🛡️ Celestial Armor ${user.armor == 12 ? '✓' : ''}
13. 🛡️ Demonic Armor ${user.armor == 13 ? '✓' : ''}
14. 🛡️ Divine Armor ${user.armor == 14 ? '✓' : ''}
15. 🛡️ Ethereal Armor ${user.armor == 15 ? '✓' : ''}
16. 🛡️ Elemental Armor ${user.armor == 16 ? '✓' : ''}
17. 🛡️ Phantom Armor ${user.armor == 17 ? '✓' : ''}
18. 🛡️ Ancient Armor ${user.armor == 18 ? '✓' : ''}
19. 🛡️ Legendary Armor ${user.armor == 19 ? '✓' : ''}
20. 🛡️ Godslayer Armor ${user.armor == 20 ? '✓' : ''}
`;

conn.reply(m.chat, armorList, m);
}
handler.tags = ['rpg']
handler.help = ['listarmor']
handler.command = /^(listarmor)/i

export default handler;