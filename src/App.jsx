import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#EDEEF0", white: "#FFFFFF",
  header: "#2E4057", headerDark: "#1A2840",
  blue: "#4A90D9", blueLight: "#EBF4FF", blueMid: "#C5DEFF",
  slate: "#6B7280", slateLight: "#F3F4F6", slateMid: "#E5E7EB", slateDark: "#374151",
  gold: "#D4A017", goldLight: "#FEF5DC", goldMid: "#F5D87A",
  green: "#3E9B6E", greenLight: "#E6F5EE", greenMid: "#B2DFCC",
  red: "#D63031", redLight: "#FDECEA", redMid: "#FADBD8",
  charcoal: "#1E2A38", muted: "#6B7280", border: "#DDE2EA",
};

// Simplified allergen groups per Solid Starts guide, ordered by recommended introduction week
const ALLERGEN_GROUPS = [
  {
    id: "egg",
    name: "Egg",
    emoji: "🥚",
    timeline: "Week 2",
    foods: ["egg"],
    description: "Chicken eggs"
  },
  {
    id: "peanut",
    name: "Peanut",
    emoji: "🥜",
    timeline: "Week 2",
    foods: ["peanut"],
    description: "Peanuts and peanut products"
  },
  {
    id: "dairy",
    name: "Dairy",
    emoji: "🥛",
    timeline: "Week 4",
    foods: ["yogurt","milk","butter","goat_cheese","ricotta","mozzarella","cottage_cheese","labneh","queso_fresco","sour_cream","mascarpone"],
    description: "Cow's milk and dairy products"
  },
  {
    id: "wheat",
    name: "Wheat",
    emoji: "🌾",
    timeline: "Week 5",
    foods: ["bread","wheat_farina","pasta","bulgur","noodles"],
    description: "Wheat-based foods including bread and pasta"
  },
  {
    id: "sesame",
    name: "Sesame",
    emoji: "🌱",
    timeline: "Week 6",
    foods: ["sesame"],
    description: "Sesame seeds and tahini"
  },
  {
    id: "soy",
    name: "Soy",
    emoji: "🫘",
    timeline: "Week 7",
    foods: ["edamame","tofu"],
    description: "Soy and soy products"
  },
  {
    id: "fish",
    name: "Fish",
    emoji: "🐟",
    timeline: "Week 9",
    foods: ["salmon","sardines","trout","tilapia","cod","mackerel"],
    description: "Finned fish"
  },
  {
    id: "tree_nut",
    name: "Tree Nut",
    emoji: "🌰",
    timeline: "Week 10",
    foods: ["almond","cashew","walnut","pecan","hazelnut"],
    description: "Almonds (W10), Cashew (W11), Walnut (W12), Pecan (W13), Hazelnut (W14)"
  },
];

// Allergen timeline from Solid Starts PDF — exact week of first introduction
const ALLERGEN_TIMELINE = {
  egg:            "Week 2",
  peanut:         "Week 2",
  yogurt:         "Week 4",
  milk:           "Week 4",
  butter:         "Week 4",
  goat_cheese:    "Week 5",
  ricotta:        "Week 5",
  bread:          "Week 5",
  wheat_farina:   "Week 5",
  sesame:         "Week 6",
  noodles:        "Week 6",
  edamame:        "Week 7",
  tofu:           "Week 7",
  coconut:        "Week 8",
  coconut_milk:   "Week 8",
  labneh:         "Week 9",
  salmon:         "Week 9",
  almond:         "Week 10",
  sardines:       "Week 10",
  pasta:          "Week 10",
  bulgur:         "Week 10",
  mozzarella:     "Week 10",
  cashew:         "Week 11",
  mascarpone:     "Week 11",
  trout:          "Week 11",
  walnut:         "Week 12",
  tilapia:        "Week 12",
  cottage_cheese: "Week 13",
  pecan:          "Week 13",
  cod:            "Week 14",
  queso_fresco:   "Week 14",
  sour_cream:     "Week 14",
  hazelnut:       "Week 14",
  mackerel:       "Week 15",
  pizza:          "Week 15",
};

// Age-based serving suggestions from Solid Starts
const getServingSuggestion = (foodId, ageMonths) => {
  const suggestions = {
    // Week 1-2 foods
    avocado: {
      4: "Thick spear with skin on for grip",
      6: "Thick spear or smashed on toast",
      9: "Diced or smashed",
      12: "Diced or sliced thin"
    },
    banana: {
      4: "Half banana with some peel for grip",
      6: "Whole peeled banana or thick slices",
      9: "Sliced coins or whole",
      12: "Whole or sliced"
    },
    peanut: {
      4: "Thin peanut butter mixed into purée or breast milk",
      6: "Thinned peanut butter on toast or in yogurt",
      9: "Peanut butter on toast strips",
      12: "Peanut butter sandwich pieces"
    },
    egg: {
      4: "Scrambled very soft with breast milk or formula",
      6: "Scrambled soft or omelet strips",
      9: "Scrambled or hard-boiled halves",
      12: "Any style, chopped or whole"
    },
    milk: {
      4: "Full-fat plain yogurt (pre-loaded spoon)",
      6: "Yogurt, cheese sticks, or cottage cheese",
      9: "Shredded cheese, yogurt, or cheese cubes",
      12: "Cheese slices, yogurt, or milk to drink"
    },
    sweet_potato: {
      4: "Mashed smooth or thick wedge roasted",
      6: "Thick roasted wedges or mashed",
      9: "Roasted cubes or mashed",
      12: "Roasted cubes, fries, or mashed"
    },
    green_bean: {
      4: "Puréed smooth or steamed whole (very soft)",
      6: "Steamed whole beans",
      9: "Steamed whole or chopped",
      12: "Steamed or sautéed"
    },
    pear: {
      4: "Puréed smooth or thin slices (very ripe)",
      6: "Thick slices (very ripe) or smashed",
      9: "Sliced thin or diced",
      12: "Sliced or whole"
    },
    apple: {
      4: "Applesauce (unsweetened) or steamed until very soft",
      6: "Thin slices steamed soft",
      9: "Thin raw slices or diced cooked",
      12: "Sliced thin raw or whole"
    },
    butternut_squash: {
      4: "Puréed smooth or mashed",
      6: "Roasted thick wedges or mashed",
      9: "Roasted cubes or mashed",
      12: "Roasted cubes or mashed"
    },
    potato: {
      4: "Mashed smooth with breast milk or butter",
      6: "Thick wedges roasted or mashed",
      9: "Diced roasted or mashed",
      12: "Cubed or mashed"
    },
    carrot: {
      4: "Puréed smooth",
      6: "Steamed thick sticks (very soft)",
      9: "Steamed coins or grated raw",
      12: "Steamed or raw grated"
    },
    wheat: {
      4: "Puffed wheat cereal softened in milk",
      6: "Toast strips or soft pasta",
      9: "Toast pieces or pasta shapes",
      12: "Bread, pasta, crackers"
    },
    oat: {
      4: "Smooth oat purée",
      6: "Thick oatmeal or oat strips",
      9: "Oatmeal or oat pancakes",
      12: "Oatmeal, granola, or oat bars"
    },
    soy: {
      4: "Soft silken tofu mashed smooth",
      6: "Soft tofu cubes (large)",
      9: "Tofu cubes or strips",
      12: "Tofu any style or edamame (shelled)"
    },
    sesame: {
      4: "Tahini thinned into purée or yogurt",
      6: "Tahini on toast or in hummus",
      9: "Tahini sauce or sesame seed paste",
      12: "Tahini or whole sesame seeds"
    },
    zucchini: {
      4: "Puréed smooth",
      6: "Steamed thick spears",
      9: "Steamed or sautéed coins",
      12: "Sautéed, grilled, or raw grated"
    },
    peach: {
      4: "Puréed smooth (very ripe)",
      6: "Thick wedges (very ripe, pit removed)",
      9: "Sliced thin or diced",
      12: "Sliced or whole (pit removed)"
    },
    pumpkin: {
      4: "Puréed smooth or mashed",
      6: "Roasted thick wedges or mashed",
      9: "Roasted cubes or mashed",
      12: "Roasted cubes or mashed"
    },
    plum: {
      4: "Puréed smooth (very ripe)",
      6: "Halved, pit removed (very ripe)",
      9: "Quartered or sliced thin",
      12: "Sliced or whole (pit removed)"
    },
    beet: {
      4: "Puréed smooth",
      6: "Steamed or roasted thick wedges",
      9: "Roasted cubes or grated",
      12: "Roasted, pickled, or raw grated"
    },
    rice: {
      4: "Rice cereal smooth or congee",
      6: "Soft sticky rice or rice balls",
      9: "Sticky rice balls or sushi rice",
      12: "Any style rice"
    },
    corn: {
      4: "Corn purée or polenta smooth",
      6: "Corn on cob (large piece) or polenta",
      9: "Corn kernels off cob or polenta",
      12: "Corn any style"
    },
    broccoli: {
      4: "Puréed smooth",
      6: "Steamed floret with long stem",
      9: "Steamed chopped florets",
      12: "Steamed or roasted pieces"
    },
    chicken: {
      4: "Puréed with broth",
      6: "Shredded very soft or drumstick",
      9: "Shredded or ground meatballs",
      12: "Shredded, cubed, or drumstick"
    },
    cashew: {
      4: "Cashew butter thinned with water or milk",
      6: "Cashew butter on toast",
      9: "Cashew butter or cashew cream",
      12: "Cashew butter or chopped cashews"
    },
    almond: {
      4: "Almond butter thinned with water or milk",
      6: "Almond butter on toast",
      9: "Almond butter or almond flour",
      12: "Almond butter or slivered almonds"
    },
    fish: {
      4: "Flaked salmon purée with breast milk",
      6: "Flaked cooked fish (boneless)",
      9: "Flaked or ground fish cakes",
      12: "Flaked fish or fish sticks"
    },
    mango: {
      4: "Puréed smooth",
      6: "Thick spear or smashed",
      9: "Diced or spears",
      12: "Diced or sliced"
    },
    strawberry: {
      4: "Mashed smooth (cut in quarters first)",
      6: "Whole berry, stem removed (large)",
      9: "Sliced thin or quartered",
      12: "Sliced or whole"
    },
    kiwi: {
      4: "Mashed smooth (very ripe)",
      6: "Thick wedges (very ripe)",
      9: "Diced or sliced thin",
      12: "Sliced or scooped"
    },
    melon: {
      4: "Puréed smooth",
      6: "Thick rind-on wedge for grip",
      9: "Diced or thin slices",
      12: "Diced or sliced"
    },
    orange: {
      4: "Orange juice mixed into food (small amount)",
      6: "Segmented with membrane removed",
      9: "Segments or sliced rounds",
      12: "Segments or whole peeled"
    },
    cauliflower: {
      4: "Puréed smooth",
      6: "Steamed floret with stem",
      9: "Steamed or roasted florets",
      12: "Roasted or raw florets"
    },
    asparagus: {
      4: "Puréed smooth",
      6: "Steamed whole spears (tips cut off)",
      9: "Steamed or roasted pieces",
      12: "Roasted or grilled spears"
    },
    bell_pepper: {
      4: "Roasted and puréed smooth",
      6: "Roasted strips (skin removed)",
      9: "Raw strips or roasted",
      12: "Raw or roasted strips"
    },
    cucumber: {
      4: "Puréed smooth (peeled, seeded)",
      6: "Thick spears (peeled)",
      9: "Sliced coins or spears",
      12: "Sliced or whole (peeled if thick skin)"
    },
    tomato: {
      4: "Tomato sauce smooth (no added salt/sugar)",
      6: "Large wedges (raw or cooked)",
      9: "Diced or sliced",
      12: "Diced, sliced, or whole cherry (halved)"
    },
    quinoa: {
      4: "Quinoa porridge smooth",
      6: "Cooked quinoa patties or balls",
      9: "Cooked quinoa loose or in patties",
      12: "Cooked quinoa any style"
    },
    beef: {
      4: "Beef puréed with broth",
      6: "Shredded pot roast or ground beef patty",
      9: "Ground beef or meatballs",
      12: "Ground, strips, or meatballs"
    },
    pork: {
      4: "Pork puréed with broth",
      6: "Shredded slow-cooked pork or ground",
      9: "Ground pork or shredded",
      12: "Ground, chops, or shredded"
    },
    turkey: {
      4: "Turkey puréed with broth",
      6: "Shredded turkey or ground patty",
      9: "Ground turkey or shredded",
      12: "Ground, sliced, or shredded"
    },
    lentil: {
      4: "Red lentil purée smooth",
      6: "Mashed lentils or lentil patties",
      9: "Whole cooked lentils or dal",
      12: "Cooked lentils any style"
    },
    spinach: {
      4: "Spinach puréed into other foods",
      6: "Chopped sautéed spinach",
      9: "Chopped or whole leaves cooked",
      12: "Cooked or raw (chopped)"
    },
    blueberry: {
      4: "Mashed smooth (cut in quarters first)",
      6: "Whole berries (flattened between fingers)",
      9: "Whole berries or halved",
      12: "Whole berries"
    },
    shellfish: {
      4: "Shrimp puréed with broth",
      6: "Shredded cooked shrimp (finely chopped)",
      9: "Chopped cooked shrimp",
      12: "Whole or chopped cooked shrimp"
    },
    black_bean: {
      4: "Black bean purée smooth",
      6: "Mashed black beans or bean patties",
      9: "Whole cooked beans (slightly mashed)",
      12: "Whole cooked beans"
    },
    chickpea: {
      4: "Chickpea purée (hummus smooth)",
      6: "Mashed chickpeas or hummus",
      9: "Whole cooked chickpeas (slightly mashed)",
      12: "Whole chickpeas or roasted"
    },
    // Generic suggestions for remaining foods
  };
  
  const foodSuggestions = suggestions[foodId];
  if (!foodSuggestions) {
    // Generic age-appropriate fallback
    if (ageMonths < 6) return "Start with smooth purée or very soft texture";
    if (ageMonths < 9) return "Soft pieces or mashed texture";
    if (ageMonths < 12) return "Soft cubes or mashed";
    return "Age-appropriate pieces or whole";
  }
  
  if (ageMonths < 6) return foodSuggestions[4];
  if (ageMonths < 9) return foodSuggestions[6];
  if (ageMonths < 12) return foodSuggestions[9];
  return foodSuggestions[12];
};

const FOODS = [
  // Exact 122 foods from Solid Starts PDF pages 2-3, left-to-right top-to-bottom
  // Page 2
  { id:"broccoli",        name:"Broccoli",        emoji:"🥦", allergen:false, week:1,  order:1   },
  { id:"olive_oil",       name:"Olive Oil",        emoji:"🫒", allergen:false, week:1,  order:2   },
  { id:"mango",           name:"Mango",            emoji:"🥭", allergen:false, week:2,  order:3   },
  { id:"cauliflower",     name:"Cauliflower",      emoji:"🥬", allergen:false, week:1,  order:4   },
  { id:"oats",            name:"Oats",             emoji:"🌾", allergen:false, week:1,  order:5   },
  { id:"cannellini_bean", name:"Cannellini Beans", emoji:"🫘", allergen:false, week:1,  order:6   },
  { id:"apple",           name:"Apple",            emoji:"🍎", allergen:false, week:1,  order:7   },
  { id:"egg",             name:"Egg",              emoji:"🥚", allergen:true,  week:1,  order:8   },
  { id:"corn",            name:"Corn",             emoji:"🌽", allergen:false, week:3,  order:9   },
  { id:"bell_pepper",     name:"Bell Pepper",      emoji:"🫑", allergen:false, week:2,  order:10  },
  { id:"chickpea",        name:"Chickpeas",        emoji:"🫘", allergen:false, week:2,  order:11  },
  { id:"lemon",           name:"Lemon",            emoji:"🍋", allergen:false, week:4,  order:12  },
  { id:"peanut",          name:"Peanut",           emoji:"🥜", allergen:true,  week:1,  order:13  },
  { id:"rice",            name:"Rice",             emoji:"🍚", allergen:false, week:3,  order:14  },
  { id:"pear",            name:"Pear",             emoji:"🍐", allergen:false, week:2,  order:15  },
  { id:"chayote",         name:"Chayote",          emoji:"🥬", allergen:false, week:5,  order:16  },
  { id:"artichoke",       name:"Artichoke",        emoji:"🌿", allergen:false, week:5,  order:17  },
  { id:"kidney_bean",     name:"Kidney Beans",     emoji:"🫘", allergen:false, week:4,  order:18  },
  { id:"tomato",          name:"Tomato",           emoji:"🍅", allergen:false, week:2,  order:19  },
  { id:"avocado",         name:"Avocado",          emoji:"🥑", allergen:false, week:1,  order:20  },
  { id:"tortilla",        name:"Tortilla",         emoji:"🫓", allergen:false, week:3,  order:21  },
  { id:"nopal",           name:"Nopal",            emoji:"🌵", allergen:false, week:6,  order:22  },
  { id:"lime",            name:"Lime",             emoji:"🍋", allergen:false, week:4,  order:23  },
  { id:"cantaloupe",      name:"Cantaloupe",       emoji:"🍈", allergen:false, week:3,  order:24  },
  { id:"yogurt",          name:"Yogurt",           emoji:"🥛", allergen:true,  week:1,  order:25  },
  { id:"butter",          name:"Butter",           emoji:"🧈", allergen:true,  week:2,  order:26  },
  { id:"milk",            name:"Milk",             emoji:"🥛", allergen:true,  week:1,  order:27  },
  { id:"black_bean",      name:"Black Beans",      emoji:"🫘", allergen:false, week:3,  order:28  },
  { id:"pumpkin_seed",    name:"Pumpkin Seeds",    emoji:"🌻", allergen:false, week:4,  order:29  },
  { id:"sweet_potato",    name:"Sweet Potato",     emoji:"🍠", allergen:false, week:2,  order:30  },
  { id:"goat_cheese",     name:"Goat Cheese",      emoji:"🧀", allergen:true,  week:3,  order:31  },
  { id:"sunflower_seed",  name:"Sunflower Seeds",  emoji:"🌻", allergen:false, week:4,  order:32  },
  { id:"beet",            name:"Beets",            emoji:"🫚", allergen:false, week:2,  order:33  },
  { id:"bread",           name:"Bread",            emoji:"🍞", allergen:true,  week:2,  order:34  },
  { id:"wheat_farina",    name:"Wheat Farina",     emoji:"🌾", allergen:true,  week:2,  order:35  },
  { id:"ricotta",         name:"Ricotta",          emoji:"🧀", allergen:true,  week:3,  order:36  },
  { id:"zucchini",        name:"Zucchini",         emoji:"🥒", allergen:false, week:2,  order:37  },
  { id:"papaya",          name:"Papaya",           emoji:"🥭", allergen:false, week:4,  order:38  },
  { id:"buckwheat",       name:"Buckwheat",        emoji:"🌾", allergen:false, week:4,  order:39  },
  { id:"chicken",         name:"Chicken",          emoji:"🍗", allergen:false, week:2,  order:40  },
  { id:"acorn_squash",    name:"Acorn Squash",     emoji:"🎃", allergen:false, week:3,  order:41  },
  { id:"garlic",          name:"Garlic",           emoji:"🧄", allergen:false, week:3,  order:42  },
  { id:"sesame",          name:"Sesame",           emoji:"🌱", allergen:true,  week:2,  order:43  },
  { id:"persimmon",       name:"Persimmon",        emoji:"🍊", allergen:false, week:6,  order:44  },
  { id:"green_bean",      name:"Green Beans",      emoji:"🫛", allergen:false, week:2,  order:45  },
  { id:"noodles",         name:"Noodles",          emoji:"🍜", allergen:false, week:3,  order:46  },
  { id:"okra",            name:"Okra",             emoji:"🥬", allergen:false, week:5,  order:47  },
  { id:"star_fruit",      name:"Star Fruit",       emoji:"⭐", allergen:false, week:7,  order:48  },
  { id:"pork",            name:"Pork",             emoji:"🥓", allergen:false, week:3,  order:49  },
  { id:"edamame",         name:"Edamame",          emoji:"🫛", allergen:true,  week:2,  order:50  },
  { id:"vinegar",         name:"Vinegar",          emoji:"🍶", allergen:false, week:5,  order:51  },
  { id:"tofu",            name:"Tofu",             emoji:"⬜", allergen:true,  week:2,  order:52  },
  { id:"ginger",          name:"Ginger",           emoji:"🫚", allergen:false, week:4,  order:53  },
  { id:"turnip",          name:"Turnip",           emoji:"🥔", allergen:false, week:5,  order:54  },
  { id:"pineapple",       name:"Pineapple",        emoji:"🍍", allergen:false, week:4,  order:55  },
  { id:"onion",           name:"Onion",            emoji:"🧅", allergen:false, week:3,  order:56  },
  { id:"mushroom",        name:"Mushroom",         emoji:"🍄", allergen:false, week:3,  order:57  },
  { id:"blueberry",       name:"Blueberry",        emoji:"🫐", allergen:false, week:2,  order:58  },
  { id:"chicken_liver",   name:"Chicken Liver",    emoji:"🍗", allergen:false, week:4,  order:59  },
  { id:"orange",          name:"Orange",           emoji:"🍊", allergen:false, week:3,  order:60  },
  { id:"coconut",         name:"Coconut",          emoji:"🥥", allergen:false, week:4,  order:61  },
  { id:"coconut_milk",    name:"Coconut Milk",     emoji:"🥥", allergen:false, week:4,  order:62  },
  { id:"chia_seed",       name:"Chia Seed",        emoji:"🌱", allergen:false, week:3,  order:63  },
  { id:"sapodilla",       name:"Sapodilla",        emoji:"🍑", allergen:false, week:8,  order:64  },
  { id:"banana",          name:"Banana",           emoji:"🍌", allergen:false, week:1,  order:65  },
  { id:"collard_greens",  name:"Collard Greens",   emoji:"🥬", allergen:false, week:4,  order:66  },
  { id:"quinoa",          name:"Quinoa",           emoji:"🌾", allergen:false, week:4,  order:67  },
  { id:"plantain",        name:"Plantain",         emoji:"🍌", allergen:false, week:4,  order:68  },
  { id:"lentil",          name:"Lentils",          emoji:"🫘", allergen:false, week:2,  order:69  },
  { id:"turmeric",        name:"Turmeric",         emoji:"🟡", allergen:false, week:4,  order:70  },
  { id:"cucumber",        name:"Cucumber",         emoji:"🥒", allergen:false, week:2,  order:71  },
  { id:"labneh",          name:"Labneh",           emoji:"🥛", allergen:true,  week:5,  order:72  },
  // Page 3
  { id:"salmon",          name:"Salmon",           emoji:"🐟", allergen:true,  week:3,  order:73  },
  { id:"raspberry",       name:"Raspberry",        emoji:"🫐", allergen:false, week:3,  order:74  },
  { id:"potato",          name:"Potato",           emoji:"🥔", allergen:false, week:2,  order:75  },
  { id:"asparagus",       name:"Asparagus",        emoji:"🌿", allergen:false, week:2,  order:76  },
  { id:"mozzarella",      name:"Mozzarella",       emoji:"🧀", allergen:true,  week:4,  order:77  },
  { id:"sardines",        name:"Sardines",         emoji:"🐟", allergen:true,  week:4,  order:78  },
  { id:"almond",          name:"Almonds",          emoji:"🌰", allergen:true,  week:3,  order:79  },
  { id:"pumpkin",         name:"Pumpkin",          emoji:"🎃", allergen:false, week:5,  order:80  },
  { id:"pasta",           name:"Pasta",            emoji:"🍝", allergen:true,  week:3,  order:81  },
  { id:"lamb",            name:"Lamb",             emoji:"🥩", allergen:false, week:5,  order:82  },
  { id:"bulgur",          name:"Bulgur",           emoji:"🌾", allergen:true,  week:5,  order:83  },
  { id:"peas",            name:"Peas",             emoji:"🫛", allergen:false, week:2,  order:84  },
  { id:"pinto_bean",      name:"Pinto Beans",      emoji:"🫘", allergen:false, week:4,  order:85  },
  { id:"blackberry",      name:"Blackberry",       emoji:"🫐", allergen:false, week:3,  order:86  },
  { id:"mascarpone",      name:"Mascarpone",       emoji:"🧀", allergen:true,  week:6,  order:87  },
  { id:"bok_choy",        name:"Bok Choy",         emoji:"🥬", allergen:false, week:5,  order:88  },
  { id:"cashew",          name:"Cashew",           emoji:"🥜", allergen:true,  week:3,  order:89  },
  { id:"romaine",         name:"Romaine",          emoji:"🥬", allergen:false, week:5,  order:90  },
  { id:"trout",           name:"Trout",            emoji:"🐟", allergen:true,  week:6,  order:91  },
  { id:"spinach",         name:"Spinach",          emoji:"🌿", allergen:false, week:2,  order:92  },
  { id:"kiwi",            name:"Kiwi",             emoji:"🥝", allergen:false, week:4,  order:93  },
  { id:"strawberry",      name:"Strawberry",       emoji:"🍓", allergen:false, week:2,  order:94  },
  { id:"beef",            name:"Beef",             emoji:"🥩", allergen:false, week:3,  order:95  },
  { id:"carrot",          name:"Carrot",           emoji:"🥕", allergen:false, week:2,  order:96  },
  { id:"walnut",          name:"Walnut",           emoji:"🌰", allergen:true,  week:3,  order:97  },
  { id:"taro",            name:"Taro",             emoji:"🥔", allergen:false, week:7,  order:98  },
  { id:"tilapia",         name:"Tilapia",          emoji:"🐟", allergen:true,  week:6,  order:99  },
  { id:"snow_peas",       name:"Snow Peas",        emoji:"🫛", allergen:false, week:5,  order:100 },
  { id:"turkey",          name:"Turkey",           emoji:"🦃", allergen:false, week:4,  order:101 },
  { id:"guava",           name:"Guava",            emoji:"🍐", allergen:false, week:7,  order:102 },
  { id:"cottage_cheese",  name:"Cottage Cheese",   emoji:"🧀", allergen:true,  week:4,  order:103 },
  { id:"grapefruit",      name:"Grapefruit",       emoji:"🍊", allergen:false, week:6,  order:104 },
  { id:"leeks",           name:"Leeks",            emoji:"🥬", allergen:false, week:5,  order:105 },
  { id:"ramps",           name:"Ramps",            emoji:"🌿", allergen:false, week:8,  order:106 },
  { id:"pecan",           name:"Pecans",           emoji:"🌰", allergen:true,  week:4,  order:107 },
  { id:"asian_pear",      name:"Asian Pear",       emoji:"🍐", allergen:false, week:6,  order:108 },
  { id:"cabbage",         name:"Cabbage",          emoji:"🥬", allergen:false, week:5,  order:109 },
  { id:"spaghetti_squash",name:"Spaghetti Squash", emoji:"🎃", allergen:false, week:6,  order:110 },
  { id:"rutabaga",        name:"Rutabaga",         emoji:"🥔", allergen:false, week:7,  order:111 },
  { id:"cod",             name:"Cod",              emoji:"🐟", allergen:true,  week:5,  order:112 },
  { id:"celery",          name:"Celery",           emoji:"🥬", allergen:false, week:5,  order:113 },
  { id:"queso_fresco",    name:"Queso Fresco",     emoji:"🧀", allergen:true,  week:5,  order:114 },
  { id:"sour_cream",      name:"Sour Cream",       emoji:"🥛", allergen:true,  week:5,  order:115 },
  { id:"hazelnut",        name:"Hazelnut",         emoji:"🌰", allergen:true,  week:4,  order:116 },
  { id:"jicama",          name:"Jicama",           emoji:"🥔", allergen:false, week:8,  order:117 },
  { id:"watermelon",      name:"Watermelon",       emoji:"🍉", allergen:false, week:3,  order:118 },
  { id:"figs",            name:"Figs",             emoji:"🫐", allergen:false, week:5,  order:119 },
  { id:"kimchi",          name:"Kimchi",           emoji:"🌶️", allergen:false, week:6,  order:120 },
  { id:"mackerel",        name:"Mackerel",         emoji:"🐟", allergen:true,  week:6,  order:121 },
  { id:"pizza",           name:"Pizza",            emoji:"🍕", allergen:true,  week:15, order:122 },
];

// Solid Starts weekly plans - from PDF, using validated food IDs
// 5 foods per week plan: foods 1-5 = week 1, 6-10 = week 2, etc.
function getFoodsForWeek(weekNum) {
  const sorted = [...FOODS].sort((a, b) => a.order - b.order);
  const startIdx = (weekNum - 1) * 5;
  return sorted.slice(startIdx, startIdx + 5);
}

function buildDefaultPlan(triedFoods, currentWeek = 1) {
  const weekFoods = getFoodsForWeek(currentWeek);
  const result = {};
  DAYS.forEach((day, i) => {
    // Mon–Fri: one food each; Sat–Sun: blank for user to fill
    result[day] = i < 5 && weekFoods[i] ? [weekFoods[i]] : [];
  });
  return result;
}

// Solid Starts PDF reference — exact meal names and new foods from each week's overview table
// Verified line-by-line from PDF. Columns: day, meal (Solid Foods Meal column), newFood
const SOLID_STARTS_REFERENCE = {
  1: [
    { day:1,  meal:"Broccoli Two Ways",                                          newFood:"Broccoli, Hemp Seeds, Olive Oil" },
    { day:2,  meal:"Mango or Banana Two Ways",                                   newFood:"Mango" },
    { day:3,  meal:"Cauliflower Two Ways",                                       newFood:"Cauliflower" },
    { day:4,  meal:"Oatmeal Two Ways",                                           newFood:"Oats" },
    { day:5,  meal:"Broccoli or Cauliflower Florets, Mashed Cannellini Beans",   newFood:"Cannellini Beans" },
    { day:6,  meal:"Mango Two Ways",                                             newFood:"—" },
    { day:7,  meal:"Stewed Apple Two Ways",                                      newFood:"Apple" },
  ],
  2: [
    { day:8,  meal:"Cauliflower Two Ways, Mashed Hard-Boiled Egg",               newFood:"Egg" },
    { day:9,  meal:"Broccoli Egg Strip",                                         newFood:"—" },
    { day:10, meal:"Mango or Banana Two Ways, Mashed Hard-Boiled Egg",           newFood:"—" },
    { day:11, meal:"Broccoli Egg Strip, Steamed Corn Cob",                       newFood:"Corn" },
    { day:12, meal:"Cooked Bell Pepper Half, Mashed Hard-Boiled Egg",            newFood:"Bell Pepper" },
    { day:13, meal:"Cauliflower Florets, Sesame-Free Hummus",                    newFood:"Chickpea, Lemon, Cumin" },
    { day:14, meal:"Apple Oatmeal Two Ways, Smooth Peanut Butter on the Fingertip", newFood:"Peanut" },
  ],
  3: [
    { day:15, meal:"Bell Pepper Half + Cauliflower Florets, Sesame-Free Hummus, Smooth Peanut Butter on the Fingertip", newFood:"—" },
    { day:16, meal:"Stewed Pear Half, Textured Rice Porridge with Smooth Peanut Butter Swirl", newFood:"Pear, Rice" },
    { day:17, meal:"Cauliflower-Egg Strip, Mashed Pear with Smooth Peanut Butter Swirl", newFood:"—" },
    { day:18, meal:"Chayote or Apple Two Ways with Smooth Peanut Butter Swirl",  newFood:"Chayote" },
    { day:19, meal:"Peanut Butter Swirl Oatmeal Two Ways",                       newFood:"Cinnamon, Artichoke, Kidney Bean, Tomato, Basil" },
    { day:20, meal:"Cooked Bell Pepper Half, Mashed Kidney Beans, Tomato Wedge", newFood:"Paprika" },
    { day:21, meal:"Breakfast Tacos",                                            newFood:"Avocado, Corn Tortilla, Nopal, Lime" },
  ],
  4: [
    { day:22, meal:"Thin Strips of Cantaloupe or Melon, Warm Porridge with Smooth Peanut Butter Swirl", newFood:"Cantaloupe" },
    { day:23, meal:"Cauliflower Two Ways with Yogurt",                           newFood:"Yogurt" },
    { day:24, meal:"Apple Swirl Yogurt",                                         newFood:"—" },
    { day:25, meal:"Creamy Polenta Two Ways",                                    newFood:"Butter, Whole Milk, Thyme" },
    { day:26, meal:"Buttery Broccoli Egg Strip, Thin Strips of Cantaloupe or Melon", newFood:"—" },
    { day:27, meal:"Cooked Bell Pepper Half, Mashed Black Beans, Yogurt with Smooth Peanut Butter Swirl", newFood:"Black Beans, Pumpkin Seeds, Sweet Potato" },
    { day:28, meal:"Buttery Broccoli Egg Strip, Mashed Black Beans on Corn Tortilla, Sweet Potato Spear with Ground-Up Pumpkin Seed", newFood:"—" },
  ],
  5: [
    { day:29, meal:"Broccoli Florets, Goat Cheese with Sunflower Seed, Mashed Hard-Boiled Egg", newFood:"Beet, Goat Cheese, Sunflower Seeds" },
    { day:30, meal:"Lemony Cauliflower Florets, Sesame-Free Beet Hummus",        newFood:"—" },
    { day:31, meal:"Cauliflower Two Ways with Breadcrumbs",                      newFood:"Bread" },
    { day:32, meal:"Sesame-Free Beet Hummus, Toast Strip",                       newFood:"—" },
    { day:33, meal:"Wheat Farina with Smooth Peanut Butter Swirl",              newFood:"Wheat Farina" },
    { day:34, meal:"Buttery Broccoli Egg Strip, Fresh Ricotta Cheese, Zucchini Rolled in Breadcrumbs", newFood:"Ricotta Cheese, Zucchini" },
    { day:35, meal:"Avocado Toast for Two, Papaya Handles or Banana Half with Ground-Up Peanut", newFood:"Papaya" },
  ],
  6: [
    { day:36, meal:"Creamy Buckwheat or Oatmeal Porridge, Papaya Handles or Banana Half with Ground-Up Peanut", newFood:"Buckwheat, Chicken, Acorn Squash, Garlic" },
    { day:37, meal:"Chicken Drumstick, Sesame-Free Squash Hummus, Tomato Wedge", newFood:"—" },
    { day:38, meal:"Cauliflower Two Ways with Sesame Tahini on the Fingertip",   newFood:"Sesame" },
    { day:39, meal:"Cauliflower Florets, Squash Hummus with Sesame Tahini",      newFood:"—" },
    { day:40, meal:"Wheat Farina with Sesame Tahini Swirl, Stewed Persimmon or Apple Halves", newFood:"Persimmon" },
    { day:41, meal:"Buttery Broccoli Egg Strip + Toast Strips, Whole Green Beans with Peanut-Sesame Dip", newFood:"Green Bean, Noodles" },
    { day:42, meal:"Buttery Egg Noodles, Okra Spears or Whole Green Beans with Peanut-Sesame Dip", newFood:"Okra" },
  ],
  7: [
    { day:43, meal:"Creamy Porridge with Peanut-Sesame Swirl, Sliced Star Fruit or Pineapple Spears", newFood:"Pork, Star Fruit, Rosemary" },
    { day:44, meal:"Avocado Toast for Two, Mashed Hard-Boiled Egg with Yogurt",  newFood:"—" },
    { day:45, meal:"Cauliflower Florets, Mashed Edamame",                        newFood:"Edamame, Vinegar" },
    { day:46, meal:"Broccoli Florets, Tofu Strip",                               newFood:"Tofu" },
    { day:47, meal:"Cauliflower Florets, Edamame Tofu Mash with Sesame Tahini",  newFood:"—" },
    { day:48, meal:"Ginger Peanut Noodles with Broccoli and Tofu, Turnip or Potato Wedges", newFood:"Ginger, Turnip, Pineapple, Onion" },
    { day:49, meal:"Broccoli Mushroom Tofu Egg Strips, Pineapple Core",          newFood:"Mushroom" },
  ],
  8: [
    { day:50, meal:"Purple Porridge Two Ways with Ground-Up Peanut and Sesame Seeds, Toast Strips", newFood:"Blueberries, Chicken Liver, Orange" },
    { day:51, meal:"Buttery Chicken Liver Pâté or Mashed Bean on Toast Strips with Sesame Seed, Cooked Bell Pepper Half", newFood:"—" },
    { day:52, meal:"Mango or Banana Two Ways with Coconut Flakes",               newFood:"Coconut" },
    { day:53, meal:"Broccoli Florets, Coconut Black Bean Mash",                  newFood:"Coconut Milk" },
    { day:54, meal:"Coconut Chia Seed Pudding, Sapodilla or Banana Spears",      newFood:"Chia Seeds, Sapodilla, Banana" },
    { day:55, meal:"Buttery Tofu Egg Strip, Sapodilla or Banana Spear, Rolled Coconut Flakes", newFood:"Collard Greens, Quinoa" },
    { day:56, meal:"Buttery Tofu Egg Strip, Coconut Collard Greens with Quinoa or Rice and Ground-Up Peanut", newFood:"—" },
  ],
  9: [
    { day:57, meal:"Coconut Porridge with Sesame Tahini Swirl, Papaya Two Ways, Cucumber Strips", newFood:"Mozzarella Cheese" },
    { day:58, meal:"Edamame Mash with Smooth Peanut Butter Swirl, Tomato Wedge, Creamy Cucumber Dip", newFood:"Sardine" },
    { day:59, meal:"Apple Cinnamon Oatmeal, Smooth Almond Butter on the Fingertip, Asparagus Spear Two Ways, Mashed Potatoes, Tomato Wedges", newFood:"Almond" },
    { day:60, meal:"Coconut Porridge with Smooth Almond Butter Swirl, Mango Pit, Cucumber Strips, Mashed Potatoes, Tomato Wedge", newFood:"—" },
    { day:61, meal:"Pumpkin Almond Pancake with Peanut-Sesame Drizzle and Raspberries", newFood:"Pumpkin, Pasta, Lamb" },
    { day:62, meal:"Bulgur-Squash Mash, Lamb Meatballs, Bulgur Ball, Edamame and Garden Pea Mash", newFood:"Bulgur, Garden Peas" },
    { day:63, meal:"Edamame-Garden Pea Dip, Salmon Cake",                        newFood:"Pinto Beans" },
  ],
  10: [
    { day:64, meal:"Pumpkin Almond Pancake with Peanut-Sesame Drizzle, Mascarpone or Ricotta Cheese with Quartered Blackberry or Flattened Blueberry", newFood:"Blackberry, Bok Choy, Mascarpone Cheese" },
    { day:65, meal:"Bok Choy, Peanut-Sesame 'Paint', Tofu Strip",               newFood:"—" },
    { day:66, meal:"Broccoli Florets, Cashew Butter on the Fingertip, Flattened Pinto Beans, Quinoa-Pinto Bean Mash, Tomato Wedge", newFood:"Cashew, Romaine" },
    { day:67, meal:"Mango Two Ways with Thinned Cashew Butter Drizzle, Avocado Dip, Shredded Chicken Breast, Whole Green Beans", newFood:"Cilantro" },
    { day:68, meal:"Berry Nut Butter Swirl Yogurt",                              newFood:"Trout" },
    { day:69, meal:"Trout or Salmon Spinach Egg Strips, Edamame Mash with Cashew Butter Swirl, Tomato Wedge", newFood:"Spinach" },
    { day:70, meal:"Coconut Porridge with Cashew Butter Swirl, Kiwi or Pear Two Ways", newFood:"Kiwi" },
  ],
  11: [
    { day:71, meal:"Strawberry Nut Butter Swirl Bowl, Cucumber Strips, Hummus, Toast", newFood:"Beef, Strawberry" },
    { day:72, meal:"Carrot Two Ways, Hummus, Penne Pasta with Bolognese Sauce",  newFood:"Carrot" },
    { day:73, meal:"Carrot Two Ways with Ground-Up Walnut, Cauliflower Florets, Herby Avocado Dip", newFood:"Walnut" },
    { day:74, meal:"Coconut Porridge with Ground-Up Walnut, Pear Two Ways",      newFood:"—" },
    { day:75, meal:"Apple Nut Pancake with Thinned Nut Butter Drizzle, Edamame Mash, Orange", newFood:"Taro, Tilapia" },
    { day:76, meal:"White Fish Egg Strips, Curried Taro or Sweet Potato with Ground-Up Walnut, Edamame Mash, Orange Wedge", newFood:"Snow Peas, Turkey" },
    { day:77, meal:"Mixed Nut Butter Swirl Bowl, Thinly Sliced Strawberries",    newFood:"—" },
  ],
  12: [
    { day:78, meal:"Strawberry Nut Butter Swirl Bowl, Cucumber Strips, Hummus, Toast", newFood:"Beef, Strawberry" },
    { day:79, meal:"Carrot Two Ways, Hummus, Penne Pasta with Bolognese Sauce",  newFood:"Carrot" },
    { day:80, meal:"Carrot Two Ways with Ground-Up Walnut, Cauliflower Florets, Herby Avocado Dip", newFood:"Walnut" },
    { day:81, meal:"Coconut Porridge with Ground-Up Walnut, Pear Two Ways",      newFood:"—" },
    { day:82, meal:"Apple Nut Pancake with Thinned Nut Butter Drizzle, Edamame Mash, Orange", newFood:"Taro, Tilapia" },
    { day:83, meal:"White Fish Egg Strips, Curried Taro or Sweet Potato with Ground-Up Walnut, Edamame Mash, Orange Wedge", newFood:"Snow Peas, Turkey" },
    { day:84, meal:"Mixed Nut Butter Swirl Bowl, Thinly Sliced Strawberries",    newFood:"—" },
  ],
  13: [
    { day:85, meal:"Cottage Cheese with Guava or Apple",                         newFood:"Guava, Cottage Cheese" },
    { day:86, meal:"Chia Seed Pudding with Mixed Nut Butter Swirl, Grapefruit Segments", newFood:"Grapefruit, Leeks, Ramps, Pecan" },
    { day:87, meal:"Carrot Two Ways with Ground-Up Pecan",                       newFood:"Asian Pear" },
    { day:88, meal:"Pear Two Ways with Ground-Up Pecan",                         newFood:"—" },
    { day:89, meal:"Apple Nut Pancake with Thinned Nut Butter Sauce",            newFood:"Cabbage" },
    { day:90, meal:"—",                                                          newFood:"Spaghetti Squash" },
    { day:91, meal:"—",                                                          newFood:"Rutabaga" },
  ],
  14: [
    { day:92, meal:"Banana Spears, Coconut Chia Seed Pudding with Ground-Up Granola", newFood:"Cod, Celery" },
    { day:93, meal:"Avocado Toast for Two, Tomato Two Ways",                     newFood:"Queso Fresco" },
    { day:94, meal:"Mixed Nut and Seed Butter Swirl Bowl, Orange Segments",      newFood:"Sour Cream, Hazelnut" },
    { day:95, meal:"Sweet Potato Two Ways with Ground-Up Hazelnut",              newFood:"—" },
    { day:96, meal:"Cauliflower Two Ways with Ground-Up Hazelnut",               newFood:"Watermelon, Jicama" },
    { day:97, meal:"Fig or Pear Yogurt Bowl with Ground-Up Hazelnut",            newFood:"Fig, Kimchi" },
    { day:98, meal:"Spiced Cauliflower Florets, Tofu Egg Strips",                newFood:"Mackerel" },
  ],
  15: [
    { day:99, meal:"—",                                                          newFood:"—" },
    { day:100,meal:"—",                                                          newFood:"Pizza" },
  ],
};

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const TIPS = [
  "Offer new foods in the morning so you can watch for reactions during the day.",
  "Babies may need 10–15 exposures before accepting a food. Keep offering!",
  "Gagging is normal and protective — it's different from choking. Stay calm.",
  "Eat together whenever possible. Babies learn by watching you.",
  "Texture matters more than variety early on — focus on safe prep first.",
  "Skip the salt and sugar. Baby's kidneys can't handle added sodium.",
  "Iron-rich foods are critical at 6 months — meat, lentils, and fortified cereals.",
];

const todayTip = TIPS[new Date().getDate() % TIPS.length];

function getCurrentWeek(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.ceil(diffDays / 7), 25); // up to week 25
}

function getAgeInMonths(birthday) {
  if (!birthday) return 6;
  const birth = new Date(birthday);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  return Math.max(4, months);
}

// ─── Supabase config — replace these two values with your own ───────────────
const SUPABASE_URL = "https://wmleqsmbpwymmbetqjxe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtbGVxc21icHd5bW1iZXRxanhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzIyNDEsImV4cCI6MjA4NzA0ODI0MX0.1h3VSXmNyCqxfcjMKKCSvEbmYmJUGLzYDMJkvAIoOlk";
const DATA_KEY = "shannon_family"; // shared row key — same for both phones
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_DATA = {
  triedFoods: ["peanut"],
  logs: [
    { foodId:"peanut", foodName:"Peanut", reaction:false, note:"First try! No reaction.", date:"2026-02-10" },
    { foodId:"peanut", foodName:"Peanut", reaction:false, note:"Second exposure going well.", date:"2026-02-12" }
  ],
  settings: { babyName:"Shannon", babyBirthday:"2025-09-15", startDate:"2026-02-10" },
  weekPlan: null, // built on first load
  nextWeekPlan: null, // built on first load
};

async function loadData() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/app_data?key=eq.${DATA_KEY}&select=value`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    const rows = await res.json();
    if (!rows || rows.length === 0) return buildDefaults();
    const data = rows[0].value;
    // Normalise weekPlan day values to always be arrays
    if (data.weekPlan) {
      Object.keys(data.weekPlan).forEach(day => {
        const v = data.weekPlan[day];
        if (!Array.isArray(v)) data.weekPlan[day] = v ? [v] : [];
      });
    } else {
      data.weekPlan = buildDefaultPlan(data.triedFoods || [], getCurrentWeek(data.settings?.startDate || DEFAULT_DATA.settings.startDate));
    }
    if (!data.nextWeekPlan || typeof data.nextWeekPlan !== 'object') {
      data.nextWeekPlan = buildDefaultPlan(data.triedFoods || [], getCurrentWeek(data.settings?.startDate || DEFAULT_DATA.settings.startDate) + 1);
    }
    return { ...DEFAULT_DATA, ...data };
  } catch (err) {
    console.error("loadData error:", err);
    return buildDefaults();
  }
}

function buildDefaults() {
  const week = getCurrentWeek(DEFAULT_DATA.settings.startDate);
  return {
    ...DEFAULT_DATA,
    weekPlan: buildDefaultPlan(DEFAULT_DATA.triedFoods, week),
    nextWeekPlan: buildDefaultPlan(DEFAULT_DATA.triedFoods, week + 1),
  };
}

// Debounce saves — waits 800ms after last change before writing to Supabase
// Uses explicit check→PATCH or POST to avoid relying on unique constraint for upsert
let _saveTimer = null;
function saveData(triedFoods, logs, weekPlan, nextWeekPlan, settings, onSaved) {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    };
    const payload = { value: { triedFoods, logs, weekPlan, nextWeekPlan, settings } };
    try {
      // Check if row already exists
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/app_data?key=eq.${DATA_KEY}&select=key`,
        { headers }
      );
      const existing = checkRes.ok ? await checkRes.json() : [];
      if (existing && existing.length > 0) {
        // Row exists — update it
        await fetch(`${SUPABASE_URL}/rest/v1/app_data?key=eq.${DATA_KEY}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        // Row doesn't exist — insert it
        await fetch(`${SUPABASE_URL}/rest/v1/app_data`, {
          method: "POST",
          headers,
          body: JSON.stringify({ key: DATA_KEY, ...payload }),
        });
      }
      onSaved && onSaved();
    } catch (err) {
      console.error("saveData error:", err);
      onSaved && onSaved();
    }
  }, 800);
}

// Food swap modal
function FoodSwapModal({ currentFood, triedFoods, onSwap, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = FOODS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={onClose}>
      <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"60vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:4 }}>Swap Food</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Currently: {currentFood?.emoji} {currentFood?.name}</div>
        
        <input 
          type="text" 
          placeholder="Search foods..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:16 }}
        />

        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {filtered.map(f => (
            <button key={f.id} onClick={() => { onSwap(f); onClose(); }}
              style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
              {f.emoji} {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Allergen detail modal
function AllergenDetailModal({ food, logs, onClose }) {
  const foodLogs = logs.filter(l => l.foodId === food.id);
  
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={onClose}>
      <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ fontSize:40 }}>{food.emoji}</div>
          <div>
            <div style={{ fontWeight:800, fontSize:18, color:C.charcoal }}>{food.name}</div>
            <div style={{ fontSize:12, color:C.muted }}>Tried {foodLogs.length} time{foodLogs.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        
        {foodLogs.length === 0 ? (
          <div style={{ padding:"20px 0", textAlign:"center", color:C.muted }}>No logs yet</div>
        ) : (
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.slateDark, marginBottom:10 }}>Log History</div>
            {foodLogs.map((log, i) => (
              <div key={i} style={{ background: log.reaction ? C.redLight : C.slateLight, border:`1px solid ${log.reaction ? C.redMid : C.slateMid}`, borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontWeight:700, color: log.reaction ? C.red : C.charcoal }}>{log.date}</span>
                  {log.reaction && <span style={{ fontSize:10, fontWeight:700, color:C.red }}>⚠ Reaction</span>}
                </div>
                {log.note && <div style={{ fontSize:12, color:C.muted }}>{log.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Settings modal
function SettingsModal({ settings, onSave, onClose }) {
  const [babyName, setBabyName] = useState(settings.babyName);
  const [babyBirthday, setBabyBirthday] = useState(settings.babyBirthday);
  const [startDate, setStartDate] = useState(settings.startDate);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={onClose}>
      <div style={{ background:C.white, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:C.charcoal, marginBottom:16 }}>Settings</div>
        
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>Baby's Name</label>
          <input 
            type="text" 
            value={babyName}
            onChange={e => setBabyName(e.target.value)}
            style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }}
          />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>Baby's Birthday</label>
          <input 
            type="date" 
            value={babyBirthday}
            onChange={e => setBabyBirthday(e.target.value)}
            style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }}
          />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>First Day of Solids</label>
          <input 
            type="date" 
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }}
          />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:10, padding:"12px 0", fontWeight:700, cursor:"pointer", color:C.slateDark }}>Cancel</button>
          <button onClick={() => { onSave({ babyName, babyBirthday, startDate }); onClose(); }} style={{ flex:2, background:C.blue, border:"none", borderRadius:10, padding:"12px 0", fontWeight:700, color:C.white, cursor:"pointer", fontSize:14 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function getWeekDateRange(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + Math.floor(daysSinceStart / 7) * 7);
  const mon = new Date(weekStart);
  const dow = mon.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  mon.setDate(mon.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmtFull = (d) => d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const fmtDay  = (d) => d.toLocaleDateString('en-US', { day:'numeric' });
  return `${fmtFull(mon)}–${fmtDay(sun)}`;
}

function getNextWeekDateRange(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + Math.floor(daysSinceStart / 7) * 7);
  const mon = new Date(weekStart);
  const dow = mon.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  mon.setDate(mon.getDate() + diffToMon + 7); // +7 for next week
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmtFull = (d) => d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const fmtDay  = (d) => d.toLocaleDateString('en-US', { day:'numeric' });
  return `${fmtFull(mon)}–${fmtDay(sun)}`;
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
}

// Overview tab
function OverviewTab({ triedFoods, logs, weekPlan, nextWeekPlan, onLogFood, onCreatePlan, onMarkTried, onUnmarkTried, onUndoTried, setWeekPlan, ageMonths, startDate, currentWeek }) {
  const [viewNextWeek, setViewNextWeek] = useState(false);
  const [swapTodayFood, setSwapTodayFood] = useState(null);
  const [addToToday, setAddToToday] = useState(false);
  const [swapDay, setSwapDay] = useState(null);
  const [overviewTodaySearch, setOverviewTodaySearch] = useState("");
  const [overviewDaySearch, setOverviewDaySearch] = useState("");
  const [confirmDeleteToday, setConfirmDeleteToday] = useState(null); // food object
  const allergensDone = ALLERGEN_GROUPS.filter(g => { const gl = (logs||[]).filter(l => g.foods.includes(l.foodId) && !l.reaction); const dDates = new Set(gl.map(l => l.date)).size; return dDates >= 2; }).length;
  const allergensTotal = ALLERGEN_GROUPS.length;
  const todayDay = DAYS[TODAY_IDX];
  const todayFood = weekPlan[todayDay];
  const getGroupCleared = (group) => {
    const groupLogs = (logs || []).filter(l => group.foods.includes(l.foodId));
    const nonReactionLogs = groupLogs.filter(l => !l.reaction);
    const distinctDates = new Set(nonReactionLogs.map(l => l.date)).size;
    return distinctDates >= 2;
  };
  const nextAllergens = ALLERGEN_GROUPS.filter(g => !getGroupCleared(g)).slice(0, 3);

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Today's Tip */}
      <div style={{ background:C.slateDark, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#90A8C0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>💡 Today's Tip</div>
        <div style={{ fontSize:13, color:C.white, lineHeight:1.5 }}>{todayTip}</div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {[
          { label:"Foods Tried", value: triedFoods.length, color: C.green },
          { label:"Allergens Cleared", value: allergensDone + "/" + allergensTotal, color: C.gold },
          { label:"Protocol Week", value: Math.min(currentWeek,15) + "/15", color: C.slate },
        ].map(s => (
          <div key={s.label} style={{ flex:1, background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px 10px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:C.muted, marginTop:2, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today */}
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:14, overflow:"hidden" }}>
        <div style={{ background:C.slateDark, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:C.white, fontWeight:700, fontSize:13 }}>Today · {getTodayLabel()}</div>
          <button onClick={() => { setAddToToday(true); setOverviewTodaySearch(""); }} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, color:C.white, fontSize:11, fontWeight:700, padding:"4px 10px", cursor:"pointer" }}>+ Add Food</button>
        </div>
        {(() => {
          const todayFoods = weekPlan[todayDay] || [];
          const foodsArray = Array.isArray(todayFoods) ? todayFoods : [todayFoods].filter(Boolean);
          
          if (foodsArray.length === 0) {
            return (
              <div style={{ padding:"24px 14px", color:C.muted, fontSize:16, fontStyle:"italic", textAlign:"center" }}>Shannon's day off 🧘</div>
            );
          }
          
          return foodsArray.map((todayFood, idx) => {
            const todayFoodLogs = (logs||[]).filter(l => l.foodId === todayFood.id && !l.reaction);
            const isAllergenFirstIntro = todayFood.allergen && todayFoodLogs.length === 0;
            return (
            <div key={todayFood.id + "-" + idx} style={{ padding:14, borderBottom: idx < foodsArray.length - 1 ? "1px solid " + C.border : "none", borderTop: isAllergenFirstIntro ? "2px solid " + C.goldMid : undefined }}>
              {isAllergenFirstIntro && <div style={{ fontSize:11, fontWeight:700, color:"#7A5C00", background:C.goldLight, padding:"5px 14px", margin:"-14px -14px 12px -14px" }}>First introduction — watch for reactions for 2 hours</div>}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ fontSize:36, lineHeight:1, flexShrink:0 }}>{todayFood.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <span style={{ fontWeight:800, fontSize:14, color:C.charcoal }}>{todayFood.name}</span>
                    {todayFood.allergen && <span style={{ background:C.goldLight, border:"1px solid " + C.goldMid, borderRadius:6, fontSize:10, fontWeight:700, color:C.gold, padding:"2px 6px", flexShrink:0 }}>⚠</span>}
                  </div>
                  {triedFoods.includes(todayFood.id)
                    ? <button onClick={() => onUndoTried(todayFood)} style={{ background:C.greenLight, border:"1px solid " + C.greenMid, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:C.green, cursor:"pointer" }}>✓ Tried</button>
                    : <button onClick={() => onMarkTried(todayFood)} style={{ background:C.slateLight, border:"1px solid " + C.slateMid, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:C.slate, cursor:"pointer" }}>Not Tried</button>
                  }
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={() => onLogFood(todayFood)} style={{ background:C.blue, border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", color:C.white, fontWeight:700 }}>Log</button>
                  <button onClick={() => { setSwapTodayFood(todayFood); setOverviewTodaySearch(""); }} style={{ background:C.white, border:"1px solid " + C.slateMid, borderRadius:6, padding:"4px 8px", fontSize:13, cursor:"pointer" }}>🔄</button>
                  <button onClick={() => setConfirmDeleteToday(todayFood)} style={{ background:"transparent", border:"1px solid " + C.redMid, borderRadius:6, fontSize:13, color:C.red, cursor:"pointer", padding:"4px 8px" }}>🗑️</button>
                </div>
              </div>
              <div style={{ background:"#FFF8EE", borderRadius:10, padding:"10px 12px", border:"1px solid #F5D87A" }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#7A5C00", marginBottom:4, letterSpacing:"0.4px" }}>HOW TO SERVE · {ageMonths} MONTHS</div>
                <div style={{ fontSize:12, color:C.charcoal, lineHeight:1.5 }}>{getServingSuggestion(todayFood.id, ageMonths)}</div>
              </div>
            </div>
            );
          });
        })()}
      </div>

      {/* Add food to today panel */}
      {addToToday && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => { setAddToToday(false); setOverviewTodaySearch(""); }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:12 }}>Add Food to Today</div>
            <input type="text" placeholder="Search foods..." value={overviewTodaySearch} onChange={e => setOverviewTodaySearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {FOODS.filter(f => f.name.toLowerCase().includes(overviewTodaySearch.toLowerCase())).map(f => (
                <button key={f.id} onClick={() => {
                  const cur = Array.isArray(weekPlan[todayDay]) ? weekPlan[todayDay] : [weekPlan[todayDay]].filter(Boolean);
                  setWeekPlan(p => ({...p, [todayDay]: [...cur, f]}));
                  setAddToToday(false); setOverviewTodaySearch("");
                }} style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swap food in today panel */}
      {swapTodayFood && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => { setSwapTodayFood(null); setOverviewTodaySearch(""); }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:4 }}>Swap Food</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Currently: {swapTodayFood.emoji} {swapTodayFood.name}</div>
            <input type="text" placeholder="Search foods..." value={overviewTodaySearch} onChange={e => setOverviewTodaySearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {FOODS.filter(f => f.name.toLowerCase().includes(overviewTodaySearch.toLowerCase())).map(f => (
                <button key={f.id} onClick={() => {
                  setWeekPlan(p => ({...p, [todayDay]: (p[todayDay]||[]).map(x => x.id === swapTodayFood.id ? f : x)}));
                  setSwapTodayFood(null); setOverviewTodaySearch("");
                }} style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete today food */}
      {confirmDeleteToday && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:24 }} onClick={() => setConfirmDeleteToday(null)}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:8 }}>Remove {confirmDeleteToday.name}?</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>This removes it from today's plan. Log history won't be affected.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDeleteToday(null)} style={{ flex:1, background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:10, padding:"11px 0", fontWeight:700, color:C.slateDark, cursor:"pointer" }}>Cancel</button>
              <button onClick={() => { setWeekPlan(p => ({...p, [todayDay]: (p[todayDay]||[]).filter(f => f.id !== confirmDeleteToday.id)})); setConfirmDeleteToday(null); }} style={{ flex:1, background:C.red, border:"none", borderRadius:10, padding:"11px 0", fontWeight:700, color:C.white, cursor:"pointer" }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* This Week */}
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:14 }}>
        <div style={{ padding:"12px 14px 8px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontWeight:700, fontSize:13, color:C.slateDark }}>{viewNextWeek ? "Next Week" : "This Week"} · {viewNextWeek ? getNextWeekDateRange(startDate) : getWeekDateRange(startDate)}</div>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={() => setViewNextWeek(false)} style={{ background: viewNextWeek ? C.slateLight : C.slateDark, border:`1px solid ${C.slateMid}`, borderRadius:6, padding:"3px 8px", cursor:"pointer", color: viewNextWeek ? C.slate : C.white, fontWeight:700, fontSize:13, lineHeight:1 }}>&#8249;</button>
            <button onClick={() => setViewNextWeek(true)} style={{ background: viewNextWeek ? C.slateDark : C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:6, padding:"3px 8px", cursor:"pointer", color: viewNextWeek ? C.white : C.slate, fontWeight:700, fontSize:13, lineHeight:1 }}>&#8250;</button>
          </div>
        </div>
        <div style={{ display:"flex", padding:"10px 14px", gap:8, overflowX:"auto" }}>
          {DAYS.map((d,i) => {
            const foods = (viewNextWeek ? nextWeekPlan : weekPlan)[d] || [];
            const isToday = i === TODAY_IDX;
            const firstFood = Array.isArray(foods) ? foods[0] : foods;
            const tried = firstFood && triedFoods.includes(firstFood.id);
            const hasMultiple = Array.isArray(foods) && foods.length > 1;
            return (
              <div key={d} style={{ flexShrink:0, textAlign:"center", minWidth:48, cursor:"pointer" }} onClick={() => setSwapDay(d)}>
                <div style={{ fontSize:10, fontWeight: isToday ? 800 : 600, color: isToday ? C.blue : C.muted, marginBottom:4 }}>{d}</div>
                <div style={{ width:44, height:44, borderRadius:10, background: tried ? C.greenLight : C.slateLight, border:`2px solid ${isToday ? C.blue : tried ? C.greenMid : C.slateMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto", position:"relative" }}>
                  {firstFood ? firstFood.emoji : "·"}
                  {hasMultiple && <div style={{ position:"absolute", top:-4, right:-4, background:C.blue, color:C.white, borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>+{foods.length - 1}</div>}
                </div>
                <div style={{ fontSize:9, color:C.muted, marginTop:3, maxWidth:48, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{firstFood?.name || "—"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {swapDay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => { setSwapDay(null); setOverviewDaySearch(""); }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:12 }}>Add Food to {DAY_FULL[DAYS.indexOf(swapDay)]}</div>
            <input type="text" placeholder="Search foods..." value={overviewDaySearch} onChange={e => setOverviewDaySearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {FOODS.filter(f => f.name.toLowerCase().includes(overviewDaySearch.toLowerCase())).map(f => (
                <button key={f.id} onClick={() => { 
                  const currentFoods = weekPlan[swapDay] || [];
                  const foodsArray = Array.isArray(currentFoods) ? currentFoods : [currentFoods].filter(Boolean);
                  setWeekPlan(p => ({...p, [swapDay]: [...foodsArray, f]}));
                  setSwapDay(null); setOverviewDaySearch("");
                }}
                  style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Allergen Action Items */}
      {(() => {
        const today = new Date();
        const todayISO = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
        const parseD = (d) => { try { const [y,m,dy] = d.split('-').map(Number); return new Date(y,m-1,dy); } catch(e) { return new Date(d); }};
        
        // Cleared allergens where last log > 3 days ago (need maintenance)
        const needsMaintenance = ALLERGEN_GROUPS.filter(g => {
          const nonReactionLogs = (logs||[]).filter(l => g.foods.includes(l.foodId) && !l.reaction);
          const distinctDates = new Set(nonReactionLogs.map(l => l.date)).size;
          if (distinctDates < 2) return false;
          const sorted = [...nonReactionLogs].sort((a,b) => parseD(b.date) - parseD(a.date));
          const daysSince = Math.floor((parseD(todayISO) - parseD(sorted[0].date)) / 86400000);
          return daysSince > 3;
        });

        // Not-yet-cleared allergens (need introduction or more exposures)
        const notCleared = ALLERGEN_GROUPS.filter(g => {
          const nonReactionLogs = (logs||[]).filter(l => g.foods.includes(l.foodId) && !l.reaction);
          return new Set(nonReactionLogs.map(l => l.date)).size < 2;
        }).slice(0, 3);

        return (
          <>
            {needsMaintenance.length > 0 && (
              <div style={{ background:C.white, borderRadius:14, border:`2px solid ${C.redMid}`, marginBottom:14 }}>
                <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.red }}>Allergens Overdue for Dose</div>
                  <div style={{ fontSize:11, color:C.muted }}>Cleared allergens need 2+ exposures per week to maintain tolerance</div>
                </div>
                <div style={{ padding:"10px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                  {needsMaintenance.map(g => {
                    const nonReactionLogs = (logs||[]).filter(l => g.foods.includes(l.foodId) && !l.reaction);
                    const sorted = [...nonReactionLogs].sort((a,b) => parseD(b.date) - parseD(a.date));
                    const daysSince = Math.floor((parseD(todayISO) - parseD(sorted[0].date)) / 86400000);
                    return (
                      <div key={g.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:C.redLight, border:`1px solid ${C.redMid}`, borderRadius:10 }}>
                        <div style={{ fontSize:24 }}>{g.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:C.charcoal }}>{g.name}</div>
                          <div style={{ fontSize:11, color:C.red, fontWeight:600 }}>Last given {daysSince} day{daysSince !== 1 ? 's' : ''} ago</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {notCleared.length > 0 && (
              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:14 }}>
                <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.slateDark }}>Next Allergens to Introduce</div>
                </div>
                <div style={{ padding:"10px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                  {notCleared.map(g => {
                    const nonReactionLogs = (logs||[]).filter(l => g.foods.includes(l.foodId) && !l.reaction);
                    const distinctDates = new Set(nonReactionLogs.map(l => l.date)).size;
                    return (
                      <div key={g.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:10 }}>
                        <div style={{ fontSize:24 }}>{g.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:C.charcoal }}>{g.name}</div>
                          <div style={{ fontSize:11, color:C.muted }}>{g.timeline} · {distinctDates}/2 exposures on separate days</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {needsMaintenance.length === 0 && notCleared.length === 0 && (
              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.greenMid}`, padding:"14px", marginBottom:14, textAlign:"center" }}>
                <div style={{ fontWeight:700, color:C.green, fontSize:13 }}>All allergens on track</div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

// Weekly/Plan tab
function WeeklyTab({ triedFoods, weekPlan, setWeekPlan, nextWeekPlan, setNextWeekPlan, onLogFood, onMarkTried, onUnmarkTried, onUndoTried, onCreatePlan, onCreateNextWeekPlan, ageMonths, currentWeek }) {
  const [swapDay, setSwapDay] = useState(null); // { week: 'current'|'next', day: 'Mon' }
  const [swapFood, setSwapFood] = useState(null); // { week, day, food }
  const [showSSRef, setShowSSRef] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [swapSearch, setSwapSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // { week, day, food, idx }

  const getPlan = (week) => week === 'next' ? nextWeekPlan : weekPlan;
  const setPlan = (week) => week === 'next' ? setNextWeekPlan : setWeekPlan;

  const handleDeleteFood = (week, day, foodToDelete, foodIdx) => {
    setConfirmDelete({ week, day, food: foodToDelete, idx: foodIdx });
  };
  const confirmDeleteFood = () => {
    if (!confirmDelete) return;
    setPlan(confirmDelete.week)(p => ({ ...p, [confirmDelete.day]: p[confirmDelete.day].filter((f, i) => i !== confirmDelete.idx) }));
    setConfirmDelete(null);
  };

  const handleSwapFood = (week, day, oldFood, newFood) => {
    setPlan(week)(p => ({ ...p, [day]: p[day].map(f => f.id === oldFood.id ? newFood : f) }));
  };

  const refFoods = SOLID_STARTS_REFERENCE[Math.min(currentWeek, 15)] || [];

  return (
    <div style={{ paddingBottom:90 }}>
      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:C.charcoal }}>Week {currentWeek} Menu</div>
        <div style={{ display:"flex", gap:8 }}>
          {/* Solid Starts Guide reference button */}
          <button onClick={() => setShowSSRef(true)} style={{ background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:10, color:"#7A5C00", fontWeight:700, fontSize:12, padding:"8px 12px", cursor:"pointer" }}>
            📖 Solid Starts Guide
          </button>
          {/* Generate plan icon button */}
          <button onClick={() => {
            const hasItems = Object.values(weekPlan).some(d => Array.isArray(d) && d.length > 0);
            if (hasItems) {
              if (!window.confirm("Rebuild this week's plan? Your current changes will be replaced.")) return;
            }
            onCreatePlan();
          }} title="Rebuild This Week's Plan" style={{ background:C.blue, border:"none", borderRadius:10, color:C.white, fontWeight:700, fontSize:12, padding:"8px 12px", cursor:"pointer" }}>
            ✦ This Week
          </button>
          <button onClick={() => {
            const hasItems = Object.values(nextWeekPlan).some(d => Array.isArray(d) && d.length > 0);
            if (hasItems) {
              if (!window.confirm("Rebuild next week's plan? Your current changes will be replaced.")) return;
            }
            onCreateNextWeekPlan();
          }} title="Rebuild Next Week's Plan" style={{ background:C.slateDark, border:"none", borderRadius:10, color:C.white, fontWeight:700, fontSize:12, padding:"8px 12px", cursor:"pointer" }}>
            ✦ Next Week
          </button>
        </div>
      </div>

      {/* Solid Starts Reference Popup */}
      {showSSRef && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => setShowSSRef(false)}>
          <div style={{ background:C.white, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"75vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontWeight:800, fontSize:17, color:C.charcoal }}>📖 Solid Starts Guide</div>
              <button onClick={() => setShowSSRef(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>
              Week {currentWeek} new foods from the PDF — reference only.
            </div>
            {refFoods.length === 0 ? (
              <div style={{ color:C.muted, fontSize:13, padding:"12px 0" }}>No reference data for this week.</div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:C.slateDark }}>
                    <th style={{ padding:"7px 10px", textAlign:"left", color:C.white, fontWeight:700, fontSize:11, borderRadius:"8px 0 0 0", whiteSpace:"nowrap" }}>Day</th>
                    <th style={{ padding:"7px 10px", textAlign:"left", color:C.white, fontWeight:700, fontSize:11 }}>Solid Foods Meal</th>
                    <th style={{ padding:"7px 10px", textAlign:"left", color:C.white, fontWeight:700, fontSize:11, borderRadius:"0 8px 0 0" }}>New Food</th>
                  </tr>
                </thead>
                <tbody>
                  {refFoods.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.slateLight, borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:"8px 10px", color:C.muted, fontWeight:700, fontSize:11, whiteSpace:"nowrap", verticalAlign:"top" }}>Day {row.day}</td>
                      <td style={{ padding:"8px 10px", color:C.slate, fontSize:11, verticalAlign:"top" }}>{row.meal}</td>
                      <td style={{ padding:"8px 10px", verticalAlign:"top" }}>
                        {row.newFood === "—" ? (
                          <span style={{ color:C.muted, fontSize:11 }}>—</span>
                        ) : (
                          <span style={{ color:C.charcoal, fontWeight:600, fontSize:11 }}>{row.newFood}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Helper to render one week's days */}
      {(['current', 'next']).map(weekType => {
        const plan = weekType === 'next' ? nextWeekPlan : weekPlan;
        const weekNum = weekType === 'next' ? currentWeek + 1 : currentWeek;
        return (
          <div key={weekType}>
            {/* Week divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, marginTop: weekType === 'next' ? 20 : 0 }}>
              <div style={{ flex:1, height:1, background:C.slateMid }} />
              <div style={{ fontWeight:800, fontSize:12, color:C.slateDark, padding:"4px 12px", background:weekType === 'next' ? C.slateDark : C.blue, borderRadius:20, color:C.white }}>
                {weekType === 'current' ? `This Week · Week ${currentWeek}` : `Next Week · Week ${Math.min(weekNum,15)}`}
              </div>
              <div style={{ flex:1, height:1, background:C.slateMid }} />
            </div>

            {DAYS.map((d, i) => {
              const foods = plan[d] || [];
              const isToday = weekType === 'current' && i === TODAY_IDX;
              const isWeekend = i >= 5;
              const swapKey = weekType + '_' + d;
              return (
                <div key={swapKey} style={{ background:C.white, borderRadius:14, border:`2px solid ${isToday ? C.blue : C.border}`, marginBottom:10, overflow:"hidden" }}>
                  <div style={{ background: isToday ? C.slateDark : C.slateLight, padding:"9px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.slateMid}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontWeight:700, fontSize:13, color: isToday ? C.white : C.slateDark }}>{DAY_FULL[i]}</span>
                      {isToday && <span style={{ background:C.blue, borderRadius:6, fontSize:10, fontWeight:700, color:C.white, padding:"1px 7px" }}>Today</span>}
                      {isWeekend && <span style={{ background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:6, fontSize:10, fontWeight:600, color:C.muted, padding:"1px 7px" }}>Open — add your own</span>}
                    </div>
                    <button onClick={() => setSwapDay(swapDay === swapKey ? null : swapKey)} style={{ background:"transparent", border:`1px solid ${isToday?'rgba(255,255,255,0.3)':C.slateMid}`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:isToday?C.white:C.slate, cursor:"pointer" }}>+ Add Food</button>
                  </div>

                  {foods.length === 0 ? (
                    <div style={{ padding:"14px", color:C.muted, fontSize:13 }}>No foods planned</div>
                  ) : foods.map((food, idx) => {
                    const tried = triedFoods.includes(food.id);
                    return (
                      <div key={`${food.id}-${idx}`} style={{ padding:"12px 14px", borderBottom: idx < foods.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                          <div style={{ fontSize:32, lineHeight:1, flexShrink:0 }}>{food.emoji}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                              <span style={{ fontWeight:800, fontSize:14, color:C.charcoal }}>{food.name}</span>
                              {food.allergen && <span style={{ background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:6, fontSize:10, fontWeight:700, color:C.gold, padding:"1px 6px", flexShrink:0 }}>⚠</span>}
                            </div>
                            {tried
                              ? <button onClick={() => onUndoTried(food)} style={{ background:C.greenLight, border:`1px solid ${C.greenMid}`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:C.green, cursor:"pointer" }}>✓ Tried</button>
                              : <button onClick={() => onMarkTried(food)} style={{ background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:C.slate, cursor:"pointer" }}>Not Tried</button>
                            }
                          </div>
                          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                            <button onClick={() => onLogFood(food)} style={{ background:C.blue, border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", color:C.white, fontWeight:700 }}>Log</button>
                            <button onClick={() => { setSwapFood({ week: weekType, day: d, food }); setSwapSearch(""); }} style={{ background:C.white, border:`1px solid ${C.slateMid}`, borderRadius:6, padding:"4px 8px", fontSize:13, cursor:"pointer" }}>🔄</button>
                            <button onClick={() => handleDeleteFood(weekType, d, food, idx)} style={{ background:"transparent", border:`1px solid ${C.redMid}`, borderRadius:6, fontSize:13, color:C.red, cursor:"pointer", padding:"4px 8px" }}>🗑️</button>
                          </div>
                        </div>
                        <div style={{ background:"#FFF8EE", borderRadius:10, padding:"10px 12px", border:`1px solid #F5D87A` }}>
                          <div style={{ fontSize:10, fontWeight:800, color:"#7A5C00", marginBottom:4, letterSpacing:"0.4px" }}>HOW TO SERVE · {ageMonths} MONTHS</div>
                          <div style={{ fontSize:12, color:C.charcoal, lineHeight:1.5 }}>{getServingSuggestion(food.id, ageMonths)}</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add food panel */}
                  {swapDay === swapKey && (
                    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => setSwapDay(null)}>
                      <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:12 }}>Add Food to {DAY_FULL[i]}</div>
                        <input type="text" placeholder="Search foods..." value={addSearch} onChange={e => setAddSearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                          {FOODS.filter(f => f.name.toLowerCase().includes(addSearch.toLowerCase())).map(f => (
                            <button key={f.id} onClick={() => {
                              const cur = plan[d] || [];
                              const arr = Array.isArray(cur) ? cur : [cur].filter(Boolean);
                              setPlan(weekType)(p => ({...p, [d]: [...arr, f]}));
                              setSwapDay(null); setAddSearch("");
                            }} style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                              {f.emoji} {f.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Swap food modal */}
      {swapFood && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => { setSwapFood(null); setSwapSearch(""); }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:4 }}>Swap Food</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Currently: {swapFood.food.emoji} {swapFood.food.name}</div>
            <input type="text" placeholder="Search foods..." value={swapSearch} onChange={e => setSwapSearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {FOODS.filter(f => f.name.toLowerCase().includes(swapSearch.toLowerCase())).map(f => (
                <button key={f.id} onClick={() => {
                  handleSwapFood(swapFood.week, swapFood.day, swapFood.food, f);
                  setSwapFood(null); setSwapSearch("");
                }} style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:24 }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:360 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:8 }}>Remove {confirmDelete.food.name}?</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>This removes it from {confirmDelete.day}'s plan. Your log history won't be affected.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex:1, background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:10, padding:"11px 0", fontWeight:700, color:C.slateDark, cursor:"pointer" }}>Cancel</button>
              <button onClick={confirmDeleteFood} style={{ flex:1, background:C.red, border:"none", borderRadius:10, padding:"11px 0", fontWeight:700, color:C.white, cursor:"pointer" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Library tab
function LibraryTab({ triedFoods, logs, onToggle, onLogFood }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const safeLogs = logs || [];
  const allergensDone = ALLERGEN_GROUPS.filter(g => { const gl = safeLogs.filter(l => g.foods.includes(l.foodId) && !l.reaction); return new Set(gl.map(l => l.date)).size >= 2; }).length;
  const allergensTotal = ALLERGEN_GROUPS.length;
  
  const sortedFoods = [...FOODS].sort((a, b) => a.order - b.order);
  
  const visible = sortedFoods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "tried") return triedFoods.includes(f.id);
    if (filter === "allergens") return f.allergen;
    if (filter === "notyet") return !triedFoods.includes(f.id);
    return true;
  });

  return (
    <div style={{ paddingBottom:90 }}>
      {/* Stats */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        {[
          { label:"Foods Tried", value:triedFoods.length, color:C.green },
          { label:"Allergens Cleared", value:allergensDone, color:C.gold },
          { label:"Remaining", value: FOODS.length - triedFoods.length, color:C.slate },
        ].map(s => (
          <div key={s.label} style={{ flex:1, background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:9, color:C.muted, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Allergen progress */}
      <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, fontWeight:700, color:C.slateDark }}>Allergen Progress</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.gold }}>{allergensDone}/{allergensTotal}</span>
        </div>
        <div style={{ background:C.slateMid, borderRadius:99, height:10, overflow:"hidden" }}>
          <div style={{ width:`${(allergensDone/allergensTotal)*100}%`, background:`linear-gradient(90deg, ${C.gold}, ${C.green})`, height:"100%", borderRadius:99, transition:"width 0.4s" }} />
        </div>
      </div>

      {/* Search */}
      <input 
        type="text" 
        placeholder="Search foods..." 
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }}
      />

      {/* Filters */}
      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        {[["all","All"],["tried","Tried"],["allergens","Allergens"],["notyet","Not Yet"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ flex:1, background: filter===v ? C.slateDark : C.white, border:`1px solid ${filter===v ? C.slateDark : C.border}`, borderRadius:8, padding:"6px 4px", fontSize:11, fontWeight:700, color: filter===v ? C.white : C.slate, cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {visible.map(f => {
          const tried = triedFoods.includes(f.id);
          return (
            <div key={f.id} style={{ background:C.white, borderRadius:12, border:`2px solid ${tried ? C.greenMid : f.allergen ? C.goldMid : C.border}`, padding:"12px 10px", position:"relative" }}>
              {f.allergen && <div style={{ position:"absolute", top:8, right:8, fontSize:10, background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:6, padding:"1px 6px", fontWeight:700, color:C.gold }}>⚠</div>}
              {tried && <div style={{ position:"absolute", top:8, left:8, fontSize:10, background:C.greenLight, border:`1px solid ${C.greenMid}`, borderRadius:6, padding:"1px 6px", fontWeight:700, color:C.green }}>✓</div>}
              <div style={{ textAlign:"center", fontSize:40, margin:"8px 0 6px" }}>{f.emoji}</div>
              <div style={{ fontWeight:700, fontSize:13, color:C.charcoal, textAlign:"center", marginBottom:8 }}>{f.name}</div>
              <button onClick={() => onLogFood(f)} style={{ width:"100%", background: tried ? C.greenLight : C.slateLight, border:`1px solid ${tried ? C.greenMid : C.slateMid}`, borderRadius:8, padding:"6px 0", fontSize:11, fontWeight:700, color: tried ? C.green : C.slate, cursor:"pointer" }}>
                {tried ? "Tried" : "Log First Try"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Allergens tab — simplified to 8 main groups
function AllergensTab({ triedFoods, logs, onToggle, onLogFood, onDeleteLog }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewLogGroup, setViewLogGroup] = useState(null);

  const getGroupStatus = (group) => {
    const groupFoodIds = group.foods;
    const allGroupLogs = logs.filter(l => groupFoodIds.includes(l.foodId));
    const reactionLogs = allGroupLogs.filter(l => l.reaction);
    const hasReaction = reactionLogs.length > 0;
    const nonReactionLogs = allGroupLogs.filter(l => !l.reaction);
    const distinctDates = new Set(nonReactionLogs.map(l => l.date)).size;
    // Reaction doesn't permanently block — show Possible Allergy only if no subsequent clearance
    if (hasReaction && distinctDates < 2) return { label:"Possible Reaction", color:C.red, bg:C.redLight, border:C.redMid };
    if (distinctDates >= 2) return { label:"Cleared", color:C.green, bg:C.greenLight, border:C.greenMid };
    if (allGroupLogs.length >= 1) return { label:"In Progress", color:C.gold, bg:C.goldLight, border:C.goldMid };
    return { label:"Not Started", color:C.slate, bg:C.slateLight, border:C.slateMid };
  };

  const clearedCount = ALLERGEN_GROUPS.filter(g => getGroupStatus(g).label === "Cleared").length;
  const parseDate = (d) => { const [y,m,dy] = d.split('-').map(Number); return new Date(y, m-1, dy); };
  const formatDate = (d) => { try { const [y,m,dy] = d.split('-').map(Number); return new Date(y,m-1,dy).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); } catch(e){ return d; }};

  return (
    <div style={{ paddingBottom:90 }}>
      <div style={{ background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:14, padding:"12px 14px", marginBottom:16 }}>
        <div style={{ fontWeight:800, fontSize:13, color:"#7A5C00", marginBottom:4 }}>Early Allergen Protocol</div>
        <div style={{ fontSize:12, color:"#7A5C00", lineHeight:1.5 }}>Introduce all top allergen groups early. Once cleared (2+ exposures, no reaction), maintain ≥2× per week.</div>
      </div>

      {/* Progress */}
      <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, fontWeight:700, color:C.slateDark }}>Groups Cleared</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.gold }}>{clearedCount}/{ALLERGEN_GROUPS.length}</span>
        </div>
        <div style={{ background:C.slateMid, borderRadius:99, height:10, overflow:"hidden" }}>
          <div style={{ width:`${(clearedCount/ALLERGEN_GROUPS.length)*100}%`, background:`linear-gradient(90deg, ${C.gold}, ${C.green})`, height:"100%", borderRadius:99, transition:"width 0.4s" }} />
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {ALLERGEN_GROUPS.map(group => {
          const status = getGroupStatus(group);
          const groupLogs = logs.filter(l => group.foods.includes(l.foodId));
          const sortedGroupLogs = [...groupLogs].sort((a, b) => parseDate(b.date) - parseDate(a.date));
          const lastLog = sortedGroupLogs.length > 0 ? sortedGroupLogs[0] : null;
          const firstFood = FOODS.find(f => group.foods.includes(f.id));

          return (
            <div key={group.id} onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
              style={{ background:C.white, borderRadius:14, border:`2px solid ${status.border}`, padding:"12px 14px", cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:36, lineHeight:1 }}>{group.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ fontWeight:800, fontSize:15, color:C.charcoal }}>{group.name}</span>
                    <span style={{ background:status.bg, border:`1px solid ${status.border}`, borderRadius:6, fontSize:10, fontWeight:700, color:status.color, padding:"1px 7px" }}>{status.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>Recommended: {group.timeline}</div>
                  <div style={{ fontSize:11, color:C.slate, fontWeight:600 }}>
                    {groupLogs.length === 0 ? "Not tried yet" :
                     `${groupLogs.length} exposure${groupLogs.length !== 1 ? 's' : ''}${lastLog ? ` · last ${formatDate(lastLog.date)}` : ''}`}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"row", gap:6, flexShrink:0 }}>
                  {groupLogs.length > 0 && (
                    <button onClick={e => { e.stopPropagation(); setViewLogGroup(group); }}
                      style={{ background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:700, color:C.slate, cursor:"pointer" }}>
                      Log History
                    </button>
                  )}
                  {firstFood && (
                    <button onClick={e => { e.stopPropagation(); onLogFood(firstFood); }}
                      style={{ background:C.blue, border:"none", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, color:C.white, cursor:"pointer" }}>
                      Log
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded: show individual foods in group */}
              {selectedGroup?.id === group.id && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:8 }}>FOODS IN THIS GROUP</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {group.foods.map(fid => {
                      const food = FOODS.find(f => f.id === fid);
                      if (!food) return null;
                      const tried = triedFoods.includes(fid);
                      return (
                        <button key={fid} onClick={e => { e.stopPropagation(); onLogFood(food); }}
                          style={{ background: tried ? C.greenLight : C.slateLight, border:`1px solid ${tried ? C.greenMid : C.slateMid}`, borderRadius:8, padding:"5px 10px", fontSize:12, fontWeight:600, color: tried ? C.green : C.charcoal, cursor:"pointer" }}>
                          {food.emoji} {food.name} {tried ? "✓" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View Log Modal */}
      {viewLogGroup && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => setViewLogGroup(null)}>
          <div style={{ background:C.white, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"75vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontWeight:800, fontSize:17, color:C.charcoal }}>{viewLogGroup.emoji} {viewLogGroup.name} Log</div>
              <button onClick={() => setViewLogGroup(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            {(() => {
              const hasReaction = logs.some(l => viewLogGroup.foods.includes(l.foodId) && l.reaction);
              const cleanLogs = logs.filter(l => viewLogGroup.foods.includes(l.foodId) && !l.reaction);
              const distinctClean = new Set(cleanLogs.map(l => l.date)).size;
              if (hasReaction && distinctClean < 2) return (
                <div style={{ background:C.redLight, border:`1px solid ${C.redMid}`, borderRadius:10, padding:"10px 12px", marginBottom:12 }}>
                  <div style={{ fontWeight:700, color:C.red, fontSize:12, marginBottom:3 }}>Possible reaction recorded</div>
                  <div style={{ fontSize:11, color:C.slateDark, lineHeight:1.5 }}>Consult your pediatrician before reintroducing. Once cleared by your doctor, continue logging exposures here — status updates automatically after 2 clean exposures on separate days.</div>
                </div>
              );
              return null;
            })()}
            {(() => {
              const gLogs = logs.map((l,i) => ({...l, _idx:i})).filter(l => viewLogGroup.foods.includes(l.foodId));
              const sorted = [...gLogs].sort((a,b) => parseDate(b.date) - parseDate(a.date));
              return sorted.length === 0 ? (
                <div style={{ color:C.muted, fontSize:13, padding:"16px 0" }}>No log entries yet.</div>
              ) : (
                <>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{sorted.length} exposure{sorted.length !== 1 ? 's' : ''} · last {formatDate(sorted[0].date)}</div>
                  {sorted.map((log, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", background: log.reaction ? C.redLight : C.slateLight, border:`1px solid ${log.reaction ? C.redMid : C.slateMid}`, borderRadius:10, marginBottom:8 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                          <span style={{ fontWeight:700, fontSize:13, color:C.charcoal }}>{formatDate(log.date)}</span>
                          <span style={{ fontSize:11, color:C.muted }}>{log.foodName}</span>
                          {log.reaction && <span style={{ fontSize:10, fontWeight:700, color:C.red, background:C.redLight, border:`1px solid ${C.redMid}`, borderRadius:4, padding:"1px 5px" }}>⚠ Reaction</span>}
                        </div>
                        {log.note && <div style={{ fontSize:12, color:C.muted }}>{log.note}</div>}
                      </div>
                      <button onClick={() => { onDeleteLog(log._idx); }} style={{ background:"transparent", border:`1px solid ${C.redMid}`, borderRadius:6, padding:"4px 8px", fontSize:13, color:C.red, cursor:"pointer", flexShrink:0 }}>🗑️</button>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// Log modal
function LogModal({ food, onLog, onClose }) {
  const [reaction, setReaction] = useState(false);
  const [note, setNote] = useState("");
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(todayString);
  
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={onClose}>
      <div style={{ background:C.white, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:C.charcoal, marginBottom:4 }}>Log {food.emoji} {food.name}</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>How did it go?</div>
        
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>Date Tried</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }}
          />
        </div>
        
        <label style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }}>
          <input type="checkbox" checked={reaction} onChange={e => setReaction(e.target.checked)} style={{ width:18, height:18 }} />
          <span style={{ fontWeight:600, color: reaction ? C.red : C.slate }}>Potential allergic reaction observed</span>
        </label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Notes (optional)…" rows={2}
          style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:13, fontFamily:"inherit", resize:"none", boxSizing:"border-box", outline:"none" }} />
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button onClick={onClose} style={{ flex:1, background:C.slateLight, border:`1px solid ${C.slateMid}`, borderRadius:10, padding:"12px 0", fontWeight:700, cursor:"pointer", color:C.slateDark }}>Cancel</button>
          <button onClick={() => onLog(food, reaction, note, date)} style={{ flex:2, background:C.blue, border:"none", borderRadius:10, padding:"12px 0", fontWeight:700, color:C.white, cursor:"pointer", fontSize:14 }}>Save Log</button>
        </div>
      </div>
    </div>
  );
}


// Undo Tried Modal
function UndoTriedModal({ food, lastLog, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:300 }} onClick={onClose}>
      <div style={{ background:"#FFFFFF", borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight:800, fontSize:18, color:"#1E2A38", marginBottom:6 }}>Undo {food.emoji} {food.name}?</div>
        <div style={{ fontSize:13, color:"#6B7280", marginBottom:20, lineHeight:1.5 }}>
          {lastLog
            ? `Last logged on ${lastLog.date}. Would you like to remove that log entry too?`
            : "This food has no log entries. It will just be unmarked as tried."}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {lastLog && (
            <button onClick={() => onConfirm('last')} style={{ background:"#FDECEA", border:"1px solid #FADBD8", borderRadius:10, padding:"12px 16px", fontWeight:700, color:"#D63031", cursor:"pointer", fontSize:13, textAlign:"left" }}>
              ✕ Undo and remove last log entry on {lastLog.date}
            </button>
          )}
          <button onClick={() => onConfirm('all')} style={{ background:"#FDECEA", border:"1px solid #FADBD8", borderRadius:10, padding:"12px 16px", fontWeight:700, color:"#D63031", cursor:"pointer", fontSize:13, textAlign:"left" }}>
            ✕ Undo all log entries
          </button>
          <button onClick={onClose} style={{ background:"transparent", border:"none", padding:"8px 0", fontWeight:600, color:"#6B7280", cursor:"pointer", fontSize:13 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Setup screen shown when Supabase credentials haven't been filled in yet
function SetupScreen() {
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", padding:32, boxSizing:"border-box" }}>
      <div style={{ fontSize:36, marginBottom:16 }}>🥣</div>
      <div style={{ fontWeight:800, fontSize:20, color:C.charcoal, marginBottom:8 }}>One setup step needed</div>
      <div style={{ fontSize:14, color:C.muted, lineHeight:1.6, marginBottom:24 }}>
        To sync data between you and your husband's phones, you need to connect a free Supabase database. This takes about 15 minutes and only needs to be done once.
      </div>
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:20 }}>
        <div style={{ fontWeight:700, fontSize:13, color:C.slateDark, marginBottom:12 }}>In App.jsx, find these lines and fill in your credentials:</div>
        <div style={{ background:C.slateLight, borderRadius:8, padding:12, fontFamily:"monospace", fontSize:12, color:C.charcoal, lineHeight:1.7 }}>
          <div>const SUPABASE_URL = "YOUR_SUPABASE_URL";</div>
          <div>const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";</div>
        </div>
      </div>
      <div style={{ background:C.goldLight, border:`1px solid ${C.goldMid}`, borderRadius:12, padding:16, fontSize:13, color:"#7A5C00", lineHeight:1.6 }}>
        Follow the step-by-step setup guide (supabase-setup-guide.md) for full instructions on creating your free Supabase project and getting these values.
      </div>
    </div>
  );
}

// Main app
export default function ShannonsSolids() {
  if (SUPABASE_URL === "YOUR_SUPABASE_URL" || SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
    return <SetupScreen />;
  }
  return <AppInner />;
}

function AppInner() {
  const [tab, setTab] = useState("overview");
  const [triedFoods, setTriedFoods] = useState(["peanut"]);
  const [logs, setLogs] = useState([
    { foodId:"peanut", foodName:"Peanut", reaction:false, note:"First try! No reaction.", date:"2026-02-10" },
    { foodId:"peanut", foodName:"Peanut", reaction:false, note:"Second exposure going well.", date:"2026-02-12" }
  ]);
  const [settings, setSettings] = useState({ babyName: "Shannon", babyBirthday: "2025-09-15", startDate: "2026-02-10" });
  const [weekPlan, setWeekPlan] = useState(() => buildDefaultPlan(["peanut"], 1));
  const [nextWeekPlan, setNextWeekPlan] = useState(() => buildDefaultPlan(["peanut"], 2));
  const [logTarget, setLogTarget] = useState(null);
  const [quickLogSearch, setQuickLogSearch] = useState("");
  const [undoTarget, setUndoTarget] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentWeek = getCurrentWeek(settings.startDate);
  const ageMonths = getAgeInMonths(settings.babyBirthday);

  const [saveStatus, setSaveStatus] = useState("saved"); // "saved" | "saving"

  useEffect(() => {
    loadData().then(data => {
      setTriedFoods(Array.isArray(data.triedFoods) ? data.triedFoods : []);
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setWeekPlan(data.weekPlan && typeof data.weekPlan === 'object' ? data.weekPlan : buildDefaultPlan([], 1));
      setNextWeekPlan(data.nextWeekPlan && typeof data.nextWeekPlan === 'object' ? data.nextWeekPlan : buildDefaultPlan([], 2));
      setSettings(data.settings && data.settings.babyName ? data.settings : DEFAULT_DATA.settings);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!loading) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return; // skip save on the load transition
      }
      setSaveStatus("saving");
      saveData(triedFoods, logs, weekPlan, nextWeekPlan, settings, () => setSaveStatus("saved"));
    }
  }, [triedFoods, logs, weekPlan, nextWeekPlan, settings, loading]);

  const handleToggle = id => setTriedFoods(prev => prev.includes(id) ? prev.filter(x => x!==id) : [...prev, id]);
  const handleUnmarkTried = id => setTriedFoods(prev => prev.filter(x => x!==id));
  const handleCreatePlan = () => setWeekPlan(buildDefaultPlan(triedFoods, currentWeek));
  const handleCreateNextWeekPlan = () => setNextWeekPlan(buildDefaultPlan(triedFoods, currentWeek + 1));

  const handleDeleteLog = (logIdx) => {
    const deletedLog = logs[logIdx];
    const newLogs = logs.filter((_, i) => i !== logIdx);
    setLogs(newLogs);
    // If no remaining logs for this food, unmark as tried
    if (deletedLog) {
      const remaining = newLogs.filter(l => l.foodId === deletedLog.foodId);
      if (remaining.length === 0) handleUnmarkTried(deletedLog.foodId);
    }
  };

  // "Mark as Tried" always opens the log modal so date + reaction are captured
  const handleMarkTried = (food) => {
    const f = typeof food === 'string' ? FOODS.find(x => x.id === food) : food;
    if (f) setLogTarget(f);
  };

  const handleLogFood = (food, reaction=false, note="", customDate=null) => {
    if (reaction === false && note === "" && !customDate) { setLogTarget(food); return; }
    // Always store as YYYY-MM-DD to avoid UTC/locale timezone bugs
    const today = new Date();
    const todayISO = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
    const logDate = customDate || todayISO;
    setLogs(prev => [...prev, { foodId:food.id, foodName:food.name, reaction, note, date: logDate }]);
    if (!reaction) setTriedFoods(prev => prev.includes(food.id) ? prev : [...prev, food.id]);
    setLogTarget(null);
  };

  // Tapping "✓ Tried" opens an undo prompt
  const handleUndoTried = (food) => {
    const foodLogs = logs.map((l, i) => ({...l, _idx: i})).filter(l => l.foodId === food.id);
    const sorted = [...foodLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastLog = sorted.length > 0 ? sorted[0] : null;
    setUndoTarget({ food, lastLog });
  };

  const handleConfirmUndo = (mode) => {
    if (!undoTarget) return;
    const { food, lastLog } = undoTarget;
    if (mode === 'last' && lastLog !== null) {
      const newLogs = logs.filter((_, i) => i !== lastLog._idx);
      setLogs(newLogs);
      const remaining = newLogs.filter(l => l.foodId === food.id);
      if (remaining.length === 0) handleUnmarkTried(food.id);
    } else if (mode === 'all') {
      setLogs(prev => prev.filter(l => l.foodId !== food.id));
      handleUnmarkTried(food.id);
    }
    setUndoTarget(null);
  };

  const tabs = [
    { id:"overview", label:"Overview", icon:"🏠" },
    { id:"weekly",   label:"Menu",     icon:"📅" },
    { id:"library",  label:"Library",  icon:"📚" },
    { id:"allergens",label:"Allergens",icon:"⚠️" },
  ];

  if (loading) {
    return (
      <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🥣</div>
          <div style={{ fontSize:14, color:C.muted, fontWeight:600 }}>Loading {settings.babyName}'s data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", position:"relative" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.header} 0%, ${C.headerDark} 100%)`, padding:"16px 18px 14px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:32 }}>🥣</div>
            <div>
              <div style={{ color:C.white, fontSize:18, fontWeight:800, letterSpacing:"-0.3px" }}>{settings.babyName}'s Solids</div>
              <div style={{ color:"#90A8C0", fontSize:11 }}>Week {currentWeek} · {ageMonths} months old</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <div style={{ fontSize:10, fontWeight:600, color: saveStatus === "saving" ? "#90A8C0" : "#5CB88A" }}>
              {saveStatus === "saving" ? "Syncing..." : "Synced"}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setLogTarget("quick")} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, padding:"7px 13px", color:C.white, fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Log</button>
              <button onClick={() => setShowSettings(true)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, padding:"7px 10px", color:C.white, fontSize:16, cursor:"pointer" }}>⚙️</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"16px 14px 0" }}>
        {tab==="overview"  && <OverviewTab  triedFoods={triedFoods} logs={logs} weekPlan={weekPlan} nextWeekPlan={nextWeekPlan} onLogFood={handleLogFood} onCreatePlan={handleCreatePlan} onMarkTried={handleMarkTried} onUnmarkTried={handleUnmarkTried} onUndoTried={handleUndoTried} setWeekPlan={setWeekPlan} ageMonths={ageMonths} startDate={settings.startDate} currentWeek={currentWeek} />}
        {tab==="weekly"    && <WeeklyTab    triedFoods={triedFoods} weekPlan={weekPlan} setWeekPlan={setWeekPlan} nextWeekPlan={nextWeekPlan} setNextWeekPlan={setNextWeekPlan} onLogFood={handleLogFood} onMarkTried={handleMarkTried} onUnmarkTried={handleUnmarkTried} onUndoTried={handleUndoTried} onCreatePlan={handleCreatePlan} onCreateNextWeekPlan={handleCreateNextWeekPlan} ageMonths={ageMonths} currentWeek={currentWeek} />}
        {tab==="library"   && <LibraryTab   triedFoods={triedFoods} logs={logs} onToggle={handleToggle} onLogFood={handleLogFood} />}
        {tab==="allergens" && <AllergensTab triedFoods={triedFoods} logs={logs} onToggle={handleToggle} onLogFood={handleLogFood} onDeleteLog={handleDeleteLog} />}
      </div>

      {/* Modals */}
      {logTarget && logTarget !== "quick" && <LogModal food={logTarget} onLog={handleLogFood} onClose={() => setLogTarget(null)} />}
      {logTarget === "quick" && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200, paddingTop:"10vh" }} onClick={() => { setLogTarget(null); setQuickLogSearch(""); }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, width:"100%", maxWidth:430, maxHeight:"55vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:16, color:C.charcoal, marginBottom:12 }}>Log a Food</div>
            <input type="text" placeholder="Search foods..." value={quickLogSearch} onChange={e => setQuickLogSearch(e.target.value)} autoFocus style={{ width:"100%", borderRadius:10, border:`1px solid ${C.border}`, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {FOODS.filter(f => f.name.toLowerCase().includes(quickLogSearch.toLowerCase())).map(f => (
                <button key={f.id} onClick={() => { setQuickLogSearch(""); setLogTarget(f); }}
                  style={{ background: triedFoods.includes(f.id) ? C.greenLight : f.allergen ? C.goldLight : C.slateLight, border:`1px solid ${triedFoods.includes(f.id) ? C.greenMid : f.allergen ? C.goldMid : C.slateMid}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", color:C.charcoal }}>
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
      {undoTarget && <UndoTriedModal food={undoTarget.food} lastLog={undoTarget.lastLog} onConfirm={handleConfirmUndo} onClose={() => setUndoTarget(null)} />}

      {/* Bottom nav */}
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, boxShadow:"0 -2px 12px rgba(0,0,0,0.08)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"10px 4px 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, color: tab===t.id ? C.header : C.muted, fontSize:10, fontWeight: tab===t.id ? 800 : 500 }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}