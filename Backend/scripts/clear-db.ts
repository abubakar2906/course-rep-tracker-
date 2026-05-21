import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Starting database clear...\n');

  const trackerRecords = await prisma.trackerRecord.deleteMany();
  console.log(`✅ Deleted ${trackerRecords.count} TrackerRecord(s)`);

  const trackers = await prisma.tracker.deleteMany();
  console.log(`✅ Deleted ${trackers.count} Tracker(s)`);

  const courseUpdates = await prisma.courseUpdate.deleteMany();
  console.log(`✅ Deleted ${courseUpdates.count} CourseUpdate(s)`);

  const students = await prisma.student.deleteMany();
  console.log(`✅ Deleted ${students.count} Student(s)`);

  const courses = await prisma.course.deleteMany();
  console.log(`✅ Deleted ${courses.count} Course(s)`);

  const cohorts = await prisma.cohort.deleteMany();
  console.log(`✅ Deleted ${cohorts.count} Cohort(s)`);

  const users = await prisma.user.deleteMany();
  console.log(`✅ Deleted ${users.count} User(s)`);

  console.log('\n🎉 Database cleared successfully!');
}

clearDatabase()
  .catch((e) => {
    console.error('❌ Error clearing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
