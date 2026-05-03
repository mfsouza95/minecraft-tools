'use client'
import { useState } from 'react';
import TreeNode from './components/TreeNode';
import minecraftData from 'minecraft-data';
import RawMaterialsSummary from './components/RawMaterialsSummary';

const mcData = minecraftData('1.21.11');

const itemsList = Object.values(mcData.items);
const filteredItemsList = itemsList.filter((item) => mcData.recipes[item.id] && item.name !== 'air');


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
    const rawWithStacks = Object.fromEntries(
      Object.entries(raw).map(([name, quantity]) => [
        name,
        {
          quantity,
          stacks: Math.floor(quantity/64),
          remainder: quantity % 64
        }
      ])
    )
    setRawMaterials(rawWithStacks);
  }

  return (
    <div className='pt-12'>
      <div className="absolute inset-0 bg-black opacity-30 z-[-1]"></div>
      <div className="relative z-10 py-4">
        <div className='text-center text-3xl font-bold font-[family-name:var(--font-minecraft)]'>
          <h1>Crafting</h1>
        </div>
        <div className='p-4 m-2 justify-center text-center text-2xl'>
          <label htmlFor='SearchBar' className='mx-4'>Search:</label>
          <input type='text' id='searchInput' name='searchInput' className='bg-white text-black rounded-sm' onChange={(e) => setSearchedItem(e.target.value)}></input>
          <label htmlFor='Quantity' className='mx-4'>Quantity</label>
          <input type='number' id='blockQuantity' name='blockQuantity' className='bg-white text-black rounded-sm no-arrows' onChange={(e) => setBlockQuantity(Number(e.target.value))}></input>
          <button className='m-2 p-2 bg-white text-black rounded-sm cursor-pointer hover:bg-gray-200 font-[family-name:var(--font-minecraft)]' onClick={handleCalculate}>Calculate</button>
        </div>
        <div>
          {renderTree && (
            <div className='justify-center text-xl mx-auto w-fit border-4 rounded-lg border-green-600 p-4 bg-green-600/30'>
              <TreeNode {...renderTree} />
              <RawMaterialsSummary {...rawMaterials}/>
            </div>
          )}
        </div>
        <div className='p-2 m-2 border-4 rounded-lg w-2/3 mx-auto justify-center drop-shadow-2xl backdrop-blur-xs bg-white/20 h-152 overflow-y-scroll text-xl'>
          <ul className='grid grid-cols-5 gap-3'>
            {filteredSearch.map((item) => (
              <li className='text-white hover:text-indigo-400 cursor-pointer' key = {item.id} onClick={() => {setSelectedItem(item.name)}}>{item.displayName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}