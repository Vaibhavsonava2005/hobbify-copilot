import { db } from './index';
import * as schema from './schema';

async function seed() {
  console.log('Seeding database with realistic Indian data...');
  
  // 1. Create a Vendor
  const [vendor] = await db.insert(schema.vendors).values({
    name: 'Smash Badminton Academy & Sports Complex',
  }).returning();

  // 2. Create Sports
  const sportsData = [
    { name: 'Badminton', vendorId: vendor.id },
    { name: 'Cricket', vendorId: vendor.id },
    { name: 'Football', vendorId: vendor.id },
    { name: 'Swimming', vendorId: vendor.id },
    { name: 'Yoga', vendorId: vendor.id },
    { name: 'Tennis', vendorId: vendor.id },
  ];
  const insertedSports = await db.insert(schema.sports).values(sportsData).returning();

  // 3. Create Venues & Courts
  const venuesData = [
    { name: 'Koramangala Indoor Arena', location: 'Koramangala, Bengaluru', vendorId: vendor.id },
    { name: 'HSR Layout Turf', location: 'HSR Layout, Bengaluru', vendorId: vendor.id },
  ];
  const insertedVenues = await db.insert(schema.venues).values(venuesData).returning();

  const courtsData = [
    { name: 'Court 1 (Wooden)', vendorId: vendor.id, venueId: insertedVenues[0].id, sportId: insertedSports[0].id },
    { name: 'Court 2 (Synthetic)', vendorId: vendor.id, venueId: insertedVenues[0].id, sportId: insertedSports[0].id },
    { name: 'Box Cricket Turf A', vendorId: vendor.id, venueId: insertedVenues[1].id, sportId: insertedSports[1].id },
  ];
  const insertedCourts = await db.insert(schema.courts).values(courtsData).returning();

  // 4. Create Coaches
  const coachesData = [
    { name: 'Rahul Dravid', specialtyId: insertedSports[1].id, vendorId: vendor.id }, // Cricket
    { name: 'Priya Gopichand', specialtyId: insertedSports[0].id, vendorId: vendor.id }, // Badminton
  ];
  const insertedCoaches = await db.insert(schema.coaches).values(coachesData).returning();

  // 5. Create Users
  const usersData = [
    { name: 'Arjun Kumar', email: 'arjun@example.com', phone: '9876543210', vendorId: vendor.id },
    { name: 'Ananya Sharma', email: 'ananya@example.com', phone: '9876543211', vendorId: vendor.id },
    { name: 'Rohan Singh', email: 'rohan@example.com', phone: '9876543212', vendorId: vendor.id },
  ];
  const insertedUsers = await db.insert(schema.users).values(usersData).returning();

  // 6. Create Memberships
  const membershipsData = [
    {
      userId: insertedUsers[0].id,
      vendorId: vendor.id,
      planName: 'Monthly Standard',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
    }
  ];
  await db.insert(schema.memberships).values(membershipsData);

  // 7. Create Payments
  const paymentsData = [
    {
      userId: insertedUsers[0].id,
      vendorId: vendor.id,
      amount: 1500.00, // 1500 INR
      method: 'upi',
      service: 'membership',
      status: 'success',
    }
  ];
  await db.insert(schema.payments).values(paymentsData);

  // 8. Create Community Groups
  const groupsData = [
    {
      vendorId: vendor.id,
      name: 'Weekend Warriors - Badminton',
      description: 'Group for weekend badminton matches in Koramangala',
    }
  ];
  const insertedGroups = await db.insert(schema.community_groups).values(groupsData).returning();

  // 9. Create Community Posts
  const postsData = [
    {
      groupId: insertedGroups[0].id,
      userId: insertedUsers[0].id,
      content: 'Anyone up for a match this Saturday morning?',
    }
  ];
  await db.insert(schema.community_posts).values(postsData);

  // 10. Create Swipe Matches
  const swipeData = [
    {
      userA: insertedUsers[0].id,
      userB: insertedUsers[1].id,
      vendorId: vendor.id,
      status: 'matched',
    }
  ];
  await db.insert(schema.swipe_matches).values(swipeData);

  // 11. Create Discounts
  const discountsData = [
    {
      vendorId: vendor.id,
      name: 'Summer Fest 2026',
      percentage: 20.00,
    }
  ];
  await db.insert(schema.discounts).values(discountsData);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
