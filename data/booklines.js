// Things the mice say about particular books, keyed by lower-case title. Written by hand for the
// first few; scripts/update.mjs asks Claude for lines about any newly finished book.
window.BOOK_LINES = {
  "the power and the glory": [
    "the whisky priest! a saint with a bottle in his pocket. you did say you love a drunken priest",
    "Mr Tench and his teeth… I can’t stop thinking about that dentist",
    "the lieutenant thought he was the righteous one. Greene loved a muddle like that",
    "that ending, with the new priest knocking at the door. hope never quite dies, does it?",
    "reading it while moving house sounds like a pilgrimage of its own, love"
  ],
  "the trial": [
    "Josef K. never did find out what he was charged with. I double-checked my own papers",
    "“Before the Law” — that doorkeeper still haunts me. the door was meant for him all along",
    "“like a dog!” oof. Kafka didn’t do happy endings",
    "you said dreamy isn’t your genre. Kafka’s dreams are more like Tuesday paperwork",
    "Kafka asked Max Brod to burn it. thank goodness he didn’t listen"
  ],
  "on the calculation of volume 1": [
    "Tara Selter and her eighteenth of November. imagine every day being the same day",
    "I’d go spare if Thomas forgot me every single night",
    "circles and cycles and rules and broken rules — you put it beautifully",
    "an antiquarian book dealer stuck in one day. the library mice are very jealous",
    "so Danish! I had to have a cardamom bun after"
  ],
  "on the calculation of volume 2": [
    "chasing the seasons round Europe to stitch a year out of one day. bold, Tara",
    "a travelogue and a cliffhanger! you’ll be wanting volume three",
    "still the eighteenth of November? I’d have run out of socks",
    "I liked her looking for winter. very sensible, coming from the Yukon"
  ],
  "the red tent": [
    "Dinah finally gets to tell her side. Genesis 34 barely gave her a line",
    "Rachel and her stolen household gods — the teraphim! you noticed the old beliefs too",
    "four mothers in one tent: Leah, Rachel, Zilpah and Bilhah. what a household",
    "you said it made you feel like a damn woman. high praise from a raccoon",
    "Dinah the midwife in Egypt — I liked that part best"
  ],
  "angel down": [
    "a whole book in one sentence! I had to stop for breath twice",
    "an angel caught in the barbed wire of no man’s land… I keep picturing it",
    "Bagger is a scoundrel. a scoundrel with a soul, mind",
    "brawny intellectual language and magical realism — you have expensive taste, dear",
    "four and a half stars! the trenches never looked so strange"
  ],
  "chess": [
    "Dr. B played game after game against himself in that hotel room. split his mind in two",
    "Czentovic the champion could barely write a letter. chess is a funny gift",
    "“chess poisoning”! asking for a mouse who plays a lot…",
    "Zweig finished it just before he died in Brazil. it’s heavier, knowing that",
    "a man whose only comfort is the thing driving him mad — you summed it up well",
    "all of it on an ocean liner to Buenos Aires. I’d have stayed in the bar"
  ]
};
