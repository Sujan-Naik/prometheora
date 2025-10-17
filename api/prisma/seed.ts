// prisma/seed.ts
import { PrismaClient, Role, Visibility } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Generic cleanup that works in SQLite, Postgres, MySQL
async function resetDatabase() {
  console.log('🗑 Clearing existing data...')

  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.tier.deleteMany()
  await prisma.projectFollower.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.devlog.deleteMany()
  await prisma.media.deleteMany() // Add this!
  await prisma.post.deleteMany()
  await prisma.project.deleteMany()
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()
  await prisma.blog.deleteMany()
}

async function main() {
  console.log('🌱 Seeding database...')
  await resetDatabase()

  const passwordHash = await bcrypt.hash('password123', 10)

  // --- USERS ---
  const [alice, bob, charlie, diana, testUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@creator.com',
        passwordHash,
        handle: 'aliceArt',
        bio: 'Digital artist and illustrator sharing process and projects.',
        userRoles: { create: { role: Role.CREATOR } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@patron.com',
        passwordHash,
        handle: 'bobPatron',
        bio: 'Big supporter of indie creators.',
        userRoles: { create: { role: Role.PATRON } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@creator.com',
        passwordHash,
        handle: 'charlieDev',
        bio: 'Solo game developer building pixel adventures.',
        userRoles: { create: { role: Role.CREATOR } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@patron.com',
        passwordHash,
        handle: 'dianaMuse',
        bio: 'Collector and fan of digital art and games.',
        userRoles: { create: { role: Role.PATRON } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'test@user.com',
        passwordHash,
        handle: 'testUser',
        bio: 'Automated test user for integration scenarios.',
        userRoles: {
          createMany: { data: [{ role: Role.CREATOR }, { role: Role.PATRON }] },
        },
      },
    }),
  ])
  console.log('👥 Users created')

  // --- PROJECTS ---
  const [aliceProj, charlieProj, testProj] = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Fantasy Portraits',
        description: 'Series of fantasy portraits for patrons.',
        visibility: Visibility.PATRON_ONLY,
        creatorId: alice.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'PixelQuest',
        description: 'Retro pixel RPG with open devlogs.',
        repoUrl: 'https://github.com/charlieDev/pixelquest',
        demoUrl: 'https://pixelquest-demo.netlify.app',
        visibility: Visibility.PUBLIC,
        creatorId: charlie.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Testing Grounds',
        description: 'Internal project for automation and seed testing.',
        repoUrl: 'https://github.com/testUser/testing-grounds',
        demoUrl: 'https://example.com/demo',
        visibility: Visibility.FOLLOWER_ONLY,
        creatorId: testUser.id,
      },
    }),
  ])
  console.log('📁 Projects created')

  // --- MEDIA FOR PROJECTS ---
  await prisma.media.createMany({
    data: [
      // Alice's project media
      {
        url: 'https://picsum.photos/seed/portrait1/800/600',
        type: 'image',
        caption: 'Fantasy Portrait - Elven Warrior',
        order: 0,
        projectId: aliceProj.id,
      },
      {
        url: 'https://picsum.photos/seed/portrait2/800/600',
        type: 'image',
        caption: 'Fantasy Portrait - Dragon Mage',
        order: 1,
        projectId: aliceProj.id,
      },
      // Charlie's project media
      {
        url: 'https://picsum.photos/seed/pixelquest/800/600',
        type: 'image',
        caption: 'PixelQuest gameplay screenshot',
        order: 0,
        projectId: charlieProj.id,
      },
      // Test project media
      {
        url: 'https://picsum.photos/seed/test1/800/600',
        type: 'image',
        caption: 'Test screenshot',
        order: 0,
        projectId: testProj.id,
      },
    ],
  })
  console.log('🖼️ Project media created')

  // --- MEDIA FOR USERS (Profile pictures/banners) ---
  await prisma.media.createMany({
    data: [
      {
        url: 'https://picsum.photos/seed/alice/400/400',
        type: 'image',
        caption: 'Profile picture',
        order: 0,
        userId: alice.id,
      },
      {
        url: 'https://picsum.photos/seed/charlie/400/400',
        type: 'image',
        caption: 'Profile picture',
        order: 0,
        userId: charlie.id,
      },
    ],
  })
  console.log('👤 User media created')

  // --- DEVLOGS ---
  await prisma.devlog.createMany({
    data: [
      {
        title: 'UI Overhaul',
        content: 'Refactored layout, improved accessibility.',
        version: 'v0.2',
        projectId: testProj.id,
      },
      {
        title: 'Character Design Update',
        content: 'Added three new classes: Mage, Knight, and Ranger.',
        version: 'v0.3',
        projectId: charlieProj.id,
      },
    ],
  })
  console.log('🧱 Devlogs created')

  // --- FOLLOWERS ---
  await prisma.projectFollower.createMany({
    data: [
      { userId: bob.id, projectId: aliceProj.id },
      { userId: bob.id, projectId: charlieProj.id },
      { userId: testUser.id, projectId: charlieProj.id },
      { userId: testUser.id, projectId: aliceProj.id },
      { userId: diana.id, projectId: testProj.id },
    ],
  })
  console.log('👀 Followers created')

  // --- PORTFOLIO ITEMS ---
  await prisma.portfolioItem.createMany({
    data: [
      { userId: alice.id, projectId: aliceProj.id, order: 1, caption: 'Main artwork' },
      { userId: charlie.id, projectId: charlieProj.id, order: 1, caption: 'Gameplay screenshot' },
      { userId: testUser.id, projectId: testProj.id, order: 1, caption: 'Testing asset' },
    ],
  })
  console.log('🖼️ Portfolio items added')

  // --- TIERS ---
  const [basicTier, premiumTier] = await Promise.all([
    prisma.tier.create({
      data: {
        name: 'Supporter',
        price: 5.0,
        benefits: 'Access to exclusive posts and updates.',
        creatorId: alice.id,
      },
    }),
    prisma.tier.create({
      data: {
        name: 'VIP',
        price: 15.0,
        benefits: 'Behind‑the‑scenes content and PSDs.',
        creatorId: alice.id,
      },
    }),
  ])
  console.log('💰 Tiers created')

  // --- SUBSCRIPTIONS ---
  const [bobSub, dianaSub] = await Promise.all([
    prisma.subscription.create({
      data: {
        patronId: bob.id,
        tierId: premiumTier.id,
        startDate: new Date(),
      },
    }),
    prisma.subscription.create({
      data: {
        patronId: diana.id,
        tierId: basicTier.id,
        startDate: new Date(),
      },
    }),
  ])
  console.log('📦 Subscriptions created')

  // --- PAYMENTS ---
  await prisma.payment.createMany({
    data: [
      {
        amount: premiumTier.price,
        subscriptionId: bobSub.id,
        userId: bob.id,
      },
      {
        amount: basicTier.price,
        subscriptionId: dianaSub.id,
        userId: diana.id,
      },
    ],
  })
  console.log('💳 Payments created')

  // --- POSTS ---
  const [welcomePost, dragonPost, pixelquestPost, testPost] = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Welcome Circle',
        content: 'Welcome everyone! Free to read.',
        creatorId: alice.id,
        isPaid: false,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Early Sketch: The Dragon Queen',
        content: 'PSD + process video exclusive for patrons.',
        creatorId: alice.id,
        isPaid: true,
      },
    }),
    prisma.post.create({
      data: {
        title: 'PixelQuest Alpha Update',
        content: 'Playable demo now online! Added combat system.',
        creatorId: charlie.id,
        quotedProjectId: charlieProj.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Testing Post',
        content: 'Integration test: visible to followers only.',
        creatorId: testUser.id,
        isPaid: false,
      },
    }),
  ])
  console.log('📝 Posts created')

  // --- MEDIA FOR POSTS ---
  await prisma.media.createMany({
    data: [
      {
        url: 'https://picsum.photos/seed/dragon/800/600',
        type: 'image',
        caption: 'Dragon Queen sketch preview',
        order: 0,
        postId: dragonPost.id,
      },
      {
        url: 'https://picsum.photos/seed/pixelupdate/800/600',
        type: 'image',
        caption: 'New combat system screenshot',
        order: 0,
        postId: pixelquestPost.id,
      },
    ],
  })
  console.log('📸 Post media created')

  // --- BLOG ---
  await prisma.blog.create({
    data: {
      slug: 'platform-launch',
      title: 'Introducing Creator Hub Platform',
      content:
        'Empowering creators and patrons with a better experience for creative growth.',
    },
  })
  console.log('📰 Blog post created')

  console.log('✅ Seed completed successfully.')
  console.log(`
  👤 Test User:
  - Email: test@user.com
  - Password: password123
  - Roles: CREATOR + PATRON
  - Follows: Alice & Charlie
  
  📊 Database Summary:
  - ${await prisma.user.count()} users
  - ${await prisma.project.count()} projects
  - ${await prisma.post.count()} posts
  - ${await prisma.media.count()} media items
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })