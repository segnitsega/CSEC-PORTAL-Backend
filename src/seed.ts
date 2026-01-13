/**
 * Database seed script for the CSEC Portal.
 *
 * Populates a fresh MongoDB cluster with:
 *   - The club divisions (DivisionGroup + the per-division dynamic collection,
 *     mirroring what createDivision() does at runtime).
 *   - The leadership accounts (President, Vice President and the division heads),
 *     plus a few regular members, each with a fully filled-out profile.
 *   - Sample content (sessions, events, resources, club rules, attendance) so the
 *     UI looks populated.
 *
 * Run with:  npm run seed
 *
 * NOTE: this is destructive. It wipes the collections it manages before
 * re-inserting, so it is safe to run repeatedly on a fresh/test cluster.
 */

import { config } from "./config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Member from "./models/membersModel";
import DivisionGroup from "./models/divisionGroupModel";
import Session from "./models/sessionsModel";
import Event from "./models/eventsModel";
import Resource from "./models/resourcesModel";
import { ClubRule } from "./models/clubRulesModel";
import Attendance from "./models/attendanceModel";
import { getDivisionModel } from "./models/dynamicDivisionModel";

const MONGO_URI = config.MONGO_URI;
const PASSWORD = "Pass@123";

// ---------------------------------------------------------------------------
// Divisions. The division head's clubRole is derived as `${division} President`
// (see utils/checkDivisionHead.ts), so the names below must match exactly.
// ---------------------------------------------------------------------------
const DIVISIONS = [
  "Competitive Programming",
  "Development",
  "Data Science",
  "Cybersecurity",
  "Capacity Building",
  "Social Media",
];

const GROUPS = ["Group 1", "Group 2"];

// ---------------------------------------------------------------------------
// People. profilePicture uses pravatar.cc, which serves real, stable photos.
// ---------------------------------------------------------------------------
interface SeedPerson {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  clubRole: string;
  division: string;
  group: string;
  divisionRole: "Admin" | "Coordinator" | "Member";
  pic: number; // pravatar image id (1-70)
  gender?: string;
  specialization?: string;
}

const PEOPLE: SeedPerson[] = [
  // ---- President -----------------------------------------------------------
  {
    firstName: "Kiya",
    lastName: "Kebede",
    email: "kiyakebe@gmail.com",
    clubRole: "President",
    division: "Development",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 12,
    specialization: "Software Engineering",
  },
  // ---- Vice President ------------------------------------------------------
  {
    firstName: "Nebiyu",
    lastName: "Musbah",
    email: "nebiyumusbah@gmail.com",
    clubRole: "Vice President",
    division: "Competitive Programming",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 13,
    specialization: "Competitive Programming",
  },
  // ---- Division heads ------------------------------------------------------
  {
    firstName: "Samuel",
    lastName: "Girma",
    email: "samigere@gmail.com",
    clubRole: "Data Science President",
    division: "Data Science",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 14,
    specialization: "Machine Learning",
  },
  {
    firstName: "Abdi",
    lastName: "Tadesse",
    email: "abdi@gmail.com",
    clubRole: "Competitive Programming President",
    division: "Competitive Programming",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 15,
    specialization: "Algorithms",
  },
  {
    firstName: "Zinedine",
    lastName: "Yohannes",
    email: "zizou@gmail.com",
    clubRole: "Capacity Building President",
    division: "Capacity Building",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 16,
    specialization: "Training & Mentorship",
  },
  {
    firstName: "Fasil",
    lastName: "Hawultie",
    email: "fassilhawultie@gmail.com",
    clubRole: "Development President",
    division: "Development",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 17,
    specialization: "Full-Stack Development",
  },
  {
    firstName: "Nikodemos",
    lastName: "Bekele",
    email: "nikodemos123@gmail.com",
    clubRole: "Cybersecurity President",
    division: "Cybersecurity",
    group: "Group 1",
    divisionRole: "Admin",
    pic: 18,
    specialization: "Penetration Testing",
  },
  // ---- Regular members -----------------------------------------------------
  {
    firstName: "Segni",
    lastName: "Tsega",
    email: "segni@gmail.com",
    clubRole: "Member",
    division: "Development",
    group: "Group 1",
    divisionRole: "Member",
    pic: 33,
    specialization: "Backend Development",
  },
  {
    firstName: "Lelo",
    lastName: "Abebe",
    email: "lelo@gmail.com",
    clubRole: "Member",
    division: "Data Science",
    group: "Group 2",
    divisionRole: "Member",
    pic: 34,
    specialization: "Data Analytics",
  },
  {
    firstName: "Feti",
    lastName: "Mohammed",
    email: "feti@gmail.com",
    clubRole: "Member",
    division: "Social Media",
    group: "Group 1",
    divisionRole: "Member",
    pic: 35,
    specialization: "Content & Design",
  },
];

// A short, role-appropriate bio for each person.
function bioFor(p: SeedPerson): string {
  if (p.clubRole === "President")
    return `${p.firstName} leads the CSEC chapter as President, coordinating all divisions and club-wide initiatives.`;
  if (p.clubRole === "Vice President")
    return `${p.firstName} serves as Vice President, supporting club leadership and overseeing cross-division programs.`;
  if (p.clubRole.endsWith("President"))
    return `${p.firstName} heads the ${p.division} division, mentoring members and driving its weekly sessions and projects.`;
  return `${p.firstName} is an active member of the ${p.division} division, focused on ${p.specialization ?? "club activities"}.`;
}

function buildMember(p: SeedPerson, hashedPassword: string) {
  const handle = p.firstName.toLowerCase() + p.lastName.toLowerCase();
  return {
    firstName: p.firstName,
    middleName: p.middleName,
    lastName: p.lastName,
    email: p.email,
    password: hashedPassword,
    phoneNumber: `+2519${String(40000000 + p.pic * 137).slice(0, 8)}`,
    gender: p.gender,
    birthDate: "2002-05-15",
    graduationYear: 2026,
    department: "Computer Science and Engineering",
    specialization: p.specialization,
    universityId: `UGR/${1000 + p.pic}/14`,
    bio: bioFor(p),
    profilePicture: `https://i.pravatar.cc/300?img=${p.pic}`,
    github: `https://github.com/${handle}`,
    linkedinHandle: `https://www.linkedin.com/in/${handle}`,
    telegramHandle: `@${handle}`,
    instagramHandle: `@${handle}`,
    leetcodeHandle: handle,
    codeforcesHandle: handle,
    clubRole: p.clubRole,
    division: p.division,
    group: p.group,
    divisionRole: p.divisionRole,
    membershipStatus: "Active" as const,
    campusStatus: "On Campus" as const,
    attendance: "Active" as const,
    mustChangePassword: false,
    lastSeen: new Date().toISOString(),
  };
}

async function seedDivisions() {
  // Mirror createDivision(): a DivisionGroup doc + a row in the per-division
  // dynamic collection.
  for (const division of DIVISIONS) {
    await DivisionGroup.create({ division, groups: [...GROUPS] });
    const Division = await getDivisionModel(division);
    await Division.deleteMany({});
    await Division.create({ name: division });
  }
  console.log(`  ✓ ${DIVISIONS.length} divisions created`);
}

async function seedMembers() {
  // insertMany bypasses the Member schema's pre('save') hashing hook, so the
  // password must be hashed explicitly here for the bulk insert.
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const docs = PEOPLE.map((p) => buildMember(p, hashedPassword));
  await Member.insertMany(docs);
  console.log(`  ✓ ${docs.length} members created (password for all: ${PASSWORD})`);
}

async function seedSessions() {
  const docs = DIVISIONS.map((division, i) => ({
    sessionTitle: `${division} Weekly Session`,
    division,
    groups: [...GROUPS],
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    status: i % 2 === 0 ? "on-going" : "planned",
    sessions: [
      { day: "Saturday", startTime: "09:00", endTime: "11:00" },
      { day: "Wednesday", startTime: "16:00", endTime: "18:00" },
    ],
  }));
  await Session.insertMany(docs);
  console.log(`  ✓ ${docs.length} sessions created`);
}

async function seedEvents() {
  const docs = [
    {
      eventTitle: "CSEC General Assembly",
      eventDate: "2026-06-20",
      startTime: "10:00",
      endTime: "12:00",
      visibility: "Public",
      status: "planned",
      attendance: "Mandatory",
    },
    {
      eventTitle: "Competitive Programming Contest #1",
      division: "Competitive Programming",
      groups: [...GROUPS],
      eventDate: "2026-06-28",
      startTime: "14:00",
      endTime: "17:00",
      visibility: "Division",
      status: "planned",
      attendance: "Optional",
    },
    {
      eventTitle: "Intro to Cybersecurity CTF",
      division: "Cybersecurity",
      groups: ["Group 1"],
      eventDate: "2026-07-05",
      startTime: "13:00",
      endTime: "16:00",
      visibility: "Division",
      status: "planned",
      attendance: "Optional",
    },
    {
      eventTitle: "Dev Project Showcase",
      division: "Development",
      groups: [...GROUPS],
      eventDate: "2026-07-12",
      startTime: "15:00",
      endTime: "18:00",
      visibility: "Public",
      status: "planned",
      attendance: "Optional",
    },
  ];
  await Event.insertMany(docs);
  console.log(`  ✓ ${docs.length} events created`);
}

async function seedResources() {
  const docs = [
    { resourceName: "Codeforces", resourceLink: "https://codeforces.com", division: "Competitive Programming" },
    { resourceName: "CP Handbook (PDF)", resourceLink: "https://cses.fi/book/book.pdf", division: "Competitive Programming" },
    { resourceName: "MDN Web Docs", resourceLink: "https://developer.mozilla.org", division: "Development" },
    { resourceName: "The Odin Project", resourceLink: "https://www.theodinproject.com", division: "Development" },
    { resourceName: "Kaggle", resourceLink: "https://www.kaggle.com", division: "Data Science" },
    { resourceName: "TryHackMe", resourceLink: "https://tryhackme.com", division: "Cybersecurity" },
    { resourceName: "Public Speaking Guide", resourceLink: "https://www.toastmasters.org", division: "Capacity Building" },
    { resourceName: "Canva", resourceLink: "https://www.canva.com", division: "Social Media" },
  ];
  await Resource.insertMany(docs);
  console.log(`  ✓ ${docs.length} resources created`);
}

async function seedClubRules() {
  await ClubRule.create({
    maxAbsences: 5,
    warningAfter: 2,
    suspendAfter: 4,
    fireAfter: 5,
  });
  console.log("  ✓ club rules created");
}

async function seedAttendance() {
  // Link a couple of members to their division's session so the attendance UI
  // has data to show.
  const sessions = await Session.find({});
  const members = await Member.find({ clubRole: "Member" });
  const records: any[] = [];
  for (const member of members) {
    const session = sessions.find((s) => s.division === member.division);
    if (session) {
      records.push({
        memberId: member._id,
        sessionId: session._id,
        status: "present",
        date: new Date(),
      });
    }
  }
  if (records.length) {
    await Attendance.insertMany(records);
  }
  console.log(`  ✓ ${records.length} attendance records created`);
}

async function wipe() {
  await Promise.all([
    Member.deleteMany({}),
    DivisionGroup.deleteMany({}),
    Session.deleteMany({}),
    Event.deleteMany({}),
    Resource.deleteMany({}),
    ClubRule.deleteMany({}),
    Attendance.deleteMany({}),
  ]);
  console.log("  ✓ existing data cleared");
}

async function run() {
  if (!MONGO_URI) {
    console.error("✗ MONGO_URI is not set. Add it to your .env before seeding.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.\n");

  try {
    console.log("Clearing collections:");
    await wipe();

    console.log("\nSeeding:");
    await seedDivisions();
    await seedMembers();
    await seedSessions();
    await seedEvents();
    await seedResources();
    await seedClubRules();
    await seedAttendance();

    console.log("\n✅ Seed complete.");
    console.log(`   President login: kiyakebe@gmail.com / ${PASSWORD}`);
  } catch (err) {
    console.error("\n✗ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
