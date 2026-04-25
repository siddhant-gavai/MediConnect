const symptomMap = [
  {
    keywords: ["headache","migraine","head pain","head ache","dizziness","vertigo","seizure","memory","numbness in hands","tingling"],
    speciality: "Neurology",
    message: "Your symptoms suggest a neurological concern. I recommend consulting a Neurologist.",
    urgent: false
  },
  {
    keywords: ["chest pain","heart pain","palpitation","shortness of breath","breathless","heart attack","irregular heartbeat","chest tightness","bp","blood pressure","hypertension"],
    speciality: "Cardiology",
    message: "⚠️ Chest-related symptoms can be serious. Please consult a Cardiologist immediately. If severe, call emergency services.",
    urgent: true
  },
  {
    keywords: ["skin","rash","acne","itching","itch","pimple","eczema","psoriasis","allergy","hives","dark spots","hair fall","dandruff"],
    speciality: "Dermatology",
    message: "Your symptoms relate to skin health. A Dermatologist can help you.",
    urgent: false
  },
  {
    keywords: ["eye","vision","blur","blurry","specs","glasses","eye pain","red eye","dry eye","cataract","glaucoma","eye infection"],
    speciality: "Ophthalmology",
    message: "Your symptoms suggest an eye-related issue. An Ophthalmologist will be able to assist.",
    urgent: false
  },
  {
    keywords: ["child","baby","infant","kids","toddler","fever","vaccination","growth","pediatric","my son","my daughter","my kid"],
    speciality: "Pediatrics",
    message: "For children's health concerns, a Pediatrician is the right specialist.",
    urgent: false
  },
  {
    keywords: ["teeth","tooth","dental","gum","cavity","braces","toothache","wisdom tooth","mouth","oral","bad breath"],
    speciality: "Dental",
    message: "Your concern seems dental in nature. A Dentist can diagnose and treat this.",
    urgent: false
  },
  {
    keywords: ["bone","joint","knee","back pain","spine","shoulder","fracture","arthritis","ortho","slip disc","hip pain","wrist pain"],
    speciality: "Orthopedic",
    message: "Your symptoms suggest a bone or joint issue. An Orthopedic specialist is recommended.",
    urgent: false
  },
  {
    keywords: ["anxiety","depression","stress","mental","mood","sleep","insomnia","panic","phobia","ocd","sad","lonely","suicidal"],
    speciality: "Psychiatry",
    message: "Mental health is important. Speaking with a Psychiatrist can really help.",
    urgent: false
  },
];
export default symptomMap;
