import { Test, Question } from './types';

export const SCIENCE_TESTS: Record<number, Record<string, { topic: Test; skills: Test }>> = {
  1: {
    'Autumn 1': {
      topic: {
        id: 'y1-a1-topic',
        title: 'Year 1 - Autumn 1: Everyday Materials (Topic Study) 🪵',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-a1-topic-q1',
            text: "Is a 'spoon' the name of the object or the material?",
            options: ['Object', 'Material'],
            correctAnswer: 'Object',
            marks: 2,
            hint: 'Remember, a spoon is the name of the thing you hold, so it is the object!'
          },
          {
            id: 'y1-a1-topic-q2',
            text: "True or False: 'Wood' is a material used to make things.",
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Wood is a material that comes from trees and is used to build objects like chairs!'
          },
          {
            id: 'y1-a1-topic-q3',
            text: 'Which of these is a material?',
            options: ['Chair', 'Plastic', 'Fork'],
            correctAnswer: 'Plastic',
            marks: 2,
            hint: 'A chair and a fork are objects; plastic is the material we use to make them!'
          },
          {
            id: 'y1-a1-topic-q4',
            text: 'Look at a pencil. What is the main material it is made from?',
            options: ['Glass', 'Wood', 'Water'],
            correctAnswer: 'Wood',
            marks: 2,
            hint: 'Most pencils are made of wood because it is strong and easy to hold!'
          },
          {
            id: 'y1-a1-topic-q5',
            text: 'Select the two objects in this list. (Select all correct)',
            options: ['Metal', 'Cup', 'Toy Car', 'Rock'],
            correctAnswer: 'Cup, Toy Car',
            marks: 2,
            hint: 'A cup and a toy car are things you can play with or use, making them objects!'
          }
        ]
      },
      skills: {
        id: 'y1-a1-skills',
        title: 'Year 1 - Autumn 1: Everyday Materials (Working Scientifically) 🎒',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-a1-skills-q1',
            text: 'When looking at a toy car, which of these is a scientific question?',
            options: ['Is the car red?', 'What material is the car made from?', 'Is the car fast?'],
            correctAnswer: 'What material is the car made from?',
            marks: 2,
            hint: 'A scientific question helps us find out about materials, like what something is made of!'
          },
          {
            id: 'y1-a1-skills-q2',
            text: 'True or False: Scientists ask questions to help them learn how things work.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientists are very curious and always ask "why" or "how" things are made!'
          },
          {
            id: 'y1-a1-skills-q3',
            text: 'You are looking at a shiny metal spoon. What can you see when you look closely?',
            options: ['It is soft', 'It reflects light and is shiny', 'It smells like flowers'],
            correctAnswer: 'It reflects light and is shiny',
            marks: 2,
            hint: 'When we look closely, we use our eyes to see details like how shiny a material is!'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y1-a2-topic',
        title: 'Year 1 - Autumn 2: Everyday Materials (Topic Study) 🧊',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-a2-topic-q1',
            text: 'What word describes a material that does NOT let water through?',
            options: ['Absorbent', 'Waterproof', 'Soft'],
            correctAnswer: 'Waterproof',
            marks: 2,
            hint: 'Waterproof materials like plastic keep us dry when it rains!'
          },
          {
            id: 'y1-a2-topic-q2',
            text: 'True or False: Glass is a very stretchy material.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Glass is hard and stiff; it would break if you tried to stretch it!'
          },
          {
            id: 'y1-a2-topic-q3',
            text: 'Select the properties that describe a rock. (Select all correct)',
            options: ['Hard', 'Stretchy', 'Strong'],
            correctAnswer: 'Hard, Strong',
            marks: 2,
            hint: 'Rocks are hard and strong, which is why we use them to build things!'
          }
        ]
      },
      skills: {
        id: 'y1-a2-skills',
        title: 'Year 1 - Autumn 2: Everyday Materials (Working Scientifically) ☔',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-a2-skills-q1',
            text: 'Which question would help you find out if a material is waterproof?',
            options: ['Does it feel nice?', 'Does water stay on top or soak in?', 'Is it heavy?'],
            correctAnswer: 'Does water stay on top or soak in?',
            marks: 2,
            hint: 'This question helps us test if a material will keep us dry in the rain!'
          },
          {
            id: 'y1-a2-skills-q2',
            text: 'True or False: Asking "Is this rock hard?" is a scientific question.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: "Yes! We ask questions about properties like 'hard' or 'soft' to learn about materials."
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y1-s1-topic',
        title: 'Year 1 - Spring 1: Animals Including Humans (Topic Study) 🦁',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-s1-topic-q1',
            text: "Which animal belongs to the 'Bird' group?",
            options: ['Frog', 'Robin', 'Snake'],
            correctAnswer: 'Robin',
            marks: 2,
            hint: 'A robin is a bird because it has feathers and wings!'
          },
          {
            id: 'y1-s1-topic-q2',
            text: 'True or False: A goldfish is a type of mammal.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'A goldfish is a fish because it lives underwater and breathes with gills!'
          },
          {
            id: 'y1-s1-topic-q3',
            text: 'Which animal is a reptile?',
            options: ['Dog', 'Lizard', 'Chicken'],
            correctAnswer: 'Lizard',
            marks: 2,
            hint: 'Lizards are reptiles; they usually have scaly skin and lay eggs!'
          }
        ]
      },
      skills: {
        id: 'y1-s1-skills',
        title: 'Year 1 - Spring 1: Animals Including Humans (Working Scientifically) 🦉',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-s1-skills-q1',
            text: 'Which question helps us find out what an animal eats?',
            options: ['Is the animal fast?', 'Is it a carnivore, herbivore or omnivore?', 'Is it pretty?'],
            correctAnswer: 'Is it a carnivore, herbivore or omnivore?',
            marks: 2,
            hint: 'These scientific words tell us if an animal eats meat, plants, or both!'
          },
          {
            id: 'y1-s1-skills-q2',
            text: 'True or False: We can ask a question to find out which animal group a pet belongs to.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: "Asking questions about an animal's body helps us know if it's a bird, fish, or mammal!"
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y1-s2-topic',
        title: 'Year 1 - Spring 2: Animals Including Humans (Topic Study) 🐰',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-s2-topic-q1',
            text: 'Which part of your body do you use to walk?',
            options: ['Hands', 'Legs', 'Ears'],
            correctAnswer: 'Legs',
            marks: 2,
            hint: 'Our legs are very strong and help us move around and run!'
          },
          {
            id: 'y1-s2-topic-q2',
            text: 'True or False: Your elbows help your arms to bend.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Elbows are the special joints that let our arms fold!'
          },
          {
            id: 'y1-s2-topic-q3',
            text: 'Select the two parts of your face. (Select all correct)',
            options: ['Nose', 'Eyes', 'Toes', 'Knee'],
            correctAnswer: 'Nose, Eyes',
            marks: 2,
            hint: 'Your nose and eyes are parts of your face!'
          }
        ]
      },
      skills: {
        id: 'y1-s2-skills',
        title: 'Year 1 - Spring 2: Animals Including Humans (Working Scientifically) 👂',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-s2-skills-q1',
            text: 'Which question would you ask to test your sense of smell?',
            options: ['Can I hear that?', 'Can I smell this flower with my nose?', 'Is it loud?'],
            correctAnswer: 'Can I smell this flower with my nose?',
            marks: 2,
            hint: 'Asking if we can smell something helps us understand our sense of smell!'
          },
          {
            id: 'y1-s2-skills-q2',
            text: 'True or False: Asking "Which part of my body is best for feeling things?" is a scientific question.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'This is a great question to investigate using our sense of touch!'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y1-su1-topic',
        title: 'Year 1 - Summer 1: Plants (Topic Study) 🌻',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-su1-topic-q1',
            text: 'A plant that grows in a garden because someone planted it is a...',
            options: ['Wild plant', 'Garden plant', 'Weed'],
            correctAnswer: 'Garden plant',
            marks: 2,
            hint: 'Garden plants are ones that people choose to grow in flowerbeds!'
          },
          {
            id: 'y1-su1-topic-q2',
            text: 'True or False: Dandelions are often called wild plants or weeds.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Dandelions grow naturally in many places without being planted!'
          },
          {
            id: 'y1-su1-topic-q3',
            text: 'Select all the parts of a flowering plant. (Select all correct)',
            options: ['Roots', 'Stem', 'Leaves', 'Petals'],
            correctAnswer: 'Roots, Stem, Leaves, Petals',
            marks: 2,
            hint: 'Roots, stems, leaves, and petals are all parts of a plant!'
          }
        ]
      },
      skills: {
        id: 'y1-su1-skills',
        title: 'Year 1 - Summer 1: Plants (Working Scientifically) 🌿',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-su1-skills-q1',
            text: 'Which question helps us find out what a plant needs to stay healthy?',
            options: ['Is the plant pretty?', 'Does the plant need water and light to grow?', 'What is the plant\'s name?'],
            correctAnswer: 'Does the plant need water and light to grow?',
            marks: 2,
            hint: 'Asking about water and light helps us investigate how plants grow!'
          },
          {
            id: 'y1-su1-skills-q2',
            text: 'True or False: A scientist might ask "Where do plants grow in our school?"',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Yes! This question helps us explore and find different plants in our school.'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y1-su2-topic',
        title: 'Year 1 - Summer 2: Plants (Topic Study) 🌳',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-su2-topic-q1',
            text: 'A tree that loses its leaves in the Winter is called...',
            options: ['Evergreen', 'Deciduous', 'Plastic'],
            correctAnswer: 'Deciduous',
            marks: 2,
            hint: 'Deciduous trees change with the seasons and drop their leaves in Autumn!'
          },
          {
            id: 'y1-su2-topic-q2',
            text: 'True or False: An evergreen tree stays green all year round.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Evergreen trees keep their green leaves even in the cold Winter!'
          },
          {
            id: 'y1-su2-topic-q3',
            text: 'Select the trees that are evergreen. (Select all correct)',
            options: ['Pine tree', 'Holly tree', 'Apple tree'],
            correctAnswer: 'Pine tree, Holly tree',
            marks: 2,
            hint: 'Pine and holly trees stay green all through the Winter!'
          }
        ]
      },
      skills: {
        id: 'y1-su2-skills',
        title: 'Year 1 - Summer 2: Plants (Working Scientifically) 🔍',
        subject: 'science',
        yearGroup: 1,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y1-su2-skills-q1',
            text: 'Which question helps us tell the difference between trees?',
            options: ['Is the tree big?', 'Is the tree deciduous or evergreen?', 'Does the tree have a name?'],
            correctAnswer: 'Is the tree deciduous or evergreen?',
            marks: 2,
            hint: 'These scientific words help us know if a tree loses its leaves or stays green!'
          },
          {
            id: 'y1-su2-skills-q2',
            text: 'True or False: Asking "What are the parts of a tree?" is a scientific question.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'This question helps us learn about trunks, branches, and leaves!'
          }
        ]
      }
    }
  },
  2: {
    'Autumn 1': {
      topic: {
        id: 'y2-a1-topic',
        title: 'Year 2 - Autumn 1: Everyday Materials (Topic Study) 🧱',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-a1-topic-q1',
            text: 'Why is glass used for a window instead of brick?',
            options: ['Because it is see-through', 'Because it is soft', 'Because it is bendy'],
            correctAnswer: 'Because it is see-through',
            marks: 2,
            hint: 'Remember, we need to see through windows to look outside, and glass is transparent!'
          },
          {
            id: 'y2-a1-topic-q2',
            text: 'True or False: Metal is a good material for a spoon because it is strong and won\'t melt in hot soup.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Metal is very strong and can handle heat, which is why we use it for spoons!'
          },
          {
            id: 'y2-a1-topic-q3',
            text: 'Which material would be BEST for a bath towel?',
            options: ['Plastic', 'Fabric', 'Glass'],
            correctAnswer: 'Fabric',
            marks: 2,
            hint: 'A towel needs to soak up water, and fabric is absorbent while plastic is not!'
          }
        ]
      },
      skills: {
        id: 'y2-a1-skills',
        title: 'Year 2 - Autumn 1: Everyday Materials (Working Scientifically) ☔',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-a1-skills-q1',
            text: 'If you want to find out which material is best for an umbrella, which question should you ask?',
            options: ['Is the material pretty?', 'Is the material waterproof or absorbent?', 'How much does it cost?'],
            correctAnswer: 'Is the material waterproof or absorbent?',
            marks: 2,
            hint: 'This question helps us investigate the properties of the material to see if it will keep us dry!'
          },
          {
            id: 'y2-a1-skills-q2',
            text: 'True or False: You can use a book or a video to help answer a science question about materials.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'We use secondary sources like books to find out facts that we cannot test ourselves!'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y2-a2-topic',
        title: 'Year 2 - Autumn 2: Everyday Materials (Topic Study) 🌀',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-a2-topic-q1',
            text: 'Which action involves pulling the ends of an object to make it longer?',
            options: ['Squashing', 'Stretching', 'Bending'],
            correctAnswer: 'Stretching',
            marks: 2,
            hint: 'When you pull something to make it longer, like a rubber band, you are stretching it!'
          },
          {
            id: 'y2-a2-topic-q2',
            text: 'True or False: You can change the shape of a rock by squashing it with your hands.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Rocks are very rigid and strong; our hands aren\'t strong enough to squash them!'
          },
          {
            id: 'y2-a2-topic-q3',
            text: 'What action are you doing when you fold a piece of paper in half?',
            options: ['Twisting', 'Bending', 'Stretching'],
            correctAnswer: 'Bending',
            marks: 2,
            hint: 'Folding or curving a material is called bending!'
          }
        ]
      },
      skills: {
        id: 'y2-a2-skills',
        title: 'Year 2 - Autumn 2: Everyday Materials (Working Scientifically) 📏',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-a2-skills-q1',
            text: 'Which question helps us learn about how an object changes shape?',
            options: ['What colour is it?', 'Can it be squashed, bent, twisted, or stretched?', 'Does it smell?'],
            correctAnswer: 'Can it be squashed, bent, twisted, or stretched?',
            marks: 2,
            hint: 'This question helps us investigate if a material is flexible or rigid!'
          },
          {
            id: 'y2-a2-skills-q2',
            text: 'True or False: Scientists ask "What is rubber used for today?" to learn about its purposes.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Asking about how we use materials today helps us understand why they were invented!'
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y2-s1-topic',
        title: 'Year 2 - Spring 1: Living Things & Habitats (Topic Study) 🪵',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-s1-topic-q1',
            text: 'Which of these is a sign that something is ALIVE?',
            options: ['It stays still', 'It grows', 'It is made of plastic'],
            correctAnswer: 'It grows',
            marks: 2,
            hint: 'All living things grow over time, just like you and the plants in our garden!'
          },
          {
            id: 'y2-s1-topic-q2',
            text: 'True or False: A fallen leaf on the ground is considered \'dead\' because it was once part of a living tree.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Once a leaf falls and stops growing, it is called \'dead\' because it was once alive!'
          },
          {
            id: 'y2-s1-topic-q3',
            text: 'Where would you be most likely to find a woodlouse?',
            options: ['On a hot, sunny wall', 'Under a dark, damp log', 'In a swimming pool'],
            correctAnswer: 'Under a dark, damp log',
            marks: 2,
            hint: 'Woodlice love dark, damp microhabitats where they can stay cool!'
          }
        ]
      },
      skills: {
        id: 'y2-s1-skills',
        title: 'Year 2 - Spring 1: Living Things & Habitats (Working Scientifically) 🐜',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-s1-skills-q1',
            text: 'Which question should you ask to find out if an object is \'dead\'?',
            options: ['Is it made of metal?', 'Did it used to be part of a living thing?', 'Is it blue?'],
            correctAnswer: 'Did it used to be part of a living thing?',
            marks: 2,
            hint: 'Objects that were once part of a living thing, like a fallen leaf, are called \'dead\'!'
          },
          {
            id: 'y2-s1-skills-q2',
            text: 'True or False: Describing how a habitat changes from Winter to Spring is "observing changes over time."',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Watching how trees grow leaves as the seasons change is a great way to observe science over time!'
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y2-s2-topic',
        title: 'Year 2 - Spring 2: Animals Including Humans (Topic Study) 🐣',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-s2-topic-q1',
            text: 'What is the name for a baby animal?',
            options: ['Adult', 'Offspring', 'Parent'],
            correctAnswer: 'Offspring',
            marks: 2,
            hint: 'Offspring is the scientific word for babies that grow up to be adults!'
          },
          {
            id: 'y2-s2-topic-q2',
            text: 'True or False: A kitten grows up to become a cat.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Well done! A kitten is the young offspring of a cat.'
          },
          {
            id: 'y2-s2-topic-q3',
            text: 'What are the three basic needs that all animals need to survive?',
            options: ['Toys, beds, and TV', 'Water, food, and air', 'Sun, sand, and sea'],
            correctAnswer: 'Water, food, and air',
            marks: 2,
            hint: 'To stay alive, every animal needs air to breathe, water to drink, and food to eat!'
          }
        ]
      },
      skills: {
        id: 'y2-s2-skills',
        title: 'Year 2 - Spring 2: Animals Including Humans (Working Scientifically) ⏱️',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-s2-skills-q1',
            text: 'Before you start an experiment about your senses, what is it called when you say what you think will happen?',
            options: ['A secret', 'A prediction', 'A result'],
            correctAnswer: 'A prediction',
            marks: 2,
            hint: 'A prediction is a clever guess about what might happen in our science test!'
          },
          {
            id: 'y2-s2-skills-q2',
            text: 'True or False: Using the word \'offspring\' instead of \'baby\' is using scientific language.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientists use special words like \'offspring\' to be very clear in their explanations!'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y2-su1-topic',
        title: 'Year 2 - Summer 1: Plants (Topic Study) 🌱',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-su1-topic-q1',
            text: 'What can a bulb do that a seed usually cannot?',
            options: ['Grow without soil immediately', 'Grow without water', 'Fly'],
            correctAnswer: 'Grow without soil immediately',
            marks: 2,
            hint: 'Bulbs have a store of food inside, so they can start growing even without soil!'
          },
          {
            id: 'y2-su1-topic-q2',
            text: 'True or False: Both seeds and bulbs can grow into plants.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Whether they start as a tiny seed or a round bulb, they both grow into plants!'
          },
          {
            id: 'y2-su1-topic-q3',
            text: 'What happens to a plant if it has NO light?',
            options: ['It grows very tall and green', 'It becomes weak and yellow', 'It turns into a tree'],
            correctAnswer: 'It becomes weak and yellow',
            marks: 2,
            hint: 'Without light, plants cannot make their own food, so they lose their healthy green colour.'
          }
        ]
      },
      skills: {
        id: 'y2-su1-skills',
        title: 'Year 2 - Summer 1: Plants (Working Scientifically) 🪴',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-su1-skills-q1',
            text: 'To make a test \'fair\', what should you do when comparing two plants?',
            options: ['Give them different amounts of light', 'Change only one thing and keep everything else the same', 'Put them in different rooms'],
            correctAnswer: 'Change only one thing and keep everything else the same',
            marks: 2,
            hint: 'A fair test means only changing the one thing we are investigating, like water!'
          },
          {
            id: 'y2-su1-skills-q2',
            text: 'What is the correct order for your plant investigation?',
            options: ['Result, then Prediction, then Method', 'Prediction, then Method, then Result', 'Result, then Method'],
            correctAnswer: 'Prediction, then Method, then Result',
            marks: 2,
            hint: 'Scientists always plan first, do the test, and then look at the results!'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y2-su2-topic',
        title: 'Year 2 - Summer 2: Animals Including Humans (Topic Study) 🍎',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-su2-topic-q1',
            text: 'Why is exercise important for our bodies?',
            options: ['To keep us fit and healthy', 'To make us tired', 'To change our hair colour'],
            correctAnswer: 'To keep us fit and healthy',
            marks: 2,
            hint: 'Exercise makes our muscles and heart stronger!'
          },
          {
            id: 'y2-su2-topic-q2',
            text: 'True or False: Your heart beats faster when you run or jump.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Yes! Your heart pumps faster to send more blood to your working muscles.'
          },
          {
            id: 'y2-su2-topic-q3',
            text: 'What is a \'balanced diet\'?',
            options: ['Eating only sweets', 'Eating different types of food in the right amounts', 'Eating once a week'],
            correctAnswer: 'Eating different types of food in the right amounts',
            marks: 2,
            hint: 'A balanced diet means eating a mix of fruit, vegetables, protein, and dairy!'
          }
        ]
      },
      skills: {
        id: 'y2-su2-skills',
        title: 'Year 2 - Summer 2: Animals Including Humans (Working Scientifically) 🏃',
        subject: 'science',
        yearGroup: 2,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y2-su2-skills-q1',
            text: 'Which question helps us investigate the effects of exercise?',
            options: ['What is your favourite sport?', 'How many star jumps can you do in one minute?', 'Do you like gym class?'],
            correctAnswer: 'How many star jumps can you do in one minute?',
            marks: 2,
            hint: 'This question sets up a test that we can actually measure and count!'
          },
          {
            id: 'y2-su2-skills-q2',
            text: 'Before you exercise, you guess that your heart will beat faster. What is this guess called?',
            options: ['A result', 'A prediction', 'A measurement'],
            correctAnswer: 'A prediction',
            marks: 2,
            hint: 'A prediction is when we use our brains to guess what will happen in an investigation!'
          }
        ]
      }
    }
  },
  3: {
    'Autumn 1': {
      topic: {
        id: 'y3-a1-topic',
        title: 'Year 3 - Autumn 1: Light (Topic Study) 💡',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-a1-topic-q1',
            text: 'Which statement best describes what \'dark\' is?',
            options: ['A type of black light', 'The absence of light', 'A foggy day'],
            correctAnswer: 'The absence of light',
            marks: 2,
            hint: 'Dark is the scientific term for the complete absence of light; we need light to see because it enters our eyes from objects.'
          },
          {
            id: 'y3-a1-topic-q2',
            text: 'True or False: We can see perfectly in a room with absolutely no light sources.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'To see anything, our eyes must receive light. Without a light source, the room is in total darkness.'
          },
          {
            id: 'y3-a1-topic-q3',
            text: 'What happens when light hits a mirror?',
            options: ['It is absorbed', 'It is reflected', 'It disappears'],
            correctAnswer: 'It is reflected',
            marks: 2,
            hint: 'Reflection occurs when light bounces off a surface. Shiny, flat surfaces like mirrors reflect light very well.'
          }
        ]
      },
      skills: {
        id: 'y3-a1-skills',
        title: 'Year 3 - Autumn 1: Light (Working Scientifically) 🕶️',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-a1-skills-q1',
            text: 'Which of these is a scientific question you could investigate about shadows?',
            options: ['Are shadows scary?', 'Does the length of a shadow change if the lamp moves?', 'What is the best colour for a shadow?'],
            correctAnswer: 'Does the length of a shadow change if the lamp moves?',
            marks: 2,
            hint: 'A scientific question must be something we can test and measure to find an answer.'
          },
          {
            id: 'y3-a1-skills-q2',
            text: 'To make a test \'fair\' when measuring shadows, what should you keep the same?',
            options: ['The object being used', 'The brightness of the light', 'Both the object and the starting distance'],
            correctAnswer: 'Both the object and the starting distance',
            marks: 2,
            hint: 'In a fair test, you only change one variable (the thing you are testing) and keep everything else the same.'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y3-a2-topic',
        title: 'Year 3 - Autumn 2: Forces and Magnets (Topic Study) 🧲',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-a2-topic-q1',
            text: 'Which of these is a non-contact force?',
            options: ['Friction', 'Magnetic attraction', 'Pushing a swing'],
            correctAnswer: 'Magnetic attraction',
            marks: 2,
            hint: 'Non-contact forces act from a distance without touching, like magnetic fields!'
          },
          {
            id: 'y3-a2-topic-q2',
            text: 'True or False: Every magnet has two distinct poles, North and South.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'All magnets have two poles. Opposite poles attract, while like poles repel each other!'
          }
        ]
      },
      skills: {
        id: 'y3-a2-skills',
        title: 'Year 3 - Autumn 2: Forces and Magnets (Working Scientifically) 📈',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-a2-skills-q1',
            text: 'Which surface would likely cause the MOST friction for a toy car?',
            options: ['Smooth ice', 'A thick carpet', 'A polished wooden floor'],
            correctAnswer: 'A thick carpet',
            marks: 2,
            hint: 'Friction is the resistance created when two surfaces rub together; rough surfaces like carpet create more friction than smooth ones.'
          },
          {
            id: 'y3-a2-skills-q2',
            text: 'True or False: An object will move further and faster on a surface with low friction.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Low friction, like on ice, allows objects to slide easily because there is less resistance to the movement.'
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y3-s1-topic',
        title: 'Year 3 - Spring 1: Rocks (Topic Study) 🪨',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-s1-topic-q1',
            text: 'Which type of rock is formed from melted materials (magma) that cool and harden?',
            options: ['Sedimentary', 'Igneous', 'Metamorphic'],
            correctAnswer: 'Igneous',
            marks: 2,
            hint: 'Igneous rock is formed during volcanic processes when liquid rock cools down and becomes solid.'
          },
          {
            id: 'y3-s1-topic-q2',
            text: 'True or False: Sedimentary rocks are often formed from layers of sediment pressed together over a long time.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Sedimentary rocks, like sandstone, are made from layers of sand or mud that are squashed together over millions of years.'
          },
          {
            id: 'y3-s1-topic-q3',
            text: 'What property would describe a rock that does not let water through?',
            options: ['Permeable', 'Impermeable', 'Absorbent'],
            correctAnswer: 'Impermeable',
            marks: 2,
            hint: 'Impermeable means the rock has no tiny holes for water to pass through.'
          }
        ]
      },
      skills: {
        id: 'y3-s1-skills',
        title: 'Year 3 - Spring 1: Rocks (Working Scientifically) 🔬',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-s1-skills-q1',
            text: 'When investigating rocks, what are you doing when you decide to look for crystals or holes?',
            options: ['Making a prediction', 'Making a decision about what to observe', 'Presenting results'],
            correctAnswer: 'Making a decision about what to observe',
            marks: 2,
            hint: 'Scientists must choose which specific features (like texture or crystals) will help them identify the rock.'
          },
          {
            id: 'y3-s1-skills-q2',
            text: 'What can you use to help you identify a rock you have never seen before?',
            options: ['A scientific identification key', 'A calculator', 'A storybook'],
            correctAnswer: 'A scientific identification key',
            marks: 2,
            hint: 'A key is a tool that asks questions about features to lead you to the correct name of an object.'
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y3-s2-topic',
        title: 'Year 3 - Spring 2: Plants (Topic Study) 🌿',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-s2-topic-q1',
            text: 'Which part of the plant is responsible for absorbing water and nutrients from the soil?',
            options: ['Leaves', 'Stem', 'Roots'],
            correctAnswer: 'Roots',
            marks: 2,
            hint: 'The roots act like a straw to pull water from the ground and also keep the plant anchored.'
          },
          {
            id: 'y3-s2-topic-q2',
            text: 'True or False: The main job of the leaves is to catch sunlight to make food for the plant.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'This process is called photosynthesis; leaves use sunlight, air, and water to create the energy the plant needs.'
          },
          {
            id: 'y3-s2-topic-q3',
            text: 'What is the main function of the stem or trunk?',
            options: ['To produce seeds', 'To transport water and support the plant', 'To look pretty'],
            correctAnswer: 'To transport water and support the plant',
            marks: 2,
            hint: 'The stem acts as a support system and contains tubes to carry water and food throughout the plant.'
          }
        ]
      },
      skills: {
        id: 'y3-s2-skills',
        title: 'Year 3 - Spring 2: Plants (Working Scientifically) 📏',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-s2-skills-q1',
            text: 'If you want to know the function of a leaf, what is a scientific way to find out?',
            options: ['Just guess', 'Use secondary sources like books or the internet', 'Ask a younger child'],
            correctAnswer: 'Use secondary sources like books or the internet',
            marks: 2,
            hint: 'When we can\'t see a process happening, we use books and ICT to find information from other scientists.'
          },
          {
            id: 'y3-s2-skills-q2',
            text: 'True or False: Researching which plants live in the desert is a way of using scientific ideas to pose questions.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Researching helps us form better questions about how living things survive in their habitats.'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y3-su1-topic',
        title: 'Year 3 - Summer 1: Living Things & Habitats (Topic Study) 🦎',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-su1-topic-q1',
            text: 'What is the scientific name for animals that have a backbone?',
            options: ['Invertebrates', 'Vertebrates', 'Mammals only'],
            correctAnswer: 'Vertebrates',
            marks: 2,
            hint: 'Vertebrates are a broad group that includes fish, amphibians, reptiles, birds, and mammals.'
          },
          {
            id: 'y3-su1-topic-q2',
            text: 'True or False: All living things can be classified as either a plant or an animal.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'While plants and animals are the largest groups, there are others like fungi and microorganisms.'
          },
          {
            id: 'y3-su1-topic-q3',
            text: 'Which of these is an example of an \'invertebrate\'?',
            options: ['Dog', 'Spider', 'Sparrow'],
            correctAnswer: 'Spider',
            marks: 2,
            hint: 'Invertebrates are animals that do not have an internal skeleton made of bone.'
          }
        ]
      },
      skills: {
        id: 'y3-su1-skills',
        title: 'Year 3 - Summer 1: Living Things & Habitats (Working Scientifically) 🌿',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-su1-skills-q1',
            text: 'Which of these is a valid scientific reason for grouping animals into the \'bird\' group?',
            options: ['They are all small', 'They all have feathers and lay hard-shelled eggs', 'They are all the same colour'],
            correctAnswer: 'They all have feathers and lay hard-shelled eggs',
            marks: 2,
            hint: 'Scientists look for specific physical features to decide which group a living thing belongs to.'
          },
          {
            id: 'y3-su1-skills-q2',
            text: 'True or False: Using a classification key to sort plants by their leaf shape is a form of scientific observation.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Looking closely at leaf shapes helps us group and identify plants accurately.'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y3-su2-topic',
        title: 'Year 3 - Summer 2: Animals Including Humans (Topic Study) 🦴',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-su2-topic-q1',
            text: 'Why do animals and humans need to eat?',
            options: ['To stay awake', 'To get nutrients because they cannot make their own food', 'To change their shape'],
            correctAnswer: 'To get nutrients because they cannot make their own food',
            marks: 2,
            hint: 'Unlike plants, animals must consume other living things to get the energy and nutrients required for life.'
          },
          {
            id: 'y3-su2-topic-q2',
            text: 'True or False: Plants get their food by eating insects in the soil.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Most plants are producers, meaning they make their own food using sunlight.'
          },
          {
            id: 'y3-su2-topic-q3',
            text: 'What are the three main functions of a skeleton?',
            options: ['Eating, sleeping, and breathing', 'Support, protection, and movement', 'Running, jumping, and hiding'],
            correctAnswer: 'Support, protection, and movement',
            marks: 2,
            hint: 'The skeleton holds us up, protects vital organs like the brain, and works with muscles to allow us to move.'
          }
        ]
      },
      skills: {
        id: 'y3-su2-skills',
        title: 'Year 3 - Summer 2: Animals Including Humans (Working Scientifically) 🏃',
        subject: 'science',
        yearGroup: 3,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y3-su2-skills-q1',
            text: 'You are going to investigate if people with longer legs run faster. What should you do first?',
            options: ['Run as fast as you can', 'Plan the enquiry and decide on a fair method', 'Write the conclusion'],
            correctAnswer: 'Plan the enquiry and decide on a fair method',
            marks: 2,
            hint: 'Planning ensures you know exactly what you are testing and how to keep it fair.'
          },
          {
            id: 'y3-su2-skills-q2',
            text: 'To make the \'running\' test fair, what is the ONE thing you should change?',
            options: ['The length of the legs', 'The distance of the race', 'The shoes they wear'],
            correctAnswer: 'The length of the legs',
            marks: 2,
            hint: 'In this test, the independent variable is leg length; everything else (like distance) must stay the same.'
          }
        ]
      }
    }
  },
  4: {
    'Autumn 1': {
      topic: {
        id: 'y4-a1-topic',
        title: 'Year 4 - Autumn 1: States of Matter (Topic Study) 🌡️',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-a1-topic-q1',
            text: 'Which state of matter has a fixed shape and cannot flow?',
            options: ['Liquid', 'Gas', 'Solid'],
            correctAnswer: 'Solid',
            marks: 2,
            hint: 'Solids have particles that are packed closely together, meaning they keep a fixed shape and do not flow like liquids do.'
          },
          {
            id: 'y4-a1-topic-q2',
            text: 'True or False: Gases are easy to compress (squash) because their particles are widely spaced apart.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Gases can be squashed into smaller spaces because there is a lot of room between their separate particles.'
          },
          {
            id: 'y4-a1-topic-q3',
            text: 'Select the materials that are typically classified as liquids. (Select all correct)',
            options: ['Orange juice', 'Oxygen', 'Milk', 'A brick'],
            correctAnswer: 'Orange juice, Milk',
            marks: 2,
            hint: 'Liquids, like milk and juice, take the shape of their container but have a fixed volume.'
          }
        ]
      },
      skills: {
        id: 'y4-a1-skills',
        title: 'Year 4 - Autumn 1: States of Matter (Working Scientifically) 🧊',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-a1-skills-q1',
            text: 'You are measuring the temperature of melting ice. Which piece of equipment is most accurate for this task?',
            options: ['A ruler', 'A digital thermometer or data logger', 'An egg timer'],
            correctAnswer: 'A digital thermometer or data logger',
            marks: 2,
            hint: 'A thermometer is specifically designed to measure thermal energy in degrees Celsius, providing the precise data needed for state-change investigations.'
          },
          {
            id: 'y4-a1-skills-q2',
            text: 'True or False: When using a data logger to measure temperature, you should record the results at regular, timed intervals.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Systematic measurement at fixed intervals allows scientists to see exactly how temperature changes over time during an experiment.'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y4-a2-topic',
        title: 'Year 4 - Autumn 2: Electricity (Topic Study) ⚡',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-a2-topic-q1',
            text: 'Which of these is an appliance that runs on electricity from a battery (DC)?',
            options: ['Washing machine', 'Toaster', 'Mobile phone'],
            correctAnswer: 'Mobile phone',
            marks: 2,
            hint: 'Batteries provide a portable source of power (DC) for smaller devices like phones and torches.'
          },
          {
            id: 'y4-a2-topic-q2',
            text: 'True or False: A microwave is an appliance that usually runs on mains electricity (AC).',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Large kitchen appliances need the high power provided by being plugged into a mains socket.'
          },
          {
            id: 'y4-a2-topic-q3',
            text: 'What are the basic parts needed to make a simple series circuit?',
            options: ['Cell, wires, and bulb', 'Switch and buzzer only', 'Metal and plastic'],
            correctAnswer: 'Cell, wires, and bulb',
            marks: 2,
            hint: 'A circuit needs a power source (cell), a component (bulb), and a path for electricity to flow (wires).'
          }
        ]
      },
      skills: {
        id: 'y4-a2-skills',
        title: 'Year 4 - Autumn 2: Electricity (Working Scientifically) 💡',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-a2-skills-q1',
            text: 'You want to find out which material makes the best switch. Which is a relevant question to ask?',
            options: ['Which material is the shiniest?', 'Which material allows electricity to pass through and complete the circuit?', 'How many batteries do I have?'],
            correctAnswer: 'Which material allows electricity to pass through and complete the circuit?',
            marks: 2,
            hint: 'A relevant question focuses on the scientific property being tested—in this case, electrical conductivity.'
          },
          {
            id: 'y4-a2-skills-q2',
            text: 'True or False: You can use a computer simulation (ICT) to test if a circuit design will work before building it.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientists often use secondary sources and ICT models to investigate questions that might be difficult or dangerous to test physically first.'
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y4-s1-topic',
        title: 'Year 4 - Spring 1: Sound (Topic Study) 🔊',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-s1-topic-q1',
            text: 'What is happening to an object when it produces a sound?',
            options: ['It is getting colder', 'It is vibrating', 'It is changing colour'],
            correctAnswer: 'It is vibrating',
            marks: 2,
            hint: 'Sound is created when an object moves back and forth very quickly, which is called vibrating.'
          },
          {
            id: 'y4-s1-topic-q2',
            text: 'True or False: You can always see vibrations with your eyes when a sound is made.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Many vibrations are too fast or small to see, but we can hear them or feel them with our touch.'
          },
          {
            id: 'y4-s1-topic-q3',
            text: 'Through which state of matter does sound travel the FASTEST?',
            options: ['Gas (Air)', 'Liquid (Water)', 'Solid (Wood/Metal)'],
            correctAnswer: 'Solid (Wood/Metal)',
            marks: 2,
            hint: 'Sound travels best through solids because the particles are packed very closely together, allowing vibrations to pass quickly.'
          }
        ]
      },
      skills: {
        id: 'y4-s1-skills',
        title: 'Year 4 - Spring 1: Sound (Working Scientifically) 🎙️',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-s1-skills-q1',
            text: 'Which equipment is best for measuring the intensity (volume) of a sound as you move further away?',
            options: ['A tape measure', 'A data logger with a sound sensor', 'A magnifying glass'],
            correctAnswer: 'A data logger with a sound sensor',
            marks: 2,
            hint: 'A sound sensor on a data logger measures volume in decibels, providing precise numerical data that our ears cannot.'
          },
          {
            id: 'y4-s1-skills-q2',
            text: 'True or False: To measure sound fairly, you must keep the sound source at the same volume while you change the distance.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Accurate measurement requires controlling all other factors (variables) so that the change in distance is the only thing affecting the results.'
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y4-s2-topic',
        title: 'Year 4 - Spring 2: Living Things & Habitats (Topic Study) 🦋',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-s2-topic-q1',
            text: 'What is a classification key used for in science?',
            options: ['To lock a door', 'To group and identify living things', 'To measure the weight of an animal'],
            correctAnswer: 'To group and identify living things',
            marks: 2,
            hint: 'A classification key is a series of questions that helps scientists identify an unknown animal or plant based on its features.'
          },
          {
            id: 'y4-s2-topic-q2',
            text: 'True or False: Invertebrates are animals that have a backbone.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Invertebrates are actually animals without an internal skeleton or backbone.'
          },
          {
            id: 'y4-s2-topic-q3',
            text: 'Which of these is one of the five main groups of vertebrates?',
            options: ['Insects', 'Amphibians', 'Spiders'],
            correctAnswer: 'Amphibians',
            marks: 2,
            hint: 'Vertebrates include mammals, birds, reptiles, amphibians, and fish.'
          }
        ]
      },
      skills: {
        id: 'y4-s2-skills',
        title: 'Year 4 - Spring 2: Living Things & Habitats (Working Scientifically) 🌿',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-s2-skills-q1',
            text: 'You are researching why a specific animal is suited to its habitat. Which source of evidence is most reliable?',
            options: ['A fictional storybook', 'Straightforward scientific evidence from a reputable website or textbook', 'Asking a friend what they think'],
            correctAnswer: 'Straightforward scientific evidence from a reputable website or textbook',
            marks: 2,
            hint: 'Scientists rely on verified evidence from secondary sources like ICT and books to answer questions about global habitats.'
          },
          {
            id: 'y4-s2-skills-q2',
            text: 'True or False: Finding evidence that "plastic pollution harms sea turtles" is a way to answer a scientific question about environmental danger.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Evidence-based answers allow scientists to prove the impact of human activities on the natural world.'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y4-su1-topic',
        title: 'Year 4 - Summer 1: Animals, Teeth & Food Chains (Topic Study) 🦷',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-su1-topic-q1',
            text: 'Which type of tooth is used for biting and cutting food?',
            options: ['Molar', 'Canine', 'Incisor'],
            correctAnswer: 'Incisor',
            marks: 2,
            hint: 'Incisors are the sharp, chisel-shaped teeth at the front used for taking bites of food.'
          },
          {
            id: 'y4-su1-topic-q2',
            text: 'True or False: Molars are used for grinding and crushing food before we swallow.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Molars are large and flat, making them perfect for grinding down food.'
          },
          {
            id: 'y4-su1-topic-q3',
            text: 'Which living thing always starts a food chain?',
            options: ['Predator', 'Producer (Plant)', 'Prey'],
            correctAnswer: 'Producer (Plant)',
            marks: 2,
            hint: 'Every food chain begins with a producer, which is a plant that makes its own food using sunlight.'
          }
        ]
      },
      skills: {
        id: 'y4-su1-skills',
        title: 'Year 4 - Summer 1: Animals, Teeth & Food Chains (Working Scientifically) 🥚',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-su1-skills-q1',
            text: 'When using eggshells to investigate tooth decay, what are you doing when you check them for changes after 24 hours?',
            options: ['Making a prediction', 'Making systematic and careful observations', 'Drawing a map'],
            correctAnswer: 'Making systematic and careful observations',
            marks: 2,
            hint: 'Systematic observation involves checking the experiment at specific times to accurately record the effects of the acid on the shell.'
          },
          {
            id: 'y4-su1-skills-q2',
            text: 'True or False: Noticing a small \'pitting\' or \'discoloration\' on an eggshell in vinegar is an example of a careful observation.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientists must look for subtle changes in an investigation to gather the evidence needed to support their conclusions.'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y4-su2-topic',
        title: 'Year 4 - Summer 2: Animals, Digestive System (Topic Study) 🥖',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-su2-topic-q1',
            text: 'What is the main purpose of the digestive system?',
            options: ['To help us breathe', 'To break down food for the body to use', 'To pump blood'],
            correctAnswer: 'To break down food for the body to use',
            marks: 2,
            hint: 'Digestion is the process of turning the food we eat into nutrients that our body needs for energy and growth.'
          },
          {
            id: 'y4-su2-topic-q2',
            text: 'True or False: Digestion begins in the stomach.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Digestion actually starts in the mouth, where teeth and saliva begin to break down the food.'
          },
          {
            id: 'y4-su2-topic-q3',
            text: 'What is the name of the tube that carries food from the mouth to the stomach?',
            options: ['Small Intestine', 'Oesophagus', 'Trachea'],
            correctAnswer: 'Oesophagus',
            marks: 2,
            hint: 'The oesophagus is a muscular tube that pushes swallowed food down into the stomach.'
          }
        ]
      },
      skills: {
        id: 'y4-su2-skills',
        title: 'Year 4 - Summer 2: Animals, Digestive System (Working Scientifically) 🧪',
        subject: 'science',
        yearGroup: 4,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y4-su2-skills-q1',
            text: 'When you create a model of the digestive system using a plastic bag and tights, what is the best way to record your work?',
            options: ['Take a blurry photo', 'Use a labelled scientific diagram to show which part represents which organ', 'Tell no one'],
            correctAnswer: 'Use a labelled scientific diagram to show which part represents which organ',
            marks: 2,
            hint: 'Labelled diagrams are a standard scientific way to record how a model represents a complex biological process like digestion.'
          },
          {
            id: 'y4-su2-skills-q2',
            text: 'True or False: Posing a new question like "Does the model work differently if we use real food?" is a way to develop further enquiries.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Good scientists use what they have learned in one experiment to ask new, more advanced questions for the next one.'
          }
        ]
      }
    }
  },
  5: {
    'Autumn 1': {
      topic: {
        id: 'y5-a1-topic',
        title: 'Year 5 - Autumn 1: Properties of Materials (Topic Study) 🧱',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-a1-topic-q1',
            text: 'Which property allows a material to be drawn out into a wire or hammered into shape without breaking?',
            options: ['Solubility', 'Hardness', 'Conductivity', 'Malleability'],
            correctAnswer: 'Malleability',
            marks: 2,
            hint: 'Malleability is the ability of a metal to be hammered or rolled into thin sheets without shattering!'
          },
          {
            id: 'y5-a1-topic-q2',
            text: 'True or False: Thermal conductivity refers to a material\'s ability to allow heat to pass through it.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientific classification relies on thermal conductivity to identify insulators and conductors, which determines suitability for specific uses.'
          },
          {
            id: 'y5-a1-topic-q3',
            text: 'Select the materials that are waterproof. (Select all correct)',
            options: ['Plastic', 'Metal', 'Fabric'],
            correctAnswer: 'Plastic, Metal',
            marks: 2,
            hint: 'Plastic and metal are waterproof; fabric usually lets water soak in!'
          },
          {
            id: 'y5-a1-topic-q4',
            text: 'Which of the following materials is the best electrical conductor?',
            options: ['Copper', 'Rubber', 'Glass', 'Wood'],
            correctAnswer: 'Copper',
            marks: 2,
            hint: 'Metals are excellent conductors of electricity, and copper is commonly used in wires.'
          },
          {
            id: 'y5-a1-topic-q5',
            text: 'What term describes a material that allows some light to pass through but scatters it so objects cannot be seen clearly?',
            options: ['Transparent', 'Translucent', 'Opaque', 'Reflective'],
            correctAnswer: 'Translucent',
            marks: 2,
            hint: 'Think of frosted glass or tissue paper—they let light through but are not completely clear.'
          },
          {
            id: 'y5-a1-topic-q6',
            text: 'Which of these is a key property of a material used to make a saucepan handle?',
            options: ['Good thermal conductor', 'Good thermal insulator', 'High solubility', 'Magnetic'],
            correctAnswer: 'Good thermal insulator',
            marks: 2,
            hint: 'We want the handle to stay cool so we do not burn our hands while cooking!'
          },
          {
            id: 'y5-a1-topic-q7',
            text: 'True or False: Dissolving salt in water creates a chemical reaction that cannot be undone.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Dissolving is a reversible physical change. You can get the salt back by evaporating the water.'
          },
          {
            id: 'y5-a1-topic-q8',
            text: 'Which property describes how difficult it is to scratch or dent a material?',
            options: ['Hardness', 'Flexibility', 'Solubility', 'Density'],
            correctAnswer: 'Hardness',
            marks: 2,
            hint: 'Diamonds are famous for having the highest value in this property, making them scratch-resistant.'
          },
          {
            id: 'y5-a1-topic-q9',
            text: 'What is a substance called if it can dissolve in a liquid?',
            options: ['Soluble', 'Insoluble', 'Solvent', 'Solution'],
            correctAnswer: 'Soluble',
            marks: 2,
            hint: 'Sugar is soluble because it dissolves in tea, but sand is insoluble.'
          },
          {
            id: 'y5-a1-topic-q10',
            text: 'True or False: Iron, nickel, and cobalt are examples of magnetic metals.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Not all metals are magnetic, but these three are strongly attracted to magnets.'
          },
          {
            id: 'y5-a1-topic-q11',
            text: 'Which of these processes is best for separating an insoluble solid (like sand) from a liquid (like water)?',
            options: ['Evaporation', 'Filtration', 'Condensation', 'Melting'],
            correctAnswer: 'Filtration',
            marks: 2,
            hint: 'You can pass the mixture through filter paper to trap the solid while the liquid passes through.'
          },
          {
            id: 'y5-a1-topic-q12',
            text: 'When sugar dissolves in water, what do we call the water (the liquid doing the dissolving)?',
            options: ['Solute', 'Solvent', 'Solution', 'Suspension'],
            correctAnswer: 'Solvent',
            marks: 2,
            hint: 'The solute is the solid that dissolves (sugar), and the solvent is the liquid that dissolves it (water).'
          }
        ]
      },
      skills: {
        id: 'y5-a1-skills',
        title: 'Year 5 - Autumn 1: Properties of Materials (Working Scientifically) 🌡️',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-a1-skills-q1',
            text: 'When planning a fair test for solubility, which of these is the independent variable?',
            options: ['The amount of water', 'The type of solid being dissolved', 'The temperature of the room'],
            correctAnswer: 'The type of solid being dissolved',
            marks: 2,
            hint: 'The independent variable is the single factor you deliberately change to observe its effect.'
          },
          {
            id: 'y5-a1-skills-q2',
            text: 'True or False: To ensure a fair test when measuring thermal conductivity, the thickness of each material must be kept constant.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Control variables must be strictly maintained to ensure that any variation in the results is caused solely by the property being investigated.'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y5-a2-topic',
        title: 'Year 5 - Autumn 2: Changes of Materials (Topic Study) 🧪',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-a2-topic-q1',
            text: 'What is a \'reversible change\'?',
            options: ['A change that makes a new material', 'A change that can be undone to recover the original materials', 'A change caused by acid'],
            correctAnswer: 'A change that can be undone to recover the original materials',
            marks: 2,
            hint: 'Reversible changes are typically physical alterations where the molecular structure of the substance remains unchanged.'
          },
          {
            id: 'y5-a2-topic-q2',
            text: 'True or False: Freezing water into ice is an irreversible change because the appearance changes.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Phase changes, such as freezing and melting, are reversible as they only involve changes in thermal energy and particle arrangement.'
          },
          {
            id: 'y5-a2-topic-q3',
            text: 'What happens when bicarbonate of soda reacts with vinegar (an acid)?',
            options: ['It dissolves silently', 'A chemical reaction produces carbon dioxide gas', 'It turns back into wood'],
            correctAnswer: 'A chemical reaction produces carbon dioxide gas',
            marks: 2,
            hint: 'The effervescence (fizzing) observed is evidence of an irreversible chemical change producing a new gaseous product.'
          }
        ]
      },
      skills: {
        id: 'y5-a2-skills',
        title: 'Year 5 - Autumn 2: Changes of Materials (Working Scientifically) 📊',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-a2-skills-q1',
            text: 'After observing fizzing when acid hits bicarbonate of soda, what conclusion can you justify?',
            options: ['It is a physical change', 'An irreversible chemical reaction has occurred because a new gas has been produced', 'It is melting'],
            correctAnswer: 'An irreversible chemical reaction has occurred because a new gas has been produced',
            marks: 2,
            hint: 'Conclusions must be justified by identifying the specific evidence, such as effervescence, which indicates the formation of a new substance.'
          },
          {
            id: 'y5-a2-skills-q2',
            text: 'True or False: Scientific ideas about \'indestructible\' matter changed when scientists proved that mass is conserved even during state changes.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Science is a developing field where new evidence often leads to the refinement or replacement of older theories and models.'
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y5-s1-topic',
        title: 'Year 5 - Spring 1: Forces (Topic Study) 🪂',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-s1-topic-q1',
            text: 'Which force causes unsupported objects to fall toward the centre of the Earth?',
            options: ['Friction', 'Magnetism', 'Gravity', 'Upthrust'],
            correctAnswer: 'Gravity',
            marks: 2,
            hint: 'Gravity is a non-contact force of attraction that exists between all masses.'
          },
          {
            id: 'y5-s1-topic-q2',
            text: 'True or False: Gravity only pulls objects \'down\' because of the way our maps are drawn.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Gravity pulls objects toward the centre of the Earth\'s mass, which we perceive as \'down\' regardless of our location.'
          },
          {
            id: 'y5-s1-topic-q3',
            text: 'Who is the scientist famous for developing the theory of universal gravitation in 1687?',
            options: ['Galileo Galilei', 'Isaac Newton', 'Charles Darwin'],
            correctAnswer: 'Isaac Newton',
            marks: 2,
            hint: 'Newton\'s work established that gravity is a predictable force that governs the motion of planets as well as falling objects on Earth.'
          }
        ]
      },
      skills: {
        id: 'y5-s1-skills',
        title: 'Year 5 - Spring 1: Forces (Working Scientifically) ⏱️',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-s1-skills-q1',
            text: 'While investigating air resistance, why is it necessary to make systematic observations of a falling parachute?',
            options: ['To see if it is pretty', 'To ensure you record the exact time of descent for every repeat test', 'To guess the weight'],
            correctAnswer: 'To ensure you record the exact time of descent for every repeat test',
            marks: 2,
            hint: 'Systematic observations require a planned method, such as using a stopwatch for every drop, to gather consistent and valid evidence.'
          },
          {
            id: 'y5-s1-skills-q2',
            text: 'True or False: A \'careful observation\' of friction involves noticing how the surface texture changes the amount of heat produced.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Careful observation goes beyond the obvious result to identify secondary effects, providing a deeper understanding of the force at work.'
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y5-s2-topic',
        title: 'Year 5 - Spring 2: Earth and Space (Topic Study) 🪐',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-s2-topic-q1',
            text: 'What path does the Earth follow as it travels around the Sun?',
            options: ['A perfect circle', 'An elliptical orbit', 'A straight line'],
            correctAnswer: 'An elliptical orbit',
            marks: 2,
            hint: 'An orbit is a gravitationally curved path; Earth\'s orbit is slightly oval (elliptical).'
          },
          {
            id: 'y5-s2-topic-q2',
            text: 'True or False: The further a planet is from the Sun, the longer its \'year\' or orbital period.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Planets further from the Sun have larger orbits and travel at slower speeds, resulting in a significantly longer time to complete one revolution.'
          },
          {
            id: 'y5-s2-topic-q3',
            text: 'Approximately how long does it take for Earth to complete one full orbit of the Sun?',
            options: ['24 hours', '28 days', '365.25 days'],
            correctAnswer: '365.25 days',
            marks: 2,
            hint: 'One full revolution around the Sun defines a solar year; the extra quarter day is accounted for by adding a leap day every four years.'
          }
        ]
      },
      skills: {
        id: 'y5-s2-skills',
        title: 'Year 5 - Spring 2: Earth and Space (Working Scientifically) 🛰️',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-s2-skills-q1',
            text: 'Which of these is a complex scientific question that leads to a research-based enquiry?',
            options: ['Is the Moon white?', 'How does the Earth’s elliptical orbit affect the length of the seasons?', 'Is space cold?'],
            correctAnswer: 'How does the Earth’s elliptical orbit affect the length of the seasons?',
            marks: 2,
            hint: 'Year 5 questions should explore causal relationships, requiring a hypothesis that can be tested through research or modelling.'
          },
          {
            id: 'y5-s2-skills-q2',
            text: 'True or False: Hypothesizing that "Day length will vary on other planets because of their different rotation speeds" is a valid scientific starting point.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'A hypothesis is a formal statement that predicts a relationship between two variables, which can then be investigated systematically.'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y5-su1-topic',
        title: 'Year 5 - Summer 1: Living Things & Habitats (Topic Study) 🦎',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-su1-topic-q1',
            text: 'Which animal group typically undergoes \'metamorphosis\' as part of its life cycle?',
            options: ['Mammals', 'Birds', 'Insects', 'Reptiles'],
            correctAnswer: 'Insects',
            marks: 2,
            hint: 'Metamorphosis is a biological process involving a conspicuous and relatively abrupt change in the animal\'s body structure.'
          },
          {
            id: 'y5-su1-topic-q2',
            text: 'True or False: Most mammals give birth to live young and nourish them with milk.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Viviparity (giving birth to live young) and mammary glands are defining characteristics of the mammalian class.'
          },
          {
            id: 'y5-su1-topic-q3',
            text: 'What is a major difference between the life cycles of amphibians and birds?',
            options: ['Birds lay eggs, amphibians don\'t', 'Amphibians live in both water and on land', 'Birds don\'t grow'],
            correctAnswer: 'Amphibians live in both water and on land',
            marks: 2,
            hint: 'Amphibians typically have an aquatic larval stage but an air-breathing terrestrial adult stage, whereas birds are terrestrial throughout.'
          }
        ]
      },
      skills: {
        id: 'y5-su1-skills',
        title: 'Year 5 - Summer 1: Living Things & Habitats (Working Scientifically) 🧬',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-su1-skills-q1',
            text: 'When classifying a mammal, what \'systematic observation\' must you make about its offspring?',
            options: ['If they are cute', 'If they are born live and nourished with milk', 'How many there are'],
            correctAnswer: 'If they are born live and nourished with milk',
            marks: 2,
            hint: 'Classification requires systematic checking against specific biological criteria that define a class, such as viviparity in mammals.'
          },
          {
            id: 'y5-su1-skills-q2',
            text: 'True or False: A careful observation of a flower during dissection involves identifying the microscopic pollen on the anther.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Careful observation in biology often requires looking at internal structures to understand their specific role in processes like pollination.'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y5-su2-topic',
        title: 'Year 5 - Summer 2: Animals Including Humans (Topic Study) 👴',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-su2-topic-q1',
            text: 'Which stage of human development involves rapid physical growth and the onset of puberty?',
            options: ['Childhood', 'Adolescence', 'Adulthood'],
            correctAnswer: 'Adolescence',
            marks: 2,
            hint: 'Adolescence is the transitional phase between childhood and adulthood characterised by significant hormonal and physiological changes.'
          },
          {
            id: 'y5-su2-topic-q2',
            text: 'True or False: Human physical development is completely finished by the age of 10.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Human development continues through adolescence into adulthood, with cognitive and physical refinements occurring well into the 20s.'
          },
          {
            id: 'y5-su2-topic-q3',
            text: 'What is a common physical change that occurs as humans reach \'old age\'?',
            options: ['Faster reflexes', 'Loss of bone density and muscle mass', 'Permanent teeth falling out to be replaced'],
            correctAnswer: 'Loss of bone density and muscle mass',
            marks: 2,
            hint: 'The aging process typically involves a gradual decline in physiological functions, such as reduced bone mass and muscle density.'
          }
        ]
      },
      skills: {
        id: 'y5-su2-skills',
        title: 'Year 5 - Summer 2: Animals Including Humans (Working Scientifically) 📊',
        subject: 'science',
        yearGroup: 5,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y5-su2-skills-q1',
            text: 'What is the purpose of a \'control variable\' in a scientific fair test?',
            options: ['To change it during the test', 'To keep it the same to ensure valid results', 'To ignore it'],
            correctAnswer: 'To keep it the same to ensure valid results',
            marks: 2,
            hint: 'Scientific validity requires that all variables except the independent variable be held constant to ensure results are caused by the factor being tested.'
          },
          {
            id: 'y5-su2-skills-q2',
            text: 'True or False: In a \'fair test\', you should change at least three variables at the same time to save time.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'To isolate the cause of a specific outcome, a scientist must change only one variable at a time (the independent variable) while monitoring the dependent variable.'
          }
        ]
      }
    }
  },
  6: {
    'Autumn 1': {
      topic: {
        id: 'y6-a1-topic',
        title: 'Year 6 - Autumn 1: Electricity (Topic Study) 💡',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-a1-topic-q1',
            text: 'What happens to the brightness of a bulb if you add a second 1.5V cell in series to the circuit?',
            options: ['It gets dimmer', 'It gets brighter', 'It stays the same'],
            correctAnswer: 'It gets brighter',
            marks: 2,
            hint: 'Increasing the total voltage in a series circuit increases the electrical energy delivered to the components, resulting in greater output intensity.'
          },
          {
            id: 'y6-a1-topic-q2',
            text: 'True or False: Adding more buzzers to a circuit without adding more cells will make each buzzer quieter.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'In a series circuit, the fixed voltage is shared across all components; adding more components increases resistance and reduces the energy available.'
          },
          {
            id: 'y6-a1-topic-q3',
            text: 'Which standard scientific symbol represents a \'cell\'?',
            options: ['A circle with an X', 'Two parallel lines of different lengths', 'A zig-zag line'],
            correctAnswer: 'Two parallel lines of different lengths',
            marks: 2,
            hint: 'The standard symbol for a cell consists of a long line (positive) and a shorter, thicker line (negative).'
          }
        ]
      },
      skills: {
        id: 'y6-a1-skills',
        title: 'Year 6 - Autumn 1: Electricity (Working Scientifically) ⚡',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-a1-skills-q1',
            text: 'You are investigating how voltage affects buzzer volume. Which variable MUST be controlled to ensure a fair test?',
            options: ['The length of the wire', 'The volume of the buzzer', 'The person listening'],
            correctAnswer: 'The length of the wire',
            marks: 2,
            hint: 'Controlling variables like wire length or the number of components prevents additional resistance from skewing the data.'
          },
          {
            id: 'y6-a1-skills-q2',
            text: 'True or False: In a comparative test of bulb brightness, the type of bulb must remain constant to maintain the validity of the enquiry.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'To work, the circuit must be controlled. Changing the type of bulb would introduce an uncontrolled variable.'
          }
        ]
      }
    },
    'Autumn 2': {
      topic: {
        id: 'y6-a2-topic',
        title: 'Year 6 - Autumn 2: Light (Topic Study) 🕯️',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-a2-topic-q1',
            text: 'Which statement accurately describes the path of light?',
            options: ['It curves around corners', 'It travels in straight lines', 'It moves in circles'],
            correctAnswer: 'It travels in straight lines',
            marks: 2,
            hint: 'Linear propagation is a fundamental property of light; it does not deviate from a straight path unless it hits a different medium or surface.'
          },
          {
            id: 'y6-a2-topic-q2',
            text: 'True or False: We can use the idea of straight lines to predict where a shadow will fall.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Because light cannot bend around an opaque object, we can trace straight lines from the source to determine the exact area of the shadow.'
          },
          {
            id: 'y6-a2-topic-q3',
            text: 'How does light reach our eyes so that we can see a non-luminous object like a book?',
            options: ['The book produces its own light', 'Light reflects off the book and enters our eyes', 'Our eyes send out light rays to the book'],
            correctAnswer: 'Light reflects off the book and enters our eyes',
            marks: 2,
            hint: 'Visibility depends on light rays bouncing (reflecting) off an object\'s surface and travelling in a straight line into our pupils.'
          }
        ]
      },
      skills: {
        id: 'y6-a2-skills',
        title: 'Year 6 - Autumn 2: Light (Working Scientifically) 👁️',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-a2-skills-q1',
            text: 'When investigating how mirrors reflect light, what decision must you make to ensure accurate observations?',
            options: ['The colour of the mirror', 'The specific angle of the incident ray and reflected ray', 'The time of day'],
            correctAnswer: 'The specific angle of the incident ray and reflected ray',
            marks: 2,
            hint: 'To understand the law of reflection, a scientist must decide to observe and measure the geometric relationship between the light source and the reflective surface.'
          },
          {
            id: 'y6-a2-skills-q2',
            text: 'True or False: Using your initial observations of a single mirror to predict how light will travel through a periscope is a way to set up a further fair test.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Scientific enquiry involves using early findings to design more complex investigations, such as applying reflection principles to multiple surfaces in a periscope.'
          }
        ]
      }
    },
    'Spring 1': {
      topic: {
        id: 'y6-s1-topic',
        title: 'Year 6 - Spring 1: Living Things & Habitats (Topic Study) 🍄',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-s1-topic-q1',
            text: 'Which of these is the most accurate definition of a \'microorganism\'?',
            options: ['A very small insect', 'A living thing too small to be seen with the naked eye', 'A type of tiny plant'],
            correctAnswer: 'A living thing too small to be seen with the naked eye',
            marks: 2,
            hint: 'Microorganisms, or microbes, are single-celled organisms that require magnification to be observed due to their microscopic scale.'
          },
          {
            id: 'y6-s1-topic-q2',
            text: 'True or False: All bacteria are harmful and cause disease in humans.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            marks: 2,
            hint: 'Many bacteria are beneficial or even essential for life, such as those used in yoghurt or aiding digestion in the gut.'
          },
          {
            id: 'y6-s1-topic-q3',
            text: 'What type of microorganism is used to make bread rise?',
            options: ['Bacteria', 'Yeast', 'Algae'],
            correctAnswer: 'Yeast',
            marks: 2,
            hint: 'Yeast is a fungus that converts sugar into carbon dioxide gas through fermentation, causing the dough to expand.'
          }
        ]
      },
      skills: {
        id: 'y6-s1-skills',
        title: 'Year 6 - Spring 1: Living Things & Habitats (Working Scientifically) 🔬',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-s1-skills-q1',
            text: 'Which is the most appropriate line of enquiry to investigate whether a product contains live bacteria?',
            options: ['Looking at the product under a microscope', 'Testing the product in a culture medium to see if colonies grow', 'Smelling the product'],
            correctAnswer: 'Testing the product in a culture medium to see if colonies grow',
            marks: 2,
            hint: 'Selecting an enquiry method that allows for biological growth (like a culture test) provides the most robust evidence for microscopic life.'
          },
          {
            id: 'y6-s1-skills-q2',
            text: 'True or False: Posing a question about the \'rate of fermentation\' is a more advanced scientific enquiry than asking "Does yeast grow?"',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Advanced enquiries in Year 6 focus on measuring the speed or efficiency of a process (the rate), rather than just observing its existence.'
          }
        ]
      }
    },
    'Spring 2': {
      topic: {
        id: 'y6-s2-topic',
        title: 'Year 6 - Spring 2: Classification (Topic Study) 🌳',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-s2-topic-q1',
            text: 'Why do scientists use a standardised classification system for living things?',
            options: ['To make it harder to learn', 'To identify and group organisms accurately', 'To name them after their friends'],
            correctAnswer: 'To identify and group organisms accurately',
            marks: 2,
            hint: 'Systematic classification allows scientists worldwide to use a universal language to study and protect biological diversity.'
          },
          {
            id: 'y6-s2-topic-q2',
            text: 'True or False: Classification helps us understand which habitats are most appropriate for different species.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'By identifying an organism\'s traits and needs, we can determine the environmental conditions required for its survival.'
          },
          {
            id: 'y6-s2-topic-q3',
            text: 'Who is known as the \'pioneer of classification\' for developing the Linnaean system?',
            options: ['Charles Darwin', 'Carl Linnaeus', 'Mary Anning'],
            correctAnswer: 'Carl Linnaeus',
            marks: 2,
            hint: 'Linnaeus established the binomial nomenclature system, which gives every species a unique two-part Latin name.'
          }
        ]
      },
      skills: {
        id: 'y6-s2-skills',
        title: 'Year 6 - Spring 2: Classification (Working Scientifically) 🌿',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-s2-skills-q1',
            text: 'When using a classification key for unknown plants, what \'decision\' must you make to get an accurate result?',
            options: ['Decide which plant is the prettiest', 'Decide which characteristics are reliable specific observable characteristics', 'Guess the name first'],
            correctAnswer: 'Decide which characteristics are reliable specific observable characteristics',
            marks: 2,
            hint: 'Accurate classification depends on the scientist\'s ability to prioritize structural features (like leaf veins) that are consistent across a species.'
          },
          {
            id: 'y6-s2-skills-q2',
            text: 'True or False: Observing that a platypus has both a beak and fur should lead you to set up a further test or research enquiry to find its correct group.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Noticing \'anomalous\' features that don\'t fit a standard group is a key trigger for deeper scientific research into evolutionary history.'
          }
        ]
      }
    },
    'Summer 1': {
      topic: {
        id: 'y6-su1-topic',
        title: 'Year 6 - Summer 1: Evolution & Inheritance (Topic Study) 🦖',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-su1-topic-q1',
            text: 'Why do offspring usually look similar to their parents but not exactly the same?',
            options: ['Because they eat the same food', 'Because they inherit half their genetic material from each parent', 'Because they choose their features'],
            correctAnswer: 'Because they inherit half their genetic material from each parent',
            marks: 2,
            hint: 'Sexual reproduction involves the recombination of DNA from two parents, resulting in unique individuals that possess a blend of inherited traits.'
          },
          {
            id: 'y6-su1-topic-q2',
            text: 'True or False: Variation between individuals in a species is essential for the process of evolution.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Without variation, every individual would be identical, meaning the species could not adapt to changing environmental pressures over time.'
          },
          {
            id: 'y6-su1-topic-q3',
            text: 'Who is the scientist famous for the theory of evolution by natural selection?',
            options: ['Isaac Newton', 'Charles Darwin', 'Carl Linnaeus'],
            correctAnswer: 'Charles Darwin',
            marks: 2,
            hint: 'Darwin\'s observations of finches and other species led to the realization that those best suited to their environment are more likely to survive.'
          }
        ]
      },
      skills: {
        id: 'y6-su1-skills',
        title: 'Year 6 - Summer 1: Evolution & Inheritance (Working Scientifically) 🦴',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-su1-skills-q1',
            text: 'What causal relationship is shown by the variation in the peppered moth population during the industrial revolution?',
            options: ['Moths changed colour for fun', 'The survival of soot-covered trees (cause) led to the survival of darker moths (effect) through natural selection', 'The moths moved to the city'],
            correctAnswer: 'The survival of soot-covered trees (cause) led to the survival of darker moths (effect) through natural selection',
            marks: 2,
            hint: 'This demonstrates evolution as a series of causal links: an environmental change causes a shift in survival rates, which then affects the gene pool of the next generation.'
          },
          {
            id: 'y6-su1-skills-q2',
            text: 'True or False: Variation between siblings is the causal reason why a species is able to adapt to environmental changes over long periods.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'Without the \'cause\' of genetic variation, the \'effect\' of natural selection would be impossible, as there would be no better-suited individuals to survive.'
          }
        ]
      }
    },
    'Summer 2': {
      topic: {
        id: 'y6-su2-topic',
        title: 'Year 6 - Summer 2: Animals, Circulatory & Health (Topic Study) ❤️',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-su2-topic-q1',
            text: 'Which organ is responsible for pumping blood throughout the entire circulatory system?',
            options: ['Lungs', 'Heart', 'Brain', 'Stomach'],
            correctAnswer: 'Heart',
            marks: 2,
            hint: 'The heart is a specialised muscular pump that maintains the continuous flow of oxygenated and deoxygenated blood through the body.'
          },
          {
            id: 'y6-su2-topic-q2',
            text: 'True or False: The human heart has four distinct chambers.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            marks: 2,
            hint: 'These four chambers—the left and right atria and ventricles—work in synchrony to keep the two sides of the circulatory system separate.'
          },
          {
            id: 'y6-su2-topic-q3',
            text: 'What is the specific role of \'arteries\' in the body?',
            options: ['To carry blood into the heart', 'To carry blood away from the heart', 'To breathe for us'],
            correctAnswer: 'To carry blood away from the heart',
            marks: 2,
            hint: 'Arteries have thick, elastic walls to handle the high pressure of blood being pumped out from the heart\'s ventricles.'
          }
        ]
      },
      skills: {
        id: 'y6-su2-skills',
        title: 'Year 6 - Summer 2: Animals, Circulatory & Health (Working Scientifically) 📈',
        subject: 'science',
        yearGroup: 6,
        timeLimitSeconds: 300,
        active: true,
        questions: [
          {
            id: 'y6-su2-skills-q1',
            text: 'Which equipment is most appropriate for taking precise measurements of heart rate during an investigation into exercise?',
            options: ['A stopwatch and finger on the pulse', 'A digital pulse oximeter or heart rate sensor', 'A sand timer'],
            correctAnswer: 'A digital pulse oximeter or heart rate sensor',
            marks: 2,
            hint: 'Digital sensors reduce human error and provide precise, real-time data, which is essential for capturing rapid physiological changes during exercise.'
          },
          {
            id: 'y6-su2-skills-q2',
            text: 'Why should you take \'additional readings\' (repeat tests) when measuring your resting heart rate?',
            options: ['To make the lesson longer', 'To identify and remove anomalies and ensure the final result is reliable', 'Because the first one is always wrong'],
            correctAnswer: 'To identify and remove anomalies and ensure the final result is reliable',
            marks: 2,
            hint: 'Reliability is built by checking that a measurement is consistent; additional readings allow a scientist to calculate a mean and ignore one-off mistakes.'
          }
        ]
      }
    }
  }
};
