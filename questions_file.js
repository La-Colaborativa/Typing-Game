
// ----- Answer Pools ----- //
const PERSONAL_PRONOUNS_LIST = ["I", "you", "he", "him", "his", "she", "her", "hers", "it", "we", "they", "me", "my", "us", "them"];
const PREPOSITION_LIST = ["in", "on", "under", "above", "between", "behind", "by", "from", "next to"];
const DEMONSTRATIVES_LIST = ["this", "that", "these", "those"];
const RANDOM_NUMBER_LIST = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ANIMAL_LOCATION_LIST =
  ["On top of the tree.", "On the house.", "Under the desk.", "On the bed.", "On the table.",
    "Next to the door.", "Between the bed and chair", "By the chair.", "Under the cat.", "In the box",
    "Under the blanket.", "Between the beds.", "Above the trash bin.", "Under the bed.", "In the air.",
    "Behind someone.", "Behind the curtains.", "With the owner.", "On the bridge.", "In the yard.", "By the window.",
    "On the chair.", "In the trash.", "On the blanket.", "Under the dog.", "Above the fishtank.", "On a flower pot.",
    "On a computer", "Behind the desk"
  ];
const PERSON_LOCATION_LIST =
  [ "In the kitchen.", "In the living room.", "In the bathroom.", "In the office.", "In the basement.", "In the attic.",
    "In the yard.", "In the guest room", "In the laundry room.", "In the closet.", "In the hall."
  ];
const TEST_LIST = ["Hi", "testing!"];

RANDOM_NUMBER_LIST.forEach(item => { // Convert nums to strings. Wanted to make it so you can easily change the numbers yourself at any time.
  RANDOM_NUMBER_LIST[item] = String(item)
});

// ----- TEXT ARRAY EXAMPLE ----- //
/* Layout: question | correct answer(s) | possible answers */
/* ɴᴏᴛᴇ: only capitalize I, nothing else. The shouldCapitalizeBlank function will determine capitalization. */
const pronounsQuestions = [
  ["How can ___ do this?", ["I", "you", "we"], PERSONAL_PRONOUNS_LIST], // Example of multiple answers (list).
  ["___ am a cook.", "I", [PERSONAL_PRONOUNS_LIST, DEMONSTRATIVES_LIST]], // Example of multiple pools for potential answers (nested list).
  ["___ is a great man.", "he", PERSONAL_PRONOUNS_LIST],
  ["___ is cleaning her own room.", "she", PERSONAL_PRONOUNS_LIST],
  ["She ___ a receptionist", "is", PERSONAL_PRONOUNS_LIST],
  ["___ should go to my house together.", "we", PERSONAL_PRONOUNS_LIST],
  ["Thank you for the chocolate. Can you put ___ over there?", "it", PERSONAL_PRONOUNS_LIST],
  ["Alex lives with ___ mother.", "his", PERSONAL_PRONOUNS_LIST],
  ["She is ___ mother.", "my", PERSONAL_PRONOUNS_LIST],
  ["He is ___ father.", "my", [PERSONAL_PRONOUNS_LIST, TEST_LIST]],
  ["Carl and ___ are going to the museum.", "I", PERSONAL_PRONOUNS_LIST],
  ["Is this gift for ___? Thank you!", "me", PERSONAL_PRONOUNS_LIST],
  ["___ can go together.", ["they", "we"], PERSONAL_PRONOUNS_LIST],
  ["I talked to Sarah and Paul. ___ are great!", "they", PERSONAL_PRONOUNS_LIST],
  ["Can you put ___ on the floor.", "it", PERSONAL_PRONOUNS_LIST],
  ["___ is going to the store!", ["he", "she"], PERSONAL_PRONOUNS_LIST],
  ["___ watched a movie last night. It was good!", ["I", "they", "we"], PERSONAL_PRONOUNS_LIST]
];
// ---- IMAGE ARRAY EXAMPLE ---- //
/* Layout: question | correct answer(s) | possible answers | image reference */
const prepositionsQuestions = [
  ["I think the cat is ___ the box.", "in", PREPOSITION_LIST, './images/esol/preposition/animals/cat-in-box.png'],
  ["Carlos is ___ the door.", "behind", PREPOSITION_LIST, './images/esol/preposition/people/carlos-behind-door.png'],
  ["The pencil is ___ the eraser.", "next to", PREPOSITION_LIST, './images/esol/preposition/others/pencil-next-to-eraser.png'],
  ["The hammock is ___ the trees.", "between", PREPOSITION_LIST, './images/esol/preposition/others/hammock-between-trees.png'],
  ["The dog is ___ the table.", "under", PREPOSITION_LIST, './images/esol/preposition/animals/dog-under-table.png'],
  ["The dog is ___ the table.", "on", PREPOSITION_LIST, './images/esol/preposition/animals/dog-on-table-var2.png'],
  ["The cat is ___ the kitchen.", "in", PREPOSITION_LIST, './images/esol/preposition/animals/cat-in-kitchen.png'],
  ["There are two brooms ____ the table.", "next to", PREPOSITION_LIST, './images/esol/preposition/others/brooms-next-to-table.png'],
  ["The exit sign is ___ the stairs.", ["next to", "above"], PREPOSITION_LIST, './images/esol/preposition/others/exit-next-to-stairs.png'],
  ["The closet is ___ the window.", ["next to", "by"], PREPOSITION_LIST, './images/esol/preposition/others/closet-next-to-window.png'],
  ["The bed is ___ the window.", ["by", "next to"], PREPOSITION_LIST, './images/esol/preposition/others/bed-by-window.png'],
  ["I am ___ the supermarket.", "in", PREPOSITION_LIST, './images/esol/preposition/people/person-in-supermarket.png'],
  ["The person is ___ the hotel.", ["next to", "by"], PREPOSITION_LIST, './images/esol/preposition/people/person-next-to-hotel.png'],
  
  ["Where is the dog?", "On the table.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/dog-on-table.png'],
  ["Where is the cat?", "Behind the door.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/cat-behind-door.png'],
  ["Where is the chef?", "In the kitchen.", PERSON_LOCATION_LIST, './images/esol/preposition/people/chef-in-kitchen.png'],
  ["Where is the receptionist?", "Behind the desk.", PERSON_LOCATION_LIST, './images/esol/preposition/people/receptionist-behind-desk.png'],
  ["Where is the cat?", "Under the blanket.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/cat-under-blanket.png'],
  ["Where is the cat?", "On the chair.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/cat-on-chair.png'],
  ["Where is the dog?", "On the chair.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/dog-on-chair.png'],
  ["Where is the toy?", "In the trash.", ANIMAL_LOCATION_LIST, './images/esol/preposition/others/toy-in-trash.png'],
  ["Where is the tray?", "On the table.", ANIMAL_LOCATION_LIST, './images/esol/preposition/others/tray-on-table.png'],
  ["Where is the cat at?", ["Behind someone.", "With the owner."], ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/cat-behind-someone.png'],
  ["Where is the cat?", "On a flower pot.", ANIMAL_LOCATION_LIST, './images/esol/preposition/animals/cat-on-flower-pot.png']
];
const demonstrativesQuestions = [
  ["___ cat is very cute!", "that", DEMONSTRATIVES_LIST, './images/esol/demonstrative/animals/that-cat.png'],
  ["___ cats are playing around.", "these", DEMONSTRATIVES_LIST, './images/esol/demonstrative/animals/these-cats.png'],
  ["Can you see ___ animals?", "those", DEMONSTRATIVES_LIST, './images/esol/demonstrative/animals/those-animals.png'],
  ["Do you see ___ squirrel?", "that", DEMONSTRATIVES_LIST, './images/esol/demonstrative/animals/that-squirrel.png'],
  ["___ book is mine.", "this", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/this-book.png'],
  ["I think ___ is yours.", "this", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/this-eraser.png'],
  ["___ chair is broken!", "that", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/that-chair.png'],
  ["___ papers are important.", "these", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/these-papers.png'],
  ["___ pen writes well.", "this", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/this-pen.png'],
  ["___ is Peter's house.", "that", DEMONSTRATIVES_LIST, './images/esol/demonstrative/others/that-house.png']
];
const quantityQuestions = [
  ["How many cats are there?", 1, RANDOM_NUMBER_LIST, './images/esol/quantity/animals/how-many-cats-1.png'],
  ["How many dogs are there?", 2, RANDOM_NUMBER_LIST, './images/esol/quantity/animals/how-many-dogs-2.png'],
  ["How many pencils are there?", 3, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-pencils-3.png'],
  ["How many pencils do you see?", 5, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-pencils-5.png'],
  ["How many pencils are there?", 6, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-pencils-6.png'],
  ["How many erasers are there?", 2, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-erasers-2.png'],
  ["How many erasers are there?", 4, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-erasers-4.png'],
  ["How many chairs do you see?", 1, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-chairs-1.png'],
  ["How many chairs do you see?", 2, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-chairs-2.png'],
  ["How many chairs do you see?", 3, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-chairs-3.png'],
  ["How many ants are there?", 9, RANDOM_NUMBER_LIST, './images/esol/quantity/animals/how-many-ants-9.png'],
  ["How many ants are there?", 8, RANDOM_NUMBER_LIST, './images/esol/quantity/animals/how-many-ants-8.png'],
  ["How many windows does the house have?", 5, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-windows-5.png'],
  ["How many toys can you see?", 7, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-toys-7.png'],
  ["How many toys are there?", 5, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-toys-5.png'],
  ["How many bedrooms are there?", 2, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-bedrooms-2.png'],
  ["How many beds are in the room?", 2, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-beds-2.png'],
  ["How many brooms are in the kitchen?", 1, RANDOM_NUMBER_LIST, './images/esol/quantity/others/how-many-brooms-1.png']
];

export { pronounsQuestions, prepositionsQuestions, demonstrativesQuestions, quantityQuestions };