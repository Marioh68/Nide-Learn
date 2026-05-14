'use server';

export async function verifyTeacherPassword(password: string): Promise<boolean> {
  const expected = process.env.TEACHER_PASS;
  if (!expected) return false;
  return password === expected;
}
