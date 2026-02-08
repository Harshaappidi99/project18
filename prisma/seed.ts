import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// IPL Teams
const teams = [
  { code: "CSK", name: "Chennai Super Kings" },
  { code: "MI", name: "Mumbai Indians" },
  { code: "RCB", name: "Royal Challengers Bangalore" },
  { code: "KKR", name: "Kolkata Knight Riders" },
  { code: "DC", name: "Delhi Capitals" },
  { code: "SRH", name: "Sunrisers Hyderabad" },
  { code: "PBKS", name: "Punjab Kings" },
  { code: "RR", name: "Rajasthan Royals" },
  { code: "GT", name: "Gujarat Titans" },
  { code: "LSG", name: "Lucknow Super Giants" },
]

// Sample players per team
const teamPlayers: Record<string, string[]> = {
  CSK: ["MS Dhoni", "Ruturaj Gaikwad", "Ravindra Jadeja", "Shivam Dube", "Deepak Chahar"],
  MI: ["Rohit Sharma", "Hardik Pandya", "Suryakumar Yadav", "Ishan Kishan", "Jasprit Bumrah"],
  RCB: ["Virat Kohli", "Faf du Plessis", "Glenn Maxwell", "Dinesh Karthik", "Mohammed Siraj"],
  KKR: ["Shreyas Iyer", "Andre Russell", "Sunil Narine", "Rinku Singh", "Varun Chakravarthy"],
  DC: ["Rishabh Pant", "David Warner", "Axar Patel", "Mitchell Marsh", "Kuldeep Yadav"],
  SRH: ["Pat Cummins", "Travis Head", "Heinrich Klaasen", "Abhishek Sharma", "Bhuvneshwar Kumar"],
  PBKS: ["Shikhar Dhawan", "Liam Livingstone", "Sam Curran", "Arshdeep Singh", "Kagiso Rabada"],
  RR: ["Sanju Samson", "Jos Buttler", "Yashasvi Jaiswal", "Ravichandran Ashwin", "Trent Boult"],
  GT: ["Shubman Gill", "Rashid Khan", "David Miller", "Mohammed Shami", "Wriddhiman Saha"],
  LSG: ["KL Rahul", "Quinton de Kock", "Marcus Stoinis", "Kyle Mayers", "Ravi Bishnoi"],
}

// Venues
const venues = [
  "M.A. Chidambaram Stadium, Chennai",
  "Wankhede Stadium, Mumbai",
  "M. Chinnaswamy Stadium, Bangalore",
  "Eden Gardens, Kolkata",
  "Arun Jaitley Stadium, Delhi",
  "Rajiv Gandhi Stadium, Hyderabad",
  "PCA Stadium, Mohali",
  "Sawai Mansingh Stadium, Jaipur",
  "Narendra Modi Stadium, Ahmedabad",
  "BRSABV Stadium, Lucknow",
]

// Generate sub-events for a match
function generateSubEvents(team1: string, team2: string) {
  const team1Players = teamPlayers[team1] || []
  const team2Players = teamPlayers[team2] || []
  const allPlayers = [...team1Players, ...team2Players]

  return [
    {
      type: "top_scorer_a",
      description: `Top Run Scorer (${team1})`,
      options: JSON.stringify(team1Players),
    },
    {
      type: "top_scorer_b",
      description: `Top Run Scorer (${team2})`,
      options: JSON.stringify(team2Players),
    },
    {
      type: "top_wicket",
      description: "Top Wicket Taker",
      options: JSON.stringify(allPlayers),
    },
    {
      type: "powerplay_slider",
      description: "Powerplay Runs (Over/Under 45.5)",
      options: JSON.stringify({ min: 30, max: 80, default: 45, step: 1 }),
    },
    {
      type: "sixes_slider",
      description: "Total Match Sixes (Over/Under 12.5)",
      options: JSON.stringify({ min: 0, max: 30, default: 12, step: 1 }),
    },
    {
      type: "first_wicket_radio",
      description: "First Wicket Method",
      options: JSON.stringify(["Caught", "Bowled", "LBW", "Run Out", "Other"]),
    },
    {
      type: "partnership_range",
      description: "Highest Partnership",
      options: JSON.stringify(["0-30", "31-50", "51-75", "76-100", "100+"]),
    },
    {
      type: "winner_radio",
      description: "Match Winner",
      options: JSON.stringify([team1, team2]),
    },
    {
      type: "potm",
      description: "Player of the Match",
      options: JSON.stringify(allPlayers),
    },
    {
      type: "total_score",
      description: "Total Match Score",
      options: JSON.stringify({ min: 200, max: 500, default: 340, step: 10 }),
    },
  ]
}

async function main() {
  console.log("🏏 Starting database seed...")

  // Clean existing data
  console.log("🧹 Cleaning existing data...")
  await prisma.prediction.deleteMany()
  await prisma.collectible.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.subEvent.deleteMany()
  await prisma.match.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  console.log("👥 Creating sample users...")
  const hashedPassword = await bcrypt.hash("password123", 12)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Virat Fan",
        email: "virat@test.com",
        password: hashedPassword,
        pxviiipd_balance: 250,
      },
    }),
    prisma.user.create({
      data: {
        name: "Dhoni Legend",
        email: "dhoni@test.com",
        password: hashedPassword,
        pxviiipd_balance: 180,
      },
    }),
    prisma.user.create({
      data: {
        name: "Cricket Master",
        email: "master@test.com",
        password: hashedPassword,
        pxviiipd_balance: 320,
      },
    }),
    prisma.user.create({
      data: {
        name: "Test User",
        email: "test@test.com",
        password: hashedPassword,
        pxviiipd_balance: 100,
      },
    }),
  ])

  // Create welcome transactions for users
  for (const user of users) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "earned",
        amount: 100,
        description: "Welcome bonus - 100 PXVIIIPD",
      },
    })
  }

  // Create matches
  console.log("🏟️ Creating matches...")
  const now = new Date()
  
  const matchData = [
    // Completed matches
    {
      team1: "CSK",
      team2: "MI",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      venue: venues[0],
      status: "completed",
      result: "CSK won by 6 wickets",
    },
    {
      team1: "RCB",
      team2: "KKR",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      venue: venues[2],
      status: "completed",
      result: "KKR won by 35 runs",
    },
    {
      team1: "DC",
      team2: "SRH",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      venue: venues[4],
      status: "completed",
      result: "SRH won by 4 wickets",
    },
    // Live match
    {
      team1: "GT",
      team2: "RR",
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      venue: venues[8],
      status: "live",
      result: null,
    },
    // Upcoming matches
    {
      team1: "PBKS",
      team2: "LSG",
      date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      venue: venues[6],
      status: "upcoming",
      result: null,
    },
    {
      team1: "MI",
      team2: "RCB",
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      venue: venues[1],
      status: "upcoming",
      result: null,
    },
    {
      team1: "CSK",
      team2: "KKR",
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      venue: venues[0],
      status: "upcoming",
      result: null,
    },
    {
      team1: "DC",
      team2: "GT",
      date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      venue: venues[4],
      status: "upcoming",
      result: null,
    },
    {
      team1: "SRH",
      team2: "RR",
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      venue: venues[5],
      status: "upcoming",
      result: null,
    },
    {
      team1: "LSG",
      team2: "CSK",
      date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      venue: venues[9],
      status: "upcoming",
      result: null,
    },
  ]

  const matches = []
  for (const data of matchData) {
    const match = await prisma.match.create({
      data: {
        team1: data.team1,
        team2: data.team2,
        date: data.date,
        venue: data.venue,
        status: data.status,
        result: data.result,
      },
    })
    matches.push(match)

    // Create sub-events for each match
    const subEvents = generateSubEvents(data.team1, data.team2)
    for (const se of subEvents) {
      await prisma.subEvent.create({
        data: {
          matchId: match.id,
          type: se.type,
          description: se.description,
          options: se.options,
        },
      })
    }
  }

  // Create sample predictions for completed matches
  console.log("🎯 Creating sample predictions...")
  const completedMatches = matches.filter(m => m.status === "completed")
  
  for (const match of completedMatches) {
    const subEvents = await prisma.subEvent.findMany({
      where: { matchId: match.id },
    })

    for (const user of users.slice(0, 3)) {
      for (const subEvent of subEvents) {
        const options = JSON.parse(subEvent.options)
        let selectedOption: string

        if (Array.isArray(options)) {
          selectedOption = options[Math.floor(Math.random() * options.length)]
        } else {
          selectedOption = String(options.default + Math.floor(Math.random() * 20) - 10)
        }

        const isCorrect = Math.random() > 0.5
        const points = isCorrect ? Math.floor(Math.random() * 10) + 5 : 0

        await prisma.prediction.create({
          data: {
            userId: user.id,
            matchId: match.id,
            subEventId: subEvent.id,
            selectedOption,
            creditsAllocated: 1,
            isCorrect,
            points,
          },
        })
      }

      // Record transaction
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "spent",
          amount: 10,
          description: `Predictions for ${match.team1} vs ${match.team2}`,
        },
      })
    }
  }

  // Create sample collectibles
  console.log("🎴 Creating sample collectibles...")
  const rarities = ["common", "rare", "epic", "legendary"]
  
  for (const user of users.slice(0, 3)) {
    for (let i = 0; i < 3; i++) {
      const match = completedMatches[i % completedMatches.length]
      const rarity = rarities[Math.floor(Math.random() * rarities.length)]
      const listedForSale = Math.random() > 0.7

      await prisma.collectible.create({
        data: {
          userId: user.id,
          matchId: match.id,
          rarity,
          metadata: JSON.stringify({
            rank: Math.floor(Math.random() * 100) + 1,
            accuracy: Math.floor(Math.random() * 40) + 60,
            mintNumber: Math.floor(Math.random() * 1000) + 1,
          }),
          listedForSale,
          price: listedForSale ? Math.floor(Math.random() * 50) + 10 : null,
        },
      })

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "earned",
          amount: rarity === "legendary" ? 50 : rarity === "epic" ? 30 : rarity === "rare" ? 20 : 10,
          description: `Earned ${rarity} collectible (${match.team1} vs ${match.team2})`,
        },
      })
    }
  }

  console.log("✅ Database seeded successfully!")
  console.log("")
  console.log("📝 Test accounts created:")
  console.log("   Email: test@test.com")
  console.log("   Password: password123")
  console.log("")
  console.log("   Email: virat@test.com")
  console.log("   Password: password123")
  console.log("")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
