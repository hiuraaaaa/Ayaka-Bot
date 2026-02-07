import db from '../lib/database.js'
import { canLevelUp } from '../lib/levelling.js'
import can from 'knights-canvas'

export async function before(m) {
  let user = global.db.data.users[m.sender]
  if (!user.autolevelup) return !0

  let before = user.level * 1
  while (canLevelUp(user.level, user.exp, global.multiplier))
    user.level++

  if (user.level <= 2) {
    user.role = 'Newbie ㋡'
  } else if (user.level <= 4) {
    user.role = 'Beginner Grade 1 ⚊¹'
  } else if (user.level <= 6) {
    user.role = 'Beginner Grade 2 ⚊²'
  } else if (user.level <= 8) {
    user.role = 'Beginner Grade 3 ⚊³'
  } else if (user.level <= 10) {
    user.role = 'Beginner Grade 4 ⚊⁴'
  } else if (user.level <= 12) {
    user.role = 'Private Grade 1 ⚌¹'
  } else if (user.level <= 14) {
    user.role = 'Private Grade 2 ⚌²'
  } else if (user.level <= 16) {
    user.role = 'Private Grade 3 ⚌³'
  } else if (user.level <= 18) {
    user.role = 'Private Grade 4 ⚌⁴'
  } else if (user.level <= 20) {
    user.role = 'Private Grade 5 ⚌⁵'
  } else if (user.level <= 22) {
    user.role = 'Corporal Grade 1 ☰¹'
  } else if (user.level <= 24) {
    user.role = 'Corporal Grade 2 ☰²'
  } else if (user.level <= 26) {
    user.role = 'Corporal Grade 3 ☰³'
  } else if (user.level <= 28) {
    user.role = 'Corporal Grade 4 ☰⁴'
  } else if (user.level <= 30) {
    user.role = 'Corporal Grade 5 ☰⁵'
  } else if (user.level <= 32) {
    user.role = 'Sergeant Grade 1 ≣¹'
  } else if (user.level <= 34) {
    user.role = 'Sergeant Grade 2 ≣²'
  } else if (user.level <= 36) {
    user.role = 'Sergeant Grade 3 ≣³'
  } else if (user.level <= 38) {
    user.role = 'Sergeant Grade 4 ≣⁴'
  } else if (user.level <= 40) {
    user.role = 'Sergeant Grade 5 ≣⁵'
  } else if (user.level <= 42) {
    user.role = 'Staff Grade 1 ﹀¹'
  } else if (user.level <= 44) {
    user.role = 'Staff Grade 2 ﹀²'
  } else if (user.level <= 46) {
    user.role = 'Staff Grade 3 ﹀³'
  } else if (user.level <= 48) {
    user.role = 'Staff Grade 4 ﹀⁴'
  } else if (user.level <= 50) {
    user.role = 'Staff Grade 5 ﹀⁵'
  } else if (user.level <= 52) {
    user.role = 'Sergeant Grade 1 ︾¹'
  } else if (user.level <= 54) {
    user.role = 'Sergeant Grade 2 ︾²'
  } else if (user.level <= 56) {
    user.role = 'Sergeant Grade 3 ︾³'
  } else if (user.level <= 58) {
    user.role = 'Sergeant Grade 4 ︾⁴'
  } else if (user.level <= 60) {
    user.role = 'Sergeant Grade 5 ︾⁵'
  } else if (user.level <= 62) {
    user.role = '2nd Lt. Grade 1 ♢¹'
  } else if (user.level <= 64) {
    user.role = '2nd Lt. Grade 2 ♢²'
  } else if (user.level <= 66) {
    user.role = '2nd Lt. Grade 3 ♢³'
  } else if (user.level <= 68) {
    user.role = '2nd Lt. Grade 4 ♢⁴'
  } else if (user.level <= 70) {
    user.role = '2nd Lt. Grade 5 ♢⁵'
  } else if (user.level <= 72) {
    user.role = '1st Lt. Grade 1 ♢♢¹'
  } else if (user.level <= 74) {
    user.role = '1st Lt. Grade 2 ♢♢²'
  } else if (user.level <= 76) {
    user.role = '1st Lt. Grade 3 ♢♢³'
  } else if (user.level <= 78) {
    user.role = '1st Lt. Grade 4 ♢♢⁴'
  } else if (user.level <= 80) {
    user.role = '1st Lt. Grade 5 ♢♢⁵'
  } else if (user.level <= 82) {
    user.role = 'Major Grade 1 ✷¹'
  } else if (user.level <= 84) {
    user.role = 'Major Grade 2 ✷²'
  } else if (user.level <= 86) {
    user.role = 'Major Grade 3 ✷³'
  } else if (user.level <= 88) {
    user.role = 'Major Grade 4 ✷⁴'
  } else if (user.level <= 90) {
    user.role = 'Major Grade 5 ✷⁵'
  } else if (user.level <= 10000) {
    user.role = 'The King Of Role ♛'
  }

  if (before !== user.level) {
    user.money += 10000
    let ini_txt = `
\`Congratulations, You level up\`

* *- Level:* ~${before}~ ••> *${user.level}*
* *- Role:* ${user.role}
* *- Reward:* 10,000 Money

_Semakin sering kamu berinteraksi dengan ${global.namebot}, semakin tinggi level kamu_`.trim()

    await this.sendFile(
      m.chat,
      'https://raw.githubusercontent.com/RIJALGANZZZ/dat2/main/uploads/c99d2165.jpg',
      '',
      ini_txt,
      m,
      false,
      {
        contextInfo: global.adReply
      }
    )
  }
}

export const disabled = false