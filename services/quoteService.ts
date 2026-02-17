
export const educationalQuotes = [
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Intelligence plus character—that is the goal of true education.", author: "Martin Luther King Jr." },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" }
];

export const appreciationQuotes = [
  "Your neural pathways are firing at peak efficiency!",
  "Exceptional synthesis. The knowledge matrix is proud.",
  "Data integration successful. You are evolving.",
  "A brilliant display of cognitive prowess.",
  "Knowledge is the ultimate currency, and you're getting rich.",
  "Signal verified: Your intellect is unmatched today.",
  "The learning vector is steep, yet you climb it with ease."
];

export const getRandomQuote = (type: 'educational' | 'appreciation') => {
  const list = type === 'educational' ? educationalQuotes : appreciationQuotes;
  return list[Math.floor(Math.random() * list.length)];
};
