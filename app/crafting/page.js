'use client'
import { useState } from 'react';
import TreeNode from './components/TreeNode';
import minecraftData from 'minecraft-data';
import RawMaterialsSummary from './components/RawMaterialsSummary';
const mcData = minecraftData('1.21.11');

const itemsList = Object.values(mcData.items);
const filteredItemsList = itemsList.filter((item) => mcData.recipes[item.id]);


function hasCycle(itemName, ingredientName){
  const ingredientId = mcData.itemsByName[ingredientName]?.id;
  if(!ingredientId || !mcData.recipes[ingredientId]) return false;
  const recipe = mcData.recipes[ingredientId][0];
  const currentIngredients = recipe.inShape ? recipe.inShape.flat(Infinity) : recipe.ingredients || [];
  const testeResult = currentIngredients.includes(mcData.itemsByName[itemName].id);
  return testeResult;
}

function calcMaterials (itemName, quantity, visited = new Set()){

  if (visited.has(itemName)){
    return {name: itemName, quantity, ingredients:[]}
  }

  let itemId = mcData.itemsByName[itemName].id;

  if(!mcData.recipes[itemId]){
    return { name: itemName, quantity: quantity, ingredients: []};
  }

  let itemRecipe = mcData.recipes[itemId][0];

  if(itemRecipe.ingredients?.length < itemRecipe.result.count){
    return { name: itemName, quantity, ingredients: [] }
  }

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

  let ingredientsTree = [];
  const newVisited = new Set(visited);
  newVisited.add(itemName);

  for(const[key, value] of Object.entries(ingredientTotal)){
    const ingredientName = mcData.items[Number(key)].name;
    if(!hasCycle(itemName, ingredientName)){
      const subResult = calcMaterials(ingredientName, value, new Set(newVisited));
      ingredientsTree.push(subResult);
    }
  }

  let finalTree = { name: itemName, quantity: quantity, ingredients: ingredientsTree }
  return finalTree; 
}

function isRawMaterial(node, result = {}){
  if (node.ingredients.length === 0){
    result[node.name] = (result[node.name] ?? 0) + node.quantity;
  } else {
    for (const ingredientRecipe of node.ingredients){
      isRawMaterial(ingredientRecipe, result);
    }
  }
  return result;
}

export default function CraftingRecipes() {
  const [selectedItem, setSelectedItem] = useState();
  const [blockQuantity, setBlockQuantity] = useState(0);
  const [renderTree, setRenderTree] = useState(null);
  const [rawMaterials, setRawMaterials] = useState(null);
  const [searchedItem, setSearchedItem] = useState('');

  const filteredSearch = filteredItemsList.filter((item) => item.displayName.toLowerCase().includes(searchedItem.toLowerCase()));

  const handleCalculate = () => {
    const tree = calcMaterials(selectedItem, blockQuantity);
    setRenderTree(tree);
    const raw = isRawMaterial(tree);
    setRawMaterials(raw);
    console.log(raw);
  }

  return (
    <div className='pt-12'>
      <h1>Crafting</h1>
      <div className='p-4 m-4'>
        <label htmlFor='Quantity' className='mx-4'>Quantity</label>
        <input type='number' id='blockQuantity' name='blockQuantity' className='bg-white text-black' onChange={(e) => setBlockQuantity(Number(e.target.value))}></input>
        <button className='p-2 m-2' onClick={handleCalculate}>Calculate</button>
      </div>
      <div className='pt-6 mt-6 mb-2 pb-2'>
        <label htmlFor='SearchBar' className='mx-4'>Search:</label>
        <input type='text' id='searchInput' name='searchInput' className='bg-white text-black rounded-sm' onChange={(e) => setSearchedItem(e.target.value)}></input>
      </div>
      <div className='p-2 m-2'>
        <ul>
          {filteredSearch.map((item) => (
            <li key = {item.id} onClick={() => {setSelectedItem(item.name)}}>{item.displayName}</li>
          ))}
        </ul>
      </div>
      <div>
          {renderTree && (
            <div>
              <TreeNode {...renderTree} />
              <RawMaterialsSummary {...rawMaterials}/>
            </div>
          )}
      </div>
    </div>
  );
}