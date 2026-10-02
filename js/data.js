/* ============================================================
   FACT at VCU : site content
   ------------------------------------------------------------
   Webmasters: this is the only file you need to edit to keep
   the site current. Add an event, swap a name, drop in a photo,
   change a link. Save, refresh, done.

   Dates use Richmond time. "-04:00" is daylight time (March to
   early November), "-05:00" is standard time (the rest).
   Events move to "wrapped" on their own once the end time passes.
   ============================================================ */

window.FACT = {
  year: "2026-27",

  links: {
    instagram: "https://www.instagram.com/factatvcu/",
    tiktok: "https://tiktok.com/@factatvcu",
    facebook: "https://www.facebook.com/groups/factatvcu/",
    youtube: "https://www.youtube.com/@factvcu9916",
    linktree: "https://linktr.ee/fact.linktree",
    dues: "https://forms.gle/VVn5esJPT2VN4qZG7",
    groupme: "https://groupme.com/join_group/116114066/weglYa6w",
    gbmSignIn: "https://forms.gle/n18LTkKfJkEmde6V8",
    kuyaAte: "https://docs.google.com/forms/d/e/1FAIpQLSdgQWz4l1J4-_7laYYvm2GRzmmiIhS2Aqx6SQCNqsHO48MOxQ/viewform",
    talentSignup: "https://docs.google.com/forms/d/e/1FAIpQLSfbhtAr_19XpiA-VpumaewAouIzpSdOwVYLoO4TylAWJQqu8A/viewform",
    tshirt: "https://docs.google.com/forms/d/e/1FAIpQLSccbi0Tee9_4Sb_Y5zM2ZN_tzV-iQLb8xawyxtkOdKsu_qMWw/viewform",
    intramural: "https://docs.google.com/forms/d/e/1FAIpQLScyM86GcAWH_u1rfNQiGLpJg-OLmabQSCSUdW_hicCdVOtmHg/viewform",
    d7Olympics: "https://docs.google.com/forms/d/1oAYj6cX0TfL-NMqZpo_b26Gwp_3NtWeGGHJZvXRArGs/viewform",
    culturalGroupme: "https://groupme.com/join_group/117428387/d5KmDyRN",
    modGroupme: "https://groupme.com/join_group/117439820/r9SxJf4o",
    histodump: "https://drive.google.com/drive/folders/1jiW-MfhukMzCX3wr0fyLicVLu39VyGGs",
    incidentReport: "https://docs.google.com/forms/d/e/1FAIpQLSc6jL61l-lkW3pw1zumqFKrE3VGFjDaHadQRCZozDnS95QvUQ/viewform",
    zeroTolerance: "https://docs.google.com/document/d/13C2yaVl41BW6r77effxwQ5jLtzGsuy7le1F6rs1aAQI/edit?usp=sharing"
  },

  /* ---------- Kuya/Ate Week (the scrapbook strip) ---------- */
  week: {
    title: "Kuya/Ate Week",
    range: "Sept 28 - Oct 2",
    start: "2026-09-28T00:00:00-04:00",
    end: "2026-10-02T23:59:00-04:00",
    days: [
      {
        start: "2026-09-28T18:00:00-04:00", end: "2026-09-28T20:00:00-04:00",
        title: "Big Little Speed Dating",
        where: "1200 W Marshall St", time: "6 - 8 PM",
        note: "Ask every big your questions and piece the clues together."
      },
      {
        start: "2026-09-29T16:00:00-04:00", end: "2026-09-29T21:00:00-04:00",
        title: "Oh! Mochi + GBM 2",
        where: "Oh! Mochi, then Commons Theater", time: "Mochi 4 - 10 PM, GBM 7 - 9 PM",
        note: "Tribes theme. Wear your tribe color and mention FACT at the counter."
      },
      {
        start: "2026-09-30T17:00:00-04:00", end: "2026-09-30T19:00:00-04:00",
        title: "Pumpkin Painting",
        where: "Monroe Park", time: "5 - 7 PM",
        note: "Paint a pumpkin, take the fall pics. With your Social chairs."
      },
      {
        start: "2026-10-01T17:00:00-04:00", end: "2026-10-01T19:00:00-04:00",
        title: "Field Day",
        where: "Monroe Park", time: "5 - 7 PM",
        note: "D7 Olympic games, Filipino food from Mama Vicky's, and The Jollibees live at 6."
      },
      {
        start: "2026-10-02T18:00:00-04:00", end: "2026-10-02T20:00:00-04:00",
        title: "Coraline Movie Night",
        where: "Pollak Building", time: "6 - 8 PM",
        note: "Blankets, comfy clothes, and a Cultural Liaison bake sale."
      }
    ]
  },

  /* ---------- Coming up ---------- */
  /* kind: "event" (a thing you go to) or "deadline" (a form closes)
     look: "circus", "pixel" or "stamp" (styled after the Instagram post) */
  events: [
    {
      id: "intramurals",
      kind: "deadline",
      start: "2026-10-05T23:59:00-04:00", end: "2026-10-05T23:59:00-04:00",
      title: "Intramural interest form due",
      where: "Cary St Field + RecWell courts", time: "Form closes Oct 5",
      note: "Men's and co-ed basketball and indoor soccer. Grab the $10 semester pass; registration runs through Oct 6.",
      cta: { label: "Interest form", href: "intramural" },
      look: "pixel"
    },
    {
      id: "talent-signups",
      kind: "deadline",
      start: "2026-10-10T23:59:00-04:00", end: "2026-10-10T23:59:00-04:00",
      title: "Talent Night sign-ups close",
      where: "Online form", time: "Closes Oct 10",
      note: "Sing, dance, do magic, tell jokes, play an instrument. Every talent is welcome under the big top.",
      cta: { label: "Sign up to perform", href: "talentSignup" },
      look: "circus"
    },
    {
      id: "talent-night",
      kind: "event",
      featured: true,
      start: "2026-10-24T18:00:00-04:00", end: "2026-10-24T21:00:00-04:00",
      title: "Talent Night",
      theme: "A Night at the Circus",
      where: "Ram Horns", time: "6 - 9 PM",
      note: "Step right up. One night, one stage, and every kind of talent FACT has.",
      cta: { label: "Sign up to perform", href: "talentSignup" },
      stub: "Sign-ups close Oct 10",
      art: "assets/img/circus.webp",
      look: "circus"
    },
    {
      id: "d7-olympics",
      kind: "event",
      start: "2026-11-07T10:00:00-05:00", end: "2026-11-07T18:00:00-05:00",
      allDay: true,
      title: "D7 Olympics",
      where: "James Madison University", time: "Time to be announced",
      note: "FACT vs UVA, Virginia Tech, ODU, William & Mary and JMU in traditional Filipino games and trivia.",
      cta: { label: "Sign up to compete", href: "d7Olympics" },
      look: "stamp"
    }
  ],

  /* ---------- Open right now (no date) ---------- */
  open: [
    { title: "T-shirt design contest", note: "Design this year's FACT shirt.", href: "tshirt", label: "Submit a design" },
    { title: "Fall membership dues", note: "Make it official for the semester.", href: "dues", label: "Pay dues" },
    { title: "Histodump", note: "Drop your photos in the shared album.", href: "histodump", label: "Open the album" }
  ],

  /* ---------- Every year ---------- */
  traditions: [
    { title: "Kuya/Ate Week", season: "Fall", note: "A week of clues, then the reveal: every new member meets their big.", icon: "ph-users-three" },
    { title: "Talent Night", season: "Fall", note: "Singers, dancers, comedians and whatever you can do that we haven't seen yet.", icon: "ph-microphone-stage" },
    { title: "D7 Olympics", season: "Fall", note: "Virginia's Filipino orgs go head to head in traditional games and trivia.", icon: "ph-trophy" },
    { title: "Barrio Fiesta", season: "Annual", note: "Free Filipino food, tinikling and modern sets at the Commons, open to all of VCU.", icon: "ph-confetti" },
    { title: "Mr. & Ms. FACT", season: "Annual", note: "Twelve contestants, each repping a Philippine province, judged by alumni.", icon: "ph-crown" },
    { title: "Culture Night", season: "Annual", note: "Our student-run culture show: the dances, the story, the whole stage.", icon: "ph-mask-happy" },
    { title: "Charity Ball", season: "Annual", note: "Dress up, show out, give back.", icon: "ph-hand-heart" },
    { title: "Karaoke Night", season: "Annual", note: "It would not be a Filipino org without it.", icon: "ph-music-notes" }
  ],

  /* ---------- Council ---------- */
  /* Photos are picked up by name. For "Katie Dantinne" the site
     looks for assets/council/katie-dantinne.webp (lowercase,
     dashes for spaces). No file means the card shows initials.  */
  photoDir: "assets/council/",
  photoExt: ".webp",
  /* People with no photo yet. They show as initials. Remove a name once its file is added. */
  noPhoto: [],
  council: [
    {
      id: "indie", genre: "Filipino Indie", color: "#5FD0D6", ink: "#062A33",
      blurb: "Filipino indie runs on kalayaan, the freedom to create. The president sets ideas in motion. Culture Night and the Historians bring them to life.",
      lead: { name: "Lorenzo Gabriel Valerio", role: "President" },
      advisor: { name: "Marley McCusker" },
      teams: [
        { name: "Culture Night", people: ["Katie Dantinne", "Helena Sherman", "Abigail Gajo"] },
        { name: "Historians", people: ["Liv Jacinta", "Deron Dejon", "Landon Walker"] }
      ]
    },
    {
      id: "opm", genre: "OPM", color: "#FCD116", ink: "#3A2A00",
      blurb: "Original Pinoy Music is the classic sound of home and the spirit of bayanihan. Socials and Cultural Liaisons keep everyone connected to it.",
      lead: { name: "Cristlin Feniza", role: "Internal Vice President" },
      advisor: { name: "Justine Ho" },
      teams: [
        { name: "Socials", people: ["Kayla Bradley", "Analisa Miranda"] },
        { name: "Cultural Liaison", people: ["Jestelle Ignacio", "Dylan Ostrum", "Zharlene Calilao"] }
      ]
    },
    {
      id: "hiphop", genre: "Pinoy Hip-Hop", color: "#FF5A6E", ink: "#3D0510",
      blurb: "Taglish verses, regional dialects, beats built on OPM love songs. Different sounds, same roots. That is Sports and District 7.",
      lead: { name: "Gabe Tell", role: "External Vice President" },
      advisor: { name: "Malia Feliciano" },
      teams: [
        { name: "Sports", people: ["Isabella Ruckwardt", "Luca Finazzo"] },
        { name: "District 7", people: ["Easton Brock", "Aaron Abbas"] }
      ]
    },
    {
      id: "ppop", genre: "P-Pop", color: "#F58CC0", ink: "#3D0A26",
      blurb: "Synchronized, polished and global-minded. Webmasters and PR tell FACT's story with the same crisp coordination.",
      lead: { name: "Janelle Lapid", role: "Secretary" },
      advisor: { name: "Bianca Cruz" },
      teams: [
        { name: "Webmasters", people: ["Ariana Lewis", "Cole Villanueva"] },
        { name: "Public Relations", people: ["Danika Salcedo", "Izel Alaydrus", "Maria Mendoza"] }
      ]
    },
    {
      id: "filam", genre: "Fil-Am", color: "#7FA6FF", ink: "#06164A",
      blurb: "From Bruno Mars to Olivia Rodrigo, Fil-Am music is foundation and kapamilya. So are the chairs who fund, serve and welcome everyone in.",
      lead: { name: "Latisha Dejon", role: "Treasurer" },
      advisor: { name: "Anthony Ramirez" },
      teams: [
        { name: "Community Service & Fundraising", people: ["Jalen Layog", "Christina Bengson", "An Yao"] },
        { name: "Membership Alumni", people: ["Cathy Cruz", "Andrew Ulibas"] }
      ]
    }
  ],

  /* ---------- Tribes ---------- */
  tribes: [
    { id: "carabaos", name: "Carabaos", color: "#CE1126", ink: "#FFF4D6", wear: "Red", art: "assets/img/carabao.webp", line: "Strong, steady, impossible to move. The red tribe shows up early and stays late." },
    { id: "ibalois", name: "Ibalois", color: "#FCD116", ink: "#0A1030", wear: "Yellow", art: "assets/img/ibaloi.webp", line: "Loud in the best way. If the yellow tribe is in the room, you will hear it." },
    { id: "white-tigers", name: "White Tigers", color: "#FFF4D6", ink: "#0A1030", wear: "White", art: "assets/img/whitetiger.webp", line: "Calm until the games start. The white tribe keeps score and remembers." },
    { id: "sharks", name: "Sharks", color: "#0038A8", ink: "#FFF4D6", wear: "Blue", art: "assets/img/shark.webp", line: "Always moving, always together. The blue tribe travels as a pack." }
  ]
};
