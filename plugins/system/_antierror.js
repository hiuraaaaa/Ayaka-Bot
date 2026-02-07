/**
© lann
ini wm gw cok jan di hapus
*/

let handler = m => m

handler.all = async function (m, {isPrems}) {
    let user = global.db.data.users[m.sender]
    if ((user.money * 1) > 1000000000000000000000000000) {
        user.money = 100000000000000000000000000000
    } else if ((user.money * 1) < 0) {
        user.money = 0
    }
    if ((user.health * 1) > 100) {
        user.health = 100
    } else if ((user.health * 1) < 0) {
        user.health = 0
    }
    if ((user.exp * 1) > 1000000000000000000000000) {
         user.exp = 10000000000000000000000
    } else if ((user.exp * 1) < 0) {
         user.exp = 0
    }
    if ((user.limit * 1) > 10000 && !isPrems) {
         user.limit = 10000
    } else if ((user.limit * 1) < 0) {
         user.limit = 0
    }
    if ((user.bank * 1) > 1000000000000000000000000000000) {
         user.bank = 100000000000000000000000000000000
    } else if ((user.bank * 1) < 0) {
         user.bank = 0
    }
}
export default handler