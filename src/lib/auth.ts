import bcrypt from 'bcryptjs'

export async function verifyPassword(password: string, hash: string | undefined): Promise<boolean> {
  if (!hash) return false
  return bcrypt.compare(password, hash)
}