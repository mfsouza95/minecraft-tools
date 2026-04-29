'use client'
import { useState } from 'react';
import minecraftData from 'minecraft-data';
const mcData = minecraftData('1.21.11');

const itemsList = Object.values(mcData.items);
const filteredItemsList = itemsList.filter((item) => mcData.recipes[item.id]);

function calcMaterials (itemName, quantity){
  
  let itemId = mcData.itemsByName[itemName].id;

  if(!mcData.recipes[itemId]){
    console.log("Raw Material");
    return;
  }

  let itemRecipe = mcData.recipes[itemId][0];
  let recipeCount = itemRecipe.result.count;
  let timesCraft = Math.ceil(quantity / recipeCount);
  let ingredientTotal = {};

  let rawIngredients = itemRecipe.inShape ? itemRecipe.inShape.flat(Infinity) : itemRecipe.ingredients;

  let ingredients = rawIngredients.filter((value) => value !== 0 && value !== null);

  let ingredientCount = ingredients.reduce((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {})

  for (const [key, value] of Object.entries(ingredientCount)){
    ingredientTotal[key] = value * timesCraft;
  }

  const namedTotal = {};
  for(const[key, value] of Object.entries(ingredientTotal)){
    const ingredientName = mcData.items[Number(key)].name;
    namedTotal[ingredientName] = value;
    calcMaterials(ingredientName, value);
  }

  console.log(itemName, namedTotal)
}

export default function CraftingRecipes() {
  const [selectedItem, setSelectedItem] = useState();
  const [blockQuantity, setBlockQuantity] = useState(0);

  return (
    <div>
      <h1>Crafting</h1>
      <div className='p-4 m-4'>
        <label htmlFor='Quantity' className='mx-4'>Quantity</label>
        <input type='number' id='blockQuantity' name='blockQuantity' className='bg-white text-black' onChange={(e) => setBlockQuantity(Number(e.target.value))}></input>
        <button className='p-2 m-2' onClick={() => {calcMaterials(selectedItem, blockQuantity)}}>Calculate</button>
      </div>
      <div className='p-4 m-4'>
        <ul>
          {filteredItemsList.map((item) => (
            <li key = {item.id} onClick={() => {setSelectedItem(item.name)}}>{item.displayName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}