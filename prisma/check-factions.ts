import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const ep = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(ep)) {
  for (const l of fs.readFileSync(ep,'utf-8').split('\n')) {
    const m = l.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g,'');
  }
}
const prisma = new PrismaClient();
prisma.faction.findMany({ select: { id: true, name: true, nameJa: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); prisma.$disconnect(); });
