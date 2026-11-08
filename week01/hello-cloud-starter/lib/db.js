import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function saveUrl(shortCode, originalUrl) {
  // 동일한 원본 URL이 이미 저장되어 있는지 확인
  const existingRows = await sql`
    SELECT short_code
    FROM urls
    WHERE original_url = ${originalUrl}
    LIMIT 1
  `;

  // 기존 URL이 있으면 해당 shortCode 반환
  if (existingRows.length > 0) {
    return existingRows[0].short_code;
  }

  // 기존 URL이 없으면 새로 저장
  await sql`
    INSERT INTO urls (short_code, original_url)
    VALUES (${shortCode}, ${originalUrl})
  `;

  return shortCode;
}

export async function findUrlByShortCode(shortCode) {
  const rows = await sql`
    SELECT original_url
    FROM urls
    WHERE short_code = ${shortCode}
    LIMIT 1
  `;

  return rows[0]?.original_url ?? null;
}