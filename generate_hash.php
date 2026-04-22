<?php

$passwords = [
  "snackers" => "snack123",
  "nescafe" => "nescafe123",
  "yadav" => "yadav123",
  "night" => "night123",
  "campus" => "campus123"
];

foreach ($passwords as $canteen => $pass) {
  echo $canteen . " => " . password_hash($pass, PASSWORD_BCRYPT) . "<br>";
}