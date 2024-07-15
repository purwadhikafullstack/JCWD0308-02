import { pool, prisma } from "@/db.js"
import { generateId } from "lucia"

type userVoucher = {
  userId: string,
  voucherId: string,
  expiresAt: Date,
}

const DISKONTEMAN = (userId: string, voucherId: string) => ({
  userId,
  voucherId,
  expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
})

export class VoucherHelper {
  static assignReferral = async (successorId: string, predecessorId: string, voucherId: string) => {
    await prisma.userVoucher.createMany({
      data: [DISKONTEMAN(successorId, voucherId), DISKONTEMAN(predecessorId, voucherId)],
    })
  }

  static assignReferralExpires = async (userId: string, voucherId: string) => {
    await pool.query(`
      CREATE EVENT \`${generateId(16)}\`
      ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 3 DAY)
      DO  
          DELETE FROM user_vouchers WHERE user_id='${userId}' AND voucher_id='${voucherId}';
    `)
  }
}