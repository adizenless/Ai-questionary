const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try{
    await db.category.createMany({
      data: [
        { name: 'Знаменитые Люди' },
        { name: 'Фильмы & ТВ' },
        { name: 'Певцы' },
        { name: 'Игры' },
        { name: 'Животные' },
        { name: 'Философы' },
        { name: 'Учённые' },
      ]
    })
  } catch(error) {
    console.error('Error seeding default categories', error)
  } finally {
    await db.$disconnect();
  }
};

main();