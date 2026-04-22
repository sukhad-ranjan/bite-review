import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "./components/EmptyState";
import StarRating from "./components/StarRating";
import "./BiteReview.css";

const CANTEENS = [
  {
    id: "snackers",
    name: "Snackers",
    emoji: "🥪",
    label: "SN",
    tagline: "Fast comfort food with crunchy classics and bold sauces.",
    accent: "#ff7a18",
    highlight: "Most loved for handheld snacks between classes.",
  },
  {
    id: "nescafe",
    name: "Nescafe",
    emoji: "☕",
    label: "NC",
    tagline: "Coffee bar energy with warm bakes and quick refuel picks.",
    accent: "#9a5b32",
    highlight: "Students keep coming back for cold coffee and muffins.",
  },
  {
    id: "yadav",
    name: "Yadav Canteen",
    emoji: "🍛",
    label: "YC",
    tagline: "Home-style plates that feel steady, filling, and familiar.",
    accent: "#2f8f63",
    highlight: "Best stop for full meals that feel closest to home.",
  },
  {
    id: "night",
    name: "Night Canteen",
    emoji: "🌙",
    label: "NT",
    tagline: "Late-hour favorites for group hangs, deadlines, and cravings.",
    accent: "#5c6cff",
    highlight: "The after-dark hero for long study sessions.",
  },
  {
    id: "campus",
    name: "Campus Cafe",
    emoji: "🥗",
    label: "CC",
    tagline: "Fresh wraps, lighter bowls, and polished all-day cafe vibes.",
    accent: "#d48a23",
    highlight: "Known for balanced meals and quick, fresh drinks.",
  },
];

const INITIAL_MENUS = {
  snackers: [
    { id: 1, name: "Boiled Egg (2 Pcs)", price: "25.00", ratings: [], comments: [] },
    { id: 2, name: "Tawa Aloo Paratha", price: "30.00", ratings: [], comments: [] },
    { id: 3, name: "Tandoori Aloo Paratha", price: "30.00", ratings: [], comments: [] },
    { id: 4, name: "Tawa Onion Paratha", price: "30.00", ratings: [], comments: [] },
    { id: 5, name: "Tandoori Onion Paratha", price: "30.00", ratings: [], comments: [] },
    { id: 6, name: "Tawa Gobhi Paratha", price: "40.00", ratings: [], comments: [] },
    { id: 7, name: "Tandoori Gobhi Paratha", price: "40.00", ratings: [], comments: [] },
    { id: 8, name: "Tawa Paneer Paratha", price: "50.00", ratings: [], comments: [] },
    { id: 9, name: "Tandoori Paneer Paratha", price: "50.00", ratings: [], comments: [] },
    { id: 10, name: "Aloo Puri", price: "50.00", ratings: [], comments: [] },
    { id: 11, name: "Bread Omelette", price: "50.00", ratings: [], comments: [] },
    { id: 12, name: "Amul Butter", price: "10.00", ratings: [], comments: [] },
    { id: 13, name: "Vada (2 pcs)", price: "50.00", ratings: [], comments: [] },
    { id: 14, name: "Idli (4 pcs)", price: "70.00", ratings: [], comments: [] },
    { id: 15, name: "Sambar Rice", price: "60.00", ratings: [], comments: [] },
    { id: 16, name: "Plain Dosa", price: "60.00", ratings: [], comments: [] },
    { id: 17, name: "Paper Dosa", price: "80.00", ratings: [], comments: [] },
    { id: 18, name: "Masala Dosa", price: "90.00", ratings: [], comments: [] },
    { id: 19, name: "Butter Masala Dosa", price: "100.00", ratings: [], comments: [] },
    { id: 20, name: "Onion Uttapam", price: "100.00", ratings: [], comments: [] },
    { id: 21, name: "Mix Veg Uttapam", price: "110.00", ratings: [], comments: [] },
    { id: 22, name: "Paneer Dosa", price: "120.00", ratings: [], comments: [] },
    { id: 23, name: "Butter Paneer Dosa", price: "130.00", ratings: [], comments: [] },
    { id: 24, name: "Dahi Vada", price: "70.00", ratings: [], comments: [] },
    { id: 25, name: "Regular Burger", price: "50.00", ratings: [], comments: [] },
    { id: 26, name: "Regular Egg Burger", price: "60.00", ratings: [], comments: [] },
    { id: 27, name: "Cheese Burger", price: "80.00", ratings: [], comments: [] },
    { id: 28, name: "Paneer Burger", price: "90.00", ratings: [], comments: [] },
    { id: 29, name: "Chicken Burger", price: "90.00", ratings: [], comments: [] },
    { id: 30, name: "Maharaja Burger", price: "100.00", ratings: [], comments: [] },
    { id: 31, name: "Maharaja Chicken Burger", price: "140.00", ratings: [], comments: [] },
    { id: 32, name: "Chicken Egg Burger", price: "110.00", ratings: [], comments: [] },
    { id: 33, name: "Cold Sandwich", price: "30.00", ratings: [], comments: [] },
    { id: 34, name: "Veg Grill Sandwich", price: "80.00", ratings: [], comments: [] },
    { id: 35, name: "Paneer Makhani Sandwich", price: "90.00", ratings: [], comments: [] },
    { id: 36, name: "Pasta Sandwich", price: "100.00", ratings: [], comments: [] },
    { id: 37, name: "Veg Manchow Soup", price: "50.00", ratings: [], comments: [] },
    { id: 38, name: "Non-Veg Manchow Soup", price: "60.00", ratings: [], comments: [] },
    { id: 39, name: "Steam Momos (8 pc)", price: "60.00", ratings: [], comments: [] },
    { id: 40, name: "Fried Momos (8 pc)", price: "80.00", ratings: [], comments: [] },
    { id: 41, name: "Veg Spring Roll (8 pc)", price: "70.00", ratings: [], comments: [] },
    { id: 42, name: "Crispy Spring Roll (8 pc)", price: "90.00", ratings: [], comments: [] },
    { id: 43, name: "Honey Chilli Potato", price: "90.00", ratings: [], comments: [] },
    { id: 44, name: "Mushroom Chilli", price: "100.00", ratings: [], comments: [] },
    { id: 45, name: "Veg Manchurian (8 pc)", price: "90.00", ratings: [], comments: [] },
    { id: 46, name: "Chilli Paneer (8 pc)", price: "120.00", ratings: [], comments: [] },
    { id: 47, name: "Chilli Chicken", price: "250.00", ratings: [], comments: [] },
    { id: 48, name: "Steam Chicken (250gm)", price: "120.00", ratings: [], comments: [] },
    { id: 49, name: "Salted Fries", price: "70.00", ratings: [], comments: [] },
    { id: 50, name: "Masala Fries", price: "80.00", ratings: [], comments: [] },
    { id: 51, name: "Peri Peri Fries", price: "90.00", ratings: [], comments: [] },
    { id: 52, name: "Cheese Fries", price: "100.00", ratings: [], comments: [] },
    { id: 53, name: "Alfredo Pasta", price: "80.00", ratings: [], comments: [] },
    { id: 54, name: "Arrabiata Pasta", price: "80.00", ratings: [], comments: [] },
    { id: 55, name: "Cheese Margherita Pizza", price: "130.00", ratings: [], comments: [] },
    { id: 56, name: "Garden Green Pizza", price: "160.00", ratings: [], comments: [] },
    { id: 57, name: "Spicy Affair Pizza", price: "160.00", ratings: [], comments: [] },
    { id: 58, name: "Farmhouse Pizza", price: "180.00", ratings: [], comments: [] },
    { id: 59, name: "Extra Cheese Burst", price: "60.00", ratings: [], comments: [] },
    { id: 60, name: "Plain Garlic Bread", price: "80.00", ratings: [], comments: [] },
    { id: 61, name: "Stuffed Garlic Bread", price: "130.00", ratings: [], comments: [] },
    { id: 62, name: "Aloo Jeera", price: "60.00", ratings: [], comments: [] },
    { id: 63, name: "Yellow Dal Tadka", price: "80.00", ratings: [], comments: [] },
    { id: 64, name: "Dal Makhni", price: "80.00", ratings: [], comments: [] },
    { id: 65, name: "Rajma", price: "80.00", ratings: [], comments: [] },
    { id: 66, name: "Aloo Gobhi", price: "80.00", ratings: [], comments: [] },
    { id: 67, name: "Chana Masala", price: "90.00", ratings: [], comments: [] },
    { id: 68, name: "Bhindi", price: "90.00", ratings: [], comments: [] },
    { id: 69, name: "Mushroom Mutter", price: "90.00", ratings: [], comments: [] },
    { id: 70, name: "Palak Kofta", price: "90.00", ratings: [], comments: [] },
    { id: 71, name: "Mix Veg", price: "100.00", ratings: [], comments: [] },
    { id: 72, name: "Palak Paneer", price: "100.00", ratings: [], comments: [] },
    { id: 73, name: "Shahi Paneer", price: "100.00", ratings: [], comments: [] },
    { id: 74, name: "Kadai Paneer", price: "100.00", ratings: [], comments: [] },
    { id: 75, name: "Paneer Bhurji", price: "120.00", ratings: [], comments: [] },
    { id: 76, name: "Paneer Tikka Butter Masala", price: "170.00", ratings: [], comments: [] },
    { id: 77, name: "Chicken Curry Thali", price: "130.00", ratings: [], comments: [] },
    { id: 78, name: "Chicken Curry Portion", price: "240.00", ratings: [], comments: [] },
    { id: 79, name: "Lemon Chicken Thali", price: "140.00", ratings: [], comments: [] },
    { id: 80, name: "Lemon Chicken Portion", price: "240.00", ratings: [], comments: [] },
    { id: 81, name: "Chicken Do Pyaza Thali", price: "140.00", ratings: [], comments: [] },
    { id: 82, name: "Chicken Do Pyaza Portion", price: "240.00", ratings: [], comments: [] },
    { id: 83, name: "Butter Chicken Thali", price: "130.00", ratings: [], comments: [] },
    { id: 84, name: "Butter Chicken Portion", price: "240.00", ratings: [], comments: [] },
    { id: 85, name: "Kadai Chicken Thali", price: "140.00", ratings: [], comments: [] },
    { id: 86, name: "Kadai Chicken Portion", price: "240.00", ratings: [], comments: [] },
    { id: 87, name: "Kali Mirch Chicken Thali", price: "140.00", ratings: [], comments: [] },
    { id: 88, name: "Kali Mirch Chicken Portion", price: "240.00", ratings: [], comments: [] },
    { id: 89, name: "Chicken Rara Portion", price: "300.00", ratings: [], comments: [] },
    { id: 90, name: "Butter Chicken Boneless Portion", price: "350.00", ratings: [], comments: [] },
    { id: 91, name: "Mutton Curry Portion", price: "350.00", ratings: [], comments: [] },
    { id: 92, name: "Mutton Rogan Josh Portion", price: "350.00", ratings: [], comments: [] },
    { id: 93, name: "Normal Thali", price: "70.00", ratings: [], comments: [] },
    { id: 94, name: "Paneer Thali", price: "70.00", ratings: [], comments: [] },
    { id: 95, name: "Rice Thali", price: "80.00", ratings: [], comments: [] },
    { id: 96, name: "Medium Thali", price: "90.00", ratings: [], comments: [] },
    { id: 97, name: "Snackers Special Thali", price: "120.00", ratings: [], comments: [] },
    { id: 98, name: "Tandoori Roti", price: "10.00", ratings: [], comments: [] },
    { id: 99, name: "Missi Roti", price: "25.00", ratings: [], comments: [] },
    { id: 100, name: "Lachedar Paratha", price: "25.00", ratings: [], comments: [] },
    { id: 101, name: "Butter Naan", price: "25.00", ratings: [], comments: [] },
    { id: 102, name: "Garlic Naan", price: "30.00", ratings: [], comments: [] },
    { id: 103, name: "Amritsari Naan with Chana", price: "40.00 (Single Pc) / 80.00 (Single P)", ratings: [], comments: [] },
    { id: 104, name: "Onion Naan with Chana", price: "40.00 (Single Pc) / 80.00 (Single P)", ratings: [], comments: [] },
    { id: 105, name: "Paneer Naan with Chana", price: "60.00", ratings: [], comments: [] },
    { id: 106, name: "Plain Rice", price: "50.00", ratings: [], comments: [] },
    { id: 107, name: "Veg Biryani", price: "100.00", ratings: [], comments: [] },
    { id: 108, name: "Chicken Biryani", price: "220.00", ratings: [], comments: [] },
  ],
  nescafe: [
    { id: 1, name: "Affogato", price: "80/-", ratings: [], comments: [] },
    { id: 2, name: "Aloo Tikki Sub", price: "90/-", ratings: [], comments: [] },
    { id: 3, name: "Aloo Tikki Wrap", price: "70/-", ratings: [], comments: [] },
    { id: 4, name: "Americano", price: "Reg 50 / Lar 70", ratings: [], comments: [] },
    { id: 5, name: "Banana Caramel Krusher", price: "90/-", ratings: [], comments: [] },
    { id: 6, name: "Banoffee Krusher", price: "100/-", ratings: [], comments: [] },
    { id: 7, name: "Beetroot Falafel Wrap", price: "100/-", ratings: [], comments: [] },
    { id: 8, name: "Belgian Chocolate Krusher", price: "100/-", ratings: [], comments: [] },
    { id: 9, name: "Biscoff Cold Coffee", price: "120/-", ratings: [], comments: [] },
    { id: 10, name: "Blue Curacao Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 11, name: "Brownie Krusher", price: "110/-", ratings: [], comments: [] },
    { id: 12, name: "Butter Garlic Maggi", price: "65/-", ratings: [], comments: [] },
    { id: 13, name: "Cappuccino", price: "Reg 50 / Lar 70", ratings: [], comments: [] },
    { id: 14, name: "Cafe Latte", price: "Reg 50 / Lar 70", ratings: [], comments: [] },
    { id: 15, name: "Cafe Mocha", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 16, name: "Caramel Cappuccino", price: "Reg 60 / Lar 85", ratings: [], comments: [] },
    { id: 17, name: "Caramel Frappe", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 18, name: "Cheese Oregano Maggi", price: "65/-", ratings: [], comments: [] },
    { id: 19, name: "Cheesy Fries", price: "100/-", ratings: [], comments: [] },
    { id: 20, name: "Chipotle Paneer Sandwich (With Fries)", price: "130/-", ratings: [], comments: [] },
    { id: 21, name: "Chocolate Frappe", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 22, name: "Chocolate Krusher", price: "80/-", ratings: [], comments: [] },
    { id: 23, name: "Classic Chinese Maggi", price: "45/-", ratings: [], comments: [] },
    { id: 24, name: "Cold Chocolate", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 25, name: "Cold Coffee", price: "80/-", ratings: [], comments: [] },
    { id: 26, name: "Cold Coffee with Ice Cream", price: "90/-", ratings: [], comments: [] },
    { id: 27, name: "Coffee", price: "Reg 35 / Lar 55", ratings: [], comments: [] },
    { id: 28, name: "Double Masala Cheese Maggi", price: "75/-", ratings: [], comments: [] },
    { id: 29, name: "Double Masala Maggi", price: "60/-", ratings: [], comments: [] },
    { id: 30, name: "Espresso", price: "Reg 35 / Lar 55", ratings: [], comments: [] },
    { id: 31, name: "Frappe", price: "Reg 60 / Lar 100", ratings: [], comments: [] },
    { id: 32, name: "Frappe Mocha", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 33, name: "Green Apple Ice Tea", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 34, name: "Green Apple Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 35, name: "Green Chilli Maggi", price: "50/-", ratings: [], comments: [] },
    { id: 36, name: "Hazelnut Cappuccino", price: "Reg 60 / Lar 85", ratings: [], comments: [] },
    { id: 37, name: "Hazelnut Frappe", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 38, name: "Hot Chocolate", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 39, name: "Iced Americano", price: "70/-", ratings: [], comments: [] },
    { id: 40, name: "Iced Cappuccino", price: "70/-", ratings: [], comments: [] },
    { id: 41, name: "Iced Latte", price: "80/-", ratings: [], comments: [] },
    { id: 42, name: "Iced Mango Matcha", price: "140/-", ratings: [], comments: [] },
    { id: 43, name: "Iced Mocha", price: "90/-", ratings: [], comments: [] },
    { id: 44, name: "Iced Strawberry Matcha", price: "140/-", ratings: [], comments: [] },
    { id: 45, name: "Irish Cappuccino", price: "Reg 60 / Lar 85", ratings: [], comments: [] },
    { id: 46, name: "Irish Frappe", price: "Reg 70 / Lar 110", ratings: [], comments: [] },
    { id: 47, name: "Kit-kat Krusher", price: "100/-", ratings: [], comments: [] },
    { id: 48, name: "Lemon Ice Tea", price: "Reg 45 / Lar 70", ratings: [], comments: [] },
    { id: 49, name: "Loaded Fries", price: "130/-", ratings: [], comments: [] },
    { id: 50, name: "Lotus Biscoff Krusher", price: "140/-", ratings: [], comments: [] },
    { id: 51, name: "Mac-Paneer Burger", price: "100/-", ratings: [], comments: [] },
    { id: 52, name: "Maha Raja Burger", price: "100/-", ratings: [], comments: [] },
    { id: 53, name: "Makhani Gravy Maggi", price: "75/-", ratings: [], comments: [] },
    { id: 54, name: "Mango Alphanso Krusher", price: "90/-", ratings: [], comments: [] },
    { id: 55, name: "Masala Fries", price: "90/-", ratings: [], comments: [] },
    { id: 56, name: "Masala-AE-Magic Maggi", price: "45/-", ratings: [], comments: [] },
    { id: 57, name: "Mint Fries", price: "90/-", ratings: [], comments: [] },
    { id: 58, name: "Mix Sauce Pasta", price: "100/-", ratings: [], comments: [] },
    { id: 59, name: "Original Masala Maggi", price: "50/-", ratings: [], comments: [] },
    { id: 60, name: "Paneer Makhni Sandwich", price: "110/-", ratings: [], comments: [] },
    { id: 61, name: "Paneer Mint Sandwich (2 Piece)", price: "50/-", ratings: [], comments: [] },
    { id: 62, name: "Paneer Tikka Sub", price: "90/-", ratings: [], comments: [] },
    { id: 63, name: "Paneer Wrap", price: "85/-", ratings: [], comments: [] },
    { id: 64, name: "Passion Fruit Ice Tea", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 65, name: "Passion Fruit Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 66, name: "Peach Ice Tea", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 67, name: "Peach Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 68, name: "Peri Peri Cheese Maggi", price: "75/-", ratings: [], comments: [] },
    { id: 69, name: "Peri Peri Fries", price: "90/-", ratings: [], comments: [] },
    { id: 70, name: "Peri Peri Maggi", price: "60/-", ratings: [], comments: [] },
    { id: 71, name: "Red Sauce Pasta", price: "90/-", ratings: [], comments: [] },
    { id: 72, name: "Salted Fries", price: "90/-", ratings: [], comments: [] },
    { id: 73, name: "Schezwan Cheese Burger", price: "70/-", ratings: [], comments: [] },
    { id: 74, name: "Schezwan Cheese Maggi", price: "75/-", ratings: [], comments: [] },
    { id: 75, name: "Shillong Schezwan Maggi", price: "65/-", ratings: [], comments: [] },
    { id: 76, name: "Special Masala Maggi", price: "60/-", ratings: [], comments: [] },
    { id: 77, name: "Spicy Garlic Maggi", price: "65/-", ratings: [], comments: [] },
    { id: 78, name: "Strawberry Krusher", price: "90/-", ratings: [], comments: [] },
    { id: 79, name: "Strong Cappuccino", price: "Reg 60 / Lar 85", ratings: [], comments: [] },
    { id: 80, name: "Strong Cold Coffee", price: "100/-", ratings: [], comments: [] },
    { id: 81, name: "Tandoori Maggi", price: "65/-", ratings: [], comments: [] },
    { id: 82, name: "Ultimate Fries Bucket", price: "150/-", ratings: [], comments: [] },
    { id: 83, name: "Vanilla Matcha Latte", price: "120/-", ratings: [], comments: [] },
    { id: 84, name: "Vegetable Maggi", price: "60/-", ratings: [], comments: [] },
    { id: 85, name: "Veg Cheese Burger", price: "65/-", ratings: [], comments: [] },
    { id: 86, name: "Veg Cheese Sandwich", price: "90/-", ratings: [], comments: [] },
    { id: 87, name: "Virgin Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 88, name: "Watermelon Ice Tea", price: "Reg 55 / Lar 80", ratings: [], comments: [] },
    { id: 89, name: "Watermelon Mojito", price: "70/-", ratings: [], comments: [] },
    { id: 90, name: "White Sauce Pasta", price: "90/-", ratings: [], comments: [] },
  ],
  yadav: [
    { id: 1, name: "Aloo Paratha", price: "30/-", ratings: [], comments: [] },
    { id: 2, name: "Aloo Pyaj Paratha", price: "40/-", ratings: [], comments: [] },
    { id: 3, name: "Banana Shake", price: "30/-", ratings: [], comments: [] },
    { id: 4, name: "Bread Pakora (Pcs.)", price: "20/-", ratings: [], comments: [] },
    { id: 5, name: "Bread Roll (Pcs.)", price: "20/-", ratings: [], comments: [] },
    { id: 6, name: "Bun Samosa", price: "35/-", ratings: [], comments: [] },
    { id: 7, name: "Butter Maggi", price: "40/-", ratings: [], comments: [] },
    { id: 8, name: "Butter Scotch", price: "80/-", ratings: [], comments: [] },
    { id: 9, name: "Chaat Papri", price: "60/-", ratings: [], comments: [] },
    { id: 10, name: "Chana Rice (Full Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 11, name: "Chana Rice (Half Plate)", price: "40/-", ratings: [], comments: [] },
    { id: 12, name: "Chana Samosa (Full Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 13, name: "Chana Samosa (Half Plate)", price: "30/-", ratings: [], comments: [] },
    { id: 14, name: "Cheese Burger", price: "50/-", ratings: [], comments: [] },
    { id: 15, name: "Cheese Sandwich", price: "90/-", ratings: [], comments: [] },
    { id: 16, name: "Chhole Bhature (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 17, name: "Chhole Kulcha (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 18, name: "Coffee", price: "25/-", ratings: [], comments: [] },
    { id: 19, name: "Cold Coffee", price: "70/-", ratings: [], comments: [] },
    { id: 20, name: "Cold Drinks", price: "On Print Rate", ratings: [], comments: [] },
    { id: 21, name: "Corn Sandwich", price: "90/-", ratings: [], comments: [] },
    { id: 22, name: "Crunchi Momos (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 23, name: "Crunchi Spring Roll", price: "70/-", ratings: [], comments: [] },
    { id: 24, name: "Dahi Vada", price: "50/-", ratings: [], comments: [] },
    { id: 25, name: "Fried Rice (Plate)", price: "80/-", ratings: [], comments: [] },
    { id: 26, name: "Gobhi Paratha", price: "40/-", ratings: [], comments: [] },
    { id: 27, name: "Grill Sandwich", price: "70/-", ratings: [], comments: [] },
    { id: 28, name: "Hot Dog (Pcs.)", price: "20/-", ratings: [], comments: [] },
    { id: 29, name: "Hot Milk Glass", price: "35/-", ratings: [], comments: [] },
    { id: 30, name: "Juice", price: "On Print Rate", ratings: [], comments: [] },
    { id: 31, name: "Lassi Glass", price: "30/-", ratings: [], comments: [] },
    { id: 32, name: "Lemon (Shikanji)", price: "25/-", ratings: [], comments: [] },
    { id: 33, name: "Mango Shake", price: "40/-", ratings: [], comments: [] },
    { id: 34, name: "Manchurian (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 35, name: "Masala Dosa", price: "60/-", ratings: [], comments: [] },
    { id: 36, name: "Milk Tea", price: "20/-", ratings: [], comments: [] },
    { id: 37, name: "Mix Paratha", price: "40/-", ratings: [], comments: [] },
    { id: 38, name: "Momos (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 39, name: "Noodle Burger", price: "40/-", ratings: [], comments: [] },
    { id: 40, name: "Noodles (Full Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 41, name: "Noodles (Half Plate)", price: "40/-", ratings: [], comments: [] },
    { id: 42, name: "Onion Paratha", price: "40/-", ratings: [], comments: [] },
    { id: 43, name: "Paneer Dosa", price: "80/-", ratings: [], comments: [] },
    { id: 44, name: "Paneer Paratha", price: "60/-", ratings: [], comments: [] },
    { id: 45, name: "Paneer Pattie (Pcs.)", price: "30/-", ratings: [], comments: [] },
    { id: 46, name: "Paneer Wrap", price: "60/-", ratings: [], comments: [] },
    { id: 47, name: "Pattie (Pcs.)", price: "20/-", ratings: [], comments: [] },
    { id: 48, name: "Pav Bhaji", price: "50/-", ratings: [], comments: [] },
    { id: 49, name: "Peri Peri French Fries (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 50, name: "Plain Maggi", price: "30/-", ratings: [], comments: [] },
    { id: 51, name: "Red Pasta", price: "100/-", ratings: [], comments: [] },
    { id: 52, name: "Sambhar Bada (2 Pcs.)", price: "60/-", ratings: [], comments: [] },
    { id: 53, name: "Samosa (Pcs.)", price: "15/-", ratings: [], comments: [] },
    { id: 54, name: "Schezwan Maggi", price: "50/-", ratings: [], comments: [] },
    { id: 55, name: "Special Pattie (Pcs.)", price: "30/-", ratings: [], comments: [] },
    { id: 56, name: "Special Veg. Maggi With Butter", price: "50/-", ratings: [], comments: [] },
    { id: 57, name: "Spring Roll", price: "60/-", ratings: [], comments: [] },
    { id: 58, name: "Sweet Corn Maggi", price: "50/-", ratings: [], comments: [] },
    { id: 59, name: "Tea", price: "15/-", ratings: [], comments: [] },
    { id: 60, name: "Tikki (2 Pcs.)", price: "50/-", ratings: [], comments: [] },
    { id: 61, name: "Tikki Chana (2 Pcs.)", price: "60/-", ratings: [], comments: [] },
    { id: 62, name: "Uttapam Dosa", price: "70/-", ratings: [], comments: [] },
    { id: 63, name: "Veg. Maggi", price: "40/-", ratings: [], comments: [] },
    { id: 64, name: "Veg. Sandwich", price: "30/-", ratings: [], comments: [] },
    { id: 65, name: "Veg. Wrap", price: "50/-", ratings: [], comments: [] },
    { id: 66, name: "White Pasta", price: "80/-", ratings: [], comments: [] },
  ],
  night: [
    { id: 1, name: "Aloo Methi Prantha (1 Pc)", price: "40/-", ratings: [], comments: [] },
    { id: 2, name: "Aloo Prantha (1 Pc)", price: "30/-", ratings: [], comments: [] },
    { id: 3, name: "Aloo Puri (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 4, name: "Aloo Pyaz Prantha (1 Pc)", price: "40/-", ratings: [], comments: [] },
    { id: 5, name: "Aloo Tikki (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 6, name: "Aloo Tikki Chana (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 7, name: "Butter Chicken (4 pcs)", price: "140/-", ratings: [], comments: [] },
    { id: 8, name: "Butter Roti (Tawa)", price: "12/-", ratings: [], comments: [] },
    { id: 9, name: "Chaap Gravy (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 10, name: "Chaap Wrap", price: "80/-", ratings: [], comments: [] },
    { id: 11, name: "Chana Bhatura (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 12, name: "Chana Kulcha (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 13, name: "Chana Puri (Plate)", price: "60/-", ratings: [], comments: [] },
    { id: 14, name: "Chana Samosa (1 Pc)", price: "30/-", ratings: [], comments: [] },
    { id: 15, name: "Chana Samosa (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 16, name: "Cheese Burger", price: "50/-", ratings: [], comments: [] },
    { id: 17, name: "Cheese Finger (1 Pc)", price: "80/-", ratings: [], comments: [] },
    { id: 18, name: "Cheese Sandwich", price: "50/-", ratings: [], comments: [] },
    { id: 19, name: "Cheese Sandwich Brown", price: "50/-", ratings: [], comments: [] },
    { id: 20, name: "Chicken Burger", price: "80/-", ratings: [], comments: [] },
    { id: 21, name: "Chicken Chilli (8 pcs) (Plate)", price: "130/-", ratings: [], comments: [] },
    { id: 22, name: "Chicken Curry", price: "130/-", ratings: [], comments: [] },
    { id: 23, name: "Chicken Egg Burger", price: "90/-", ratings: [], comments: [] },
    { id: 24, name: "Chicken Fried (8 pcs)", price: "130/-", ratings: [], comments: [] },
    { id: 25, name: "Chicken Fried Rice", price: "140/-", ratings: [], comments: [] },
    { id: 26, name: "Chicken Pasta (Plate)", price: "120/-", ratings: [], comments: [] },
    { id: 27, name: "Chicken Rice Curry", price: "150/-", ratings: [], comments: [] },
    { id: 28, name: "Chicken Wrap", price: "100/-", ratings: [], comments: [] },
    { id: 29, name: "Chilli Garlic Noodles (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 30, name: "Chilli Potato (1 Pc)", price: "80/-", ratings: [], comments: [] },
    { id: 31, name: "Egg Fried Rice", price: "90/-", ratings: [], comments: [] },
    { id: 32, name: "Egg Prantha (1 Pc)", price: "60/-", ratings: [], comments: [] },
    { id: 33, name: "Espresso Coffee (Cup)", price: "30/-", ratings: [], comments: [] },
    { id: 34, name: "French Fries (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 35, name: "Gobi Prantha (1 Pc)", price: "40/-", ratings: [], comments: [] },
    { id: 36, name: "Hot Coffee", price: "25/-", ratings: [], comments: [] },
    { id: 37, name: "Karahi Chicken", price: "140/-", ratings: [], comments: [] },
    { id: 38, name: "Karahi Paneer (Plate)", price: "80/-", ratings: [], comments: [] },
    { id: 39, name: "Laccha Prantha", price: "30/-", ratings: [], comments: [] },
    { id: 40, name: "Malai Chaap (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 41, name: "Mix Pakoda (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 42, name: "Mix Pasta (Plate)", price: "110/-", ratings: [], comments: [] },
    { id: 43, name: "Mix Prantha (1 Pc)", price: "50/-", ratings: [], comments: [] },
    { id: 44, name: "Noodles Burger", price: "60/-", ratings: [], comments: [] },
    { id: 45, name: "Nutri Kulcha (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 46, name: "Paneer Bhurji (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 47, name: "Paneer Fried Rice (Plate)", price: "90/-", ratings: [], comments: [] },
    { id: 48, name: "Paneer Prantha (1 Pc)", price: "50/-", ratings: [], comments: [] },
    { id: 49, name: "Paneer Wrap", price: "80/-", ratings: [], comments: [] },
    { id: 50, name: "Pav Bhaji (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 51, name: "Plain Prantha", price: "15/-", ratings: [], comments: [] },
    { id: 52, name: "Plain Roti (Tawa)", price: "10/-", ratings: [], comments: [] },
    { id: 53, name: "Pudina Chaap (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 54, name: "Red Pasta (Plate)", price: "90/-", ratings: [], comments: [] },
    { id: 55, name: "Samosa (1 Pc)", price: "15/-", ratings: [], comments: [] },
    { id: 56, name: "Shahi Paneer (Plate)", price: "80/-", ratings: [], comments: [] },
    { id: 57, name: "Special Tea", price: "20/-", ratings: [], comments: [] },
    { id: 58, name: "Tandoori Burger", price: "50/-", ratings: [], comments: [] },
    { id: 59, name: "Tandoori Chaap (Plate)", price: "70/-", ratings: [], comments: [] },
    { id: 60, name: "Tea", price: "15/-", ratings: [], comments: [] },
    { id: 61, name: "Veg. Biryani (1 Pc)", price: "80/-", ratings: [], comments: [] },
    { id: 62, name: "Veg. Burger", price: "40/-", ratings: [], comments: [] },
    { id: 63, name: "Veg. Fried Rice (1 Pc)", price: "80/-", ratings: [], comments: [] },
    { id: 64, name: "Veg. Noodles (Plate)", price: "50/-", ratings: [], comments: [] },
    { id: 65, name: "Veg. Sandwich", price: "40/-", ratings: [], comments: [] },
    { id: 66, name: "Veg. Sandwich Brown", price: "50/-", ratings: [], comments: [] },
    { id: 67, name: "Veg. Wrap", price: "70/-", ratings: [], comments: [] },
    { id: 68, name: "White Pasta (Plate)", price: "100/-", ratings: [], comments: [] },
  ],
  campus: [
    { id: 1, name: "7Up", price: "MRP", ratings: [], comments: [] },
    { id: 2, name: "Biscuits", price: "MRP", ratings: [], comments: [] },
    { id: 3, name: "Butter Scotch Shake", price: "40/-", ratings: [], comments: [] },
    { id: 4, name: "Chana", price: "30/-", ratings: [], comments: [] },
    { id: 5, name: "Chana Bhatura (1pc)", price: "45/-", ratings: [], comments: [] },
    { id: 6, name: "Chana Rice", price: "45/- (Half) / 80/- (Full)", ratings: [], comments: [] },
    { id: 7, name: "Chana Samosa", price: "30/-", ratings: [], comments: [] },
    { id: 8, name: "Cheese Burger", price: "70/-", ratings: [], comments: [] },
    { id: 9, name: "Cheese Corn Sandwich", price: "90/-", ratings: [], comments: [] },
    { id: 10, name: "Chips", price: "MRP", ratings: [], comments: [] },
    { id: 11, name: "Chocolate Shake", price: "40/-", ratings: [], comments: [] },
    { id: 12, name: "Coffee (100ml)", price: "25/-", ratings: [], comments: [] },
    { id: 13, name: "Cold Coffee (250ml)", price: "40/-", ratings: [], comments: [] },
    { id: 14, name: "Dahi", price: "30/-", ratings: [], comments: [] },
    { id: 15, name: "Dew", price: "MRP", ratings: [], comments: [] },
    { id: 16, name: "French Fries", price: "60/-", ratings: [], comments: [] },
    { id: 17, name: "Grilled Sandwich", price: "80/-", ratings: [], comments: [] },
    { id: 18, name: "Juice", price: "MRP", ratings: [], comments: [] },
    { id: 19, name: "Lassi (Sweet & Salty) (250ml)", price: "30/-", ratings: [], comments: [] },
    { id: 20, name: "Lemon Water (250ml)", price: "30/-", ratings: [], comments: [] },
    { id: 21, name: "Manchurian (40pc)", price: "80/-", ratings: [], comments: [] },
    { id: 22, name: "Milk Tea (100ml)", price: "20/-", ratings: [], comments: [] },
    { id: 23, name: "Mixed Pratha", price: "40/-", ratings: [], comments: [] },
    { id: 24, name: "Nimbooz", price: "MRP", ratings: [], comments: [] },
    { id: 25, name: "Noodle Burger", price: "60/-", ratings: [], comments: [] },
    { id: 26, name: "Paneer Pratha", price: "50/-", ratings: [], comments: [] },
    { id: 27, name: "Paties", price: "20/-", ratings: [], comments: [] },
    { id: 28, name: "Pepsi", price: "MRP", ratings: [], comments: [] },
    { id: 29, name: "Plain Burger", price: "50/-", ratings: [], comments: [] },
    { id: 30, name: "Plain Maggi", price: "35/-", ratings: [], comments: [] },
    { id: 31, name: "Plain Sandwich", price: "30/-", ratings: [], comments: [] },
    { id: 32, name: "Poha", price: "40/-", ratings: [], comments: [] },
    { id: 33, name: "Rajma", price: "30/-", ratings: [], comments: [] },
    { id: 34, name: "Rajma Rice", price: "45/- (Half) / 80/- (Full)", ratings: [], comments: [] },
    { id: 35, name: "Samosa with Chutney", price: "15/-", ratings: [], comments: [] },
    { id: 36, name: "Shake", price: "MRP", ratings: [], comments: [] },
    { id: 37, name: "Slice", price: "MRP", ratings: [], comments: [] },
    { id: 38, name: "Spring Roll", price: "70/-", ratings: [], comments: [] },
    { id: 39, name: "Strawberry Shake", price: "40/-", ratings: [], comments: [] },
    { id: 40, name: "Sting", price: "MRP", ratings: [], comments: [] },
    { id: 41, name: "Tea (100ml)", price: "15/-", ratings: [], comments: [] },
    { id: 42, name: "Thali", price: "80/-", ratings: [], comments: [] },
    { id: 43, name: "Tikki", price: "50/-", ratings: [], comments: [] },
    { id: 44, name: "Tropicana", price: "MRP", ratings: [], comments: [] },
    { id: 45, name: "Veg Fried Rice", price: "100/-", ratings: [], comments: [] },
    { id: 46, name: "Veg Maggi", price: "40/-", ratings: [], comments: [] },
    { id: 47, name: "Veg. Fried Momos", price: "70/-", ratings: [], comments: [] },
    { id: 48, name: "Veg. Noodle", price: "60/-", ratings: [], comments: [] },
    { id: 49, name: "Veg. Steam Momos", price: "60/-", ratings: [], comments: [] },
  ],
};

const THEME_KEY = "bite-review-theme";
const MENUS_KEY = "bite-review-menus";
const RATED_DISHES_KEY = "bite-review-rated-dishes";
const COMMENTED_DISHES_KEY = "bite-review-commented-dishes";
const FOOD_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh pizza and toppings",
    caption: "Cheesy comfort food for those quick campus cravings.",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    alt: "Colorful table spread with multiple dishes",
    caption: "A vibrant food spread that matches the social canteen energy.",
  },
  {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    alt: "Healthy bowl and fresh ingredients",
    caption: "Fresh bowls and cafe-style plates for lighter food moods.",
  },
];

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function getThemeAccent(theme) {
  return theme === "dark" ? "#8bd3ff" : "#ff7a18";
}

function getDishRatingKey(canteenId, dishId) {
  return `${canteenId}:${dishId}`;
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDishName(name) {
  return name.trim().toLowerCase();
}

function mergeMenuPreservingFeedback(defaultMenu, storedMenu = []) {
  const storedByName = new Map(storedMenu.map((dish) => [normalizeDishName(dish.name), dish]));

  return defaultMenu.map((dish) => {
    const storedDish = storedByName.get(normalizeDishName(dish.name));
    return storedDish
      ? {
          ...dish,
          ratings: Array.isArray(storedDish.ratings) ? storedDish.ratings : [],
          comments: Array.isArray(storedDish.comments) ? storedDish.comments : [],
        }
      : dish;
  });
}

function readStoredMenus() {
  if (typeof window === "undefined") return INITIAL_MENUS;
  try {
    const stored = window.localStorage.getItem(MENUS_KEY);
    if (!stored) return INITIAL_MENUS;

    const parsedMenus = JSON.parse(stored);
    return Object.fromEntries(
      Object.entries(INITIAL_MENUS).map(([canteenId, defaultMenu]) => [
        canteenId,
        mergeMenuPreservingFeedback(defaultMenu, parsedMenus[canteenId]),
      ]),
    );
  } catch {
    return INITIAL_MENUS;
  }
}

function readRatedDishes() {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(RATED_DISHES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeRatedDishes(ratedDishes) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RATED_DISHES_KEY, JSON.stringify(ratedDishes));
}

function readCommentedDishes() {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(COMMENTED_DISHES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeCommentedDishes(commentedDishes) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMMENTED_DISHES_KEY, JSON.stringify(commentedDishes));
}

function Stars({ value, interactive = false, selected = 0, hover = 0, onRate, onHover }) {
  return (
    <div className={`stars ${interactive ? "stars--interactive" : ""}`}>
      {[1, 2, 3, 4, 5].map((score) => {
        const isFilled = interactive ? score <= (hover || selected) : score <= Math.round(value);
        return (
          <button
            key={score}
            type="button"
            className={`star ${isFilled ? "star--filled" : ""}`}
            onClick={() => interactive && onRate?.(score)}
            onMouseEnter={() => interactive && onHover?.(score)}
            onMouseLeave={() => interactive && onHover?.(0)}
            aria-label={`Rate ${score} out of 5`}
          >
            {"\u2605"}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label="Toggle color theme">
      <span className={`theme-toggle__track ${theme === "dark" ? "is-dark" : ""}`}>
        <span className="theme-toggle__label">Light</span>
        <span className="theme-toggle__thumb" />
        <span className="theme-toggle__label">Dark</span>
      </span>
    </button>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="modal-shell" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
          x
        </button>
        {children}
      </div>
    </div>
  );
}

function RateModal({ dish, accent, onClose, onSubmit, alreadyRatedToday }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selected || alreadyRatedToday) return;
    onSubmit(selected);
    setSubmitted(true);
    window.setTimeout(onClose, 900);
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <p className="modal-kicker" style={{ color: accent }}>
          Community rating
        </p>
        <h2>Rate {dish.name}</h2>
        <p className="modal-subtitle">{dish.price ? `${dish.price} - Help the next student choose the right plate.` : "Help the next student choose the right plate."}</p>
      </div>
      {alreadyRatedToday ? (
        <div className="modal-success">Thank you for rating this item. You can rate this dish again tomorrow.</div>
      ) : null}
      {submitted ? (
        <div className="modal-success">Thank you for rating this food item. Your feedback helps other students choose better.</div>
      ) : !alreadyRatedToday ? (
        <>
          <Stars
            interactive
            value={0}
            selected={selected}
            hover={hover}
            onRate={setSelected}
            onHover={setHover}
          />
          <p className="rating-caption">
            {selected ? ["", "Too weak", "Okay", "Solid", "Great", "Campus legend"][selected] : "Select a score"}
          </p>
          <button type="button" className="primary-action" style={{ background: accent }} onClick={handleSubmit} disabled={!selected}>
            Submit rating
          </button>
        </>
      ) : null}
    </ModalShell>
  );
}

function CommentsModal({ dish, accent, onClose, onPost, alreadyCommentedToday }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handlePost() {
    if (!text.trim() || alreadyCommentedToday) return;
    onPost(text.trim());
    setSubmitted(true);
    setText("");
    window.setTimeout(onClose, 900);
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <p className="modal-kicker" style={{ color: accent }}>
          Dish reviews
        </p>
        <h2>{dish.name}</h2>
        <p className="modal-subtitle">{dish.price ? `${dish.price} - Quick takes from the people who have actually tried it.` : "Quick takes from the people who have actually tried it."}</p>
      </div>
      {alreadyCommentedToday ? (
        <div className="modal-success">Thank you for commenting on this item. You can post another comment for this dish tomorrow.</div>
      ) : null}
      {submitted ? <div className="modal-success">Thank you for sharing your comment. It has been saved for everyone to see.</div> : null}
      <div className="comment-list">
        {dish.comments.length === 0 ? (
          <EmptyState icon="💬" message="Be the first to review this item!" className="empty-state--compact" />
        ) : null}
        {dish.comments.map((comment, index) => (
          <div key={`${dish.id}-${index}`} className="comment-item">
            <span className="comment-badge">BR</span>
            <p>&ldquo;{comment}&rdquo;</p>
          </div>
        ))}
      </div>
      <div className="comment-compose">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handlePost()}
          placeholder="Share what stood out..."
          disabled={alreadyCommentedToday}
        />
        <button type="button" className="primary-action" style={{ background: accent }} onClick={handlePost} disabled={alreadyCommentedToday || !text.trim()}>
          {alreadyCommentedToday ? "Comment submitted" : "Post"}
        </button>
      </div>
    </ModalShell>
  );
}

function DishCard({ dish, canteen, onRate, onComment, hasRated, hasCommented }) {
  const rating = average(dish.ratings);
  const isPopular = dish.ratings.length >= 3 || dish.comments.length >= 2;

  return (
    <article className={`dish-card ${isPopular ? "dish-card--popular" : ""}`} style={{ "--canteen-accent": canteen.accent }}>
      <div className="dish-card__row">
        <div className="dish-card__main">
          {isPopular ? <p className="dish-card__eyebrow">Trending now</p> : null}
          <h3>{dish.name}</h3>
          <div className="dish-card__meta">
            {dish.price ? <p className="dish-card__price">{dish.price}</p> : null}
            <span className="dish-card__count">{dish.ratings.length} ratings</span>
          </div>
        </div>
        <div className="dish-rating">
          <StarRating value={rating} size={13} />
        </div>
      </div>
      <div className="dish-card__footer">
        <button type="button" className="primary-action" style={{ background: canteen.accent }} onClick={() => onRate(dish)} disabled={hasRated}>
          {hasRated ? "Rate again tomorrow" : "Rate dish"}
        </button>
        <button type="button" className="secondary-action" onClick={() => onComment(dish)} disabled={hasCommented}>
          {hasCommented ? "Comment tomorrow" : `${dish.comments.length} comments`}
        </button>
      </div>
    </article>
  );
}

function HomePage({ theme, onSelect, onToggleTheme, featured }) {
  const featuredMenu = INITIAL_MENUS[featured.id] || [];
  const featuredTopItem = featuredMenu[0]?.name || "Community favorite coming in";
  const featuredTopRated = featuredMenu[0]?.name || featuredTopItem;

  return (
    <div className="page page--home">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark">BR</span>
          <div>
            <p className="brand-kicker">Campus food guide</p>
            <h1>Bite Review</h1>
          </div>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link className="admin-entry-link" to="/admin">
            Admin
          </Link>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="hero-kicker">Find the right bite before you queue</p>
          <h2>
            Let's BITE 🍕.
            <br />
            Let's REVIEW ⭐.
          </h2>
          <p className="hero-description">
            Explore the most talked-about dishes across campus, compare crowd favorites, and jump into ratings and comments
            without losing the visual flow.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-action hero-button" onClick={() => onSelect(featured)}>
              Browse Canteens
            </button>
            <button type="button" className="secondary-action hero-button" onClick={() => onSelect(featured)}>
              View Top Rated Today
            </button>
          </div>
          <div className="stats-grid">
            <div>
              <strong>{CANTEENS.length}</strong>
              <span>Canteens</span>
            </div>
            <div>
              <strong>25+</strong>
              <span>Rated dishes</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>Student reviews</span>
            </div>
          </div>
          <div className="live-strip">
            <span>🔥 Trending now: {featuredTopItem}</span>
            <span>🟢 Students are rating dishes today</span>
            <span>⭐ Recently reviewed across campus</span>
          </div>
        </div>

        <div className="hero-spotlight">
          <div className="spotlight-card">
            <p className="spotlight-card__label">Featured tonight</p>
            <h3>{featured.name}</h3>
            <p>{featured.highlight}</p>
            <div className="spotlight-meta">
              <span>Top pick today</span>
              <span>{featuredTopRated}</span>
            </div>
            <div className="spotlight-pill" style={{ "--accent": featured.accent }}>
              Accent inspired by {featured.name}
            </div>
          </div>
          <div className="spotlight-orb spotlight-orb--one" />
          <div className="spotlight-orb spotlight-orb--two" />
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Browse spaces</p>
            <h3>Choose your next campus stop</h3>
          </div>
          <p className="section-note">Each card opens a full menu view with searchable dishes, ratings, and comments.</p>
        </div>
        <div className="canteen-grid">
          {CANTEENS.map((canteen) => (
            <CanteenCard key={canteen.id} canteen={canteen} onSelect={onSelect} />
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Food mood</p>
            <h3>Big flavor, better choices</h3>
          </div>
          <p className="section-note">A visual food strip to make the homepage feel tastier, warmer, and more alive.</p>
        </div>
        <div className="photo-grid">
          {FOOD_PHOTOS.map((photo) => (
            <article key={photo.src} className="photo-card">
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="photo-card__caption">
                <p>{photo.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CanteenCard({ canteen, onSelect }) {
  const menu = INITIAL_MENUS[canteen.id] || [];
  const topItem = menu[0]?.name || "Popular item";

  return (
    <button
      type="button"
      className="canteen-card"
      style={{ "--accent": canteen.accent }}
      onClick={() => onSelect(canteen)}
      aria-label={`Open ${canteen.name}`}
    >
      <span className="canteen-card__label" style={{ "--accent": canteen.accent }}>
        {canteen.label}
      </span>
      <h4>
        <span className="canteen-card__emoji">{canteen.emoji}</span>
        {canteen.name}
      </h4>
      <div className="canteen-card__rating">
        <span className="canteen-card__rating-label">No ratings yet</span>
      </div>
      <p>{canteen.tagline}</p>
      <div className="canteen-card__trending">{topItem} on the menu</div>
      <span className="canteen-card__meta">{canteen.highlight}</span>
    </button>
  );
}

function CanteenPage({ canteen, menus, onBack, onRate, onComment, onToggleTheme, theme, ratedDishes, commentedDishes, todayKey }) {
  const [search, setSearch] = useState("");
  const dishes = menus[canteen.id] || [];

  const filteredDishes = useMemo(
    () => dishes.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase())),
    [dishes, search],
  );

  const topDish = useMemo(() => {
    return [...dishes].sort((left, right) => average(right.ratings) - average(left.ratings))[0];
  }, [dishes]);
  const topDishReviews = topDish ? topDish.comments.length + topDish.ratings.length : 0;

  return (
    <div className="page page--detail">
      <header className="detail-hero" style={{ "--accent": canteen.accent }}>
        <div className="detail-hero__nav">
          <button type="button" className="secondary-action" onClick={onBack}>
            Back
          </button>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Link className="admin-entry-link" to="/admin">
              Admin
            </Link>
          </div>
        </div>
        <div className="detail-hero__body">
          <div className="detail-copy">
            <p className="section-kicker">Now exploring</p>
            <h2>
              <span className="detail-copy__emoji">{canteen.emoji}</span>
              {canteen.name}
            </h2>
            <p>{canteen.tagline}</p>
          </div>
          <div className="detail-highlight">
            <span>🔥 Most Loved Dish</span>
            <strong>{topDish?.name ?? "No dishes available"}</strong>
            {topDish ? (
              <>
                <div className="detail-highlight__rating">
                  <StarRating value={average(topDish.ratings)} size={16} />
                </div>
                <p>💬 {topDishReviews} reviews</p>
              </>
            ) : (
              <p>Ratings will appear here soon.</p>
            )}
          </div>
        </div>
      </header>

      <section className="section-shell section-shell--detail">
        <div className="toolbar">
          <label className="search-field">
            <span>Search menu</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type a dish name..."
            />
          </label>
        </div>

        {filteredDishes.length === 0 ? (
          <EmptyState icon="🍽️" message="Nothing here yet." />
        ) : (
          <div className="dish-grid">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                canteen={canteen}
                onRate={onRate}
                onComment={onComment}
                hasRated={ratedDishes[getDishRatingKey(canteen.id, dish.id)] === todayKey}
                hasCommented={commentedDishes[getDishRatingKey(canteen.id, dish.id)] === todayKey}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function BiteReview() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : "light";
  });
  const [activeCanteen, setActiveCanteen] = useState(null);
  const [menus, setMenus] = useState(() => readStoredMenus());
  const [rateModal, setRateModal] = useState(null);
  const [commentModal, setCommentModal] = useState(null);
  const [ratedDishes, setRatedDishes] = useState(() => readRatedDishes());
  const [commentedDishes, setCommentedDishes] = useState(() => readCommentedDishes());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
  }, [menus]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  function submitRating(rating) {
    if (!activeCanteen || !rateModal) return;
    const todayKey = getTodayKey();
    const dishKey = getDishRatingKey(activeCanteen.id, rateModal.id);
    if (ratedDishes[dishKey] === todayKey) return;

    setMenus((previousMenus) => ({
      ...previousMenus,
      [activeCanteen.id]: previousMenus[activeCanteen.id].map((dish) =>
        dish.id === rateModal.id ? { ...dish, ratings: [...dish.ratings, rating] } : dish,
      ),
    }));

    setRatedDishes((previousRatedDishes) => {
      const nextRatedDishes = { ...previousRatedDishes, [dishKey]: todayKey };
      writeRatedDishes(nextRatedDishes);
      return nextRatedDishes;
    });
  }

  function submitComment(text) {
    if (!activeCanteen || !commentModal) return;
    const todayKey = getTodayKey();
    const dishKey = getDishRatingKey(activeCanteen.id, commentModal.id);
    if (commentedDishes[dishKey] === todayKey) return;

    setMenus((previousMenus) => ({
      ...previousMenus,
      [activeCanteen.id]: previousMenus[activeCanteen.id].map((dish) =>
        dish.id === commentModal.id ? { ...dish, comments: [...dish.comments, text] } : dish,
      ),
    }));

    setCommentModal((previousDish) => (previousDish ? { ...previousDish, comments: [...previousDish.comments, text] } : null));

    setCommentedDishes((previousCommentedDishes) => {
      const nextCommentedDishes = { ...previousCommentedDishes, [dishKey]: todayKey };
      writeCommentedDishes(nextCommentedDishes);
      return nextCommentedDishes;
    });
  }

  function getLiveDish(modalDish) {
    if (!modalDish || !activeCanteen) return modalDish;
    return menus[activeCanteen.id]?.find((dish) => dish.id === modalDish.id) || modalDish;
  }

  const featured = CANTEENS[0];
  const liveRateDish = getLiveDish(rateModal);
  const liveCommentDish = getLiveDish(commentModal);
  const accent = activeCanteen?.accent || getThemeAccent(theme);
  const todayKey = getTodayKey();

  return (
    <div className="bite-review-app">
      {activeCanteen ? (
        <CanteenPage
          canteen={activeCanteen}
          menus={menus}
          onBack={() => setActiveCanteen(null)}
          onRate={setRateModal}
          onComment={setCommentModal}
          onToggleTheme={toggleTheme}
          theme={theme}
          ratedDishes={ratedDishes}
          commentedDishes={commentedDishes}
          todayKey={todayKey}
        />
      ) : (
        <HomePage theme={theme} onSelect={setActiveCanteen} onToggleTheme={toggleTheme} featured={featured} />
      )}

      {liveRateDish ? (
        <RateModal
          dish={liveRateDish}
          accent={accent}
          onClose={() => setRateModal(null)}
          onSubmit={submitRating}
          alreadyRatedToday={Boolean(activeCanteen && ratedDishes[getDishRatingKey(activeCanteen.id, liveRateDish.id)] === todayKey)}
        />
      ) : null}

      {liveCommentDish ? (
        <CommentsModal
          dish={liveCommentDish}
          accent={accent}
          onClose={() => setCommentModal(null)}
          onPost={submitComment}
          alreadyCommentedToday={Boolean(activeCanteen && commentedDishes[getDishRatingKey(activeCanteen.id, liveCommentDish.id)] === todayKey)}
        />
      ) : null}
    </div>
  );
}

