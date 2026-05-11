'use client'
import { useState } from 'react';
import { motion } from 'motion/react';
import TreeNode from './components/TreeNode';
import items from '../../data/1.21.11/items.json';
import recipes from '../../data/1.21.11/recipes.json';
import RawMaterialsSummary from './components/RawMaterialsSummary';
import { ResultObject } from '../types';
import { ResultRaw } from '../types';
import { HistoryEntry } from '../types'
import Sidebar from './components/Sidebar';

interface Recipe {
  inShape?: number[][];
  ingredients?:number[];
  result: {
    id: number;
    count: number;
  }
}

interface MinecraftItem {
  id: number;
  name: string;
  displayName: string;
  stackSize: number;
}

interface ItemsByName {
  [key: string]: MinecraftItem;
}

const itemsByName: ItemsByName = items.reduce<ItemsByName>((acc, item) => {
  acc[item.name] = item
  return acc
}, {})

const itemsList = Object.values(items);
const filteredItemsList = itemsList.filter((item) => recipes[item.id] && item.name !== 'air');


function hasCycle(itemName: string, ingredientName: string){
  const ingredientId: number = itemsByName[ingredientName]?.id;
  if(!ingredientId || !recipes[ingredientId]) return false;
  const recipe: Recipe = recipes[ingredientId][0];
  const currentIngredients = (recipe.inShape ? recipe.inShape.flat(Infinity) : recipe.ingredients || []) as number[];
  return currentIngredients.includes(itemsByName[itemName].id);
}

function calcMaterials (itemName: string, quantity: number, visited = new Set<string>()){

  if (visited.has(itemName)){
    return {name: itemName, quantity, ingredients:[]}
  }

  let itemId: number = itemsByName[itemName].id;

  if(!recipes[itemId]){
    return { name: itemName, quantity: quantity, ingredients: []};
  }

  let itemRecipe: Recipe = recipes[itemId][0];
  let recipeCount: number = itemRecipe.result.count;
  let timesCraft = Math.ceil(quantity / recipeCount);
  let ingredientTotal:Record<number, number> = {};


  let rawIngredients = (itemRecipe.inShape ? itemRecipe.inShape.flat(Infinity) : itemRecipe.ingredients) as number[];

  let ingredients = rawIngredients.filter((value) => value !== 0 && value !== null);

  let ingredientCount = ingredients.reduce((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {})

  for (const [key, value] of Object.entries(ingredientCount)){
    ingredientTotal[key] = (value as number) * timesCraft;
  }

  let ingredientsTree: ResultObject[] = [];
  const newVisited = new Set(visited);
  newVisited.add(itemName);

  for(const[key, value] of Object.entries(ingredientTotal)){
    const ingredientName = items[Number(key)].name;
    if(!hasCycle(itemName, ingredientName)){
      const subResult = calcMaterials(ingredientName, Number(value), new Set(newVisited));
      ingredientsTree.push(subResult);
    }
  }

  let finalTree = { name: itemName, quantity: quantity, ingredients: ingredientsTree }
  return finalTree; 
}

function isRawMaterial(node: ResultObject, result:Record<string, number> = {}){
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
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [blockQuantity, setBlockQuantity] = useState(0);
  const [renderTree, setRenderTree] = useState<ResultObject | null>(null);
  const [rawMaterials, setRawMaterials] = useState<ResultRaw | null>(null);
  const [searchedItem, setSearchedItem] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const filteredSearch = filteredItemsList.filter((item) => item.displayName.toLowerCase().includes(searchedItem.toLowerCase()));

  const handleCalculate = () => {
    const tree = calcMaterials(selectedItem, blockQuantity);
    setRenderTree(tree);
    const raw = isRawMaterial(tree);
    const rawWithStacks = Object.fromEntries(
      Object.entries(raw).map(([name, quantity]) => [
        name,
        {
          quantity: Number(quantity),
          stacks: Math.floor(Number(quantity)/64),
          remainder: Number(quantity) % 64
        }
      ])
    )
    setRawMaterials(rawWithStacks);
    setHistory(prev => [...prev, {selectedItem, quantity: blockQuantity, tree, rawMaterials: rawWithStacks}]);
  }

  return (
    <div className='pt-12 text-white'>
      <div className="absolute inset-0 z-[-1]"></div>
      <motion.div 
      initial = {{ opacity: 0, y: 50 }}
      animate = {{ opacity: 1, y: 0 }} 
      // transition={{ duration: 0.5, ease:'easeOut' }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="relative z-10 py-8">
        <div className='text-center text-3xl font-bold font-(family-name:--font-minecraft)'>
          <h1>Crafting</h1>
        </div>
        <div className='p-4 m-2 justify-center text-center text-2xl'>
          <label htmlFor='SearchBar' className='mx-4'>Search:</label>
          <input type='text' id='searchInput' name='searchInput' className='bg-white text-black rounded-sm' onChange={(e) => setSearchedItem(e.target.value)}></input>
          <label htmlFor='Quantity' className='mx-4'>Quantity</label>
          <input type='number' id='blockQuantity' name='blockQuantity' className='bg-white text-black rounded-sm no-arrows' onChange={(e) => setBlockQuantity(Number(e.target.value))}></input>
          <button className='m-2 p-2 bg-white text-black rounded-sm cursor-pointer hover:bg-gray-200 font-(family-name:--font-minecraft)' onClick={handleCalculate}>Calculate</button>
        </div>
        <div>
          {renderTree && (
            <div className='justify-center text-xl mx-auto size-auto md:w-fit border-4 rounded-lg border-green-600 p-4 bg-green-600/30'>
              <TreeNode {...renderTree} />
              <RawMaterialsSummary {...rawMaterials}/>
            </div>
          )}
        </div>
        <div className='p-2 m-2 border-4 rounded-lg w-2/3 mx-auto justify-center drop-shadow-2xl backdrop-blur-xs bg-white/20 h-152 overflow-y-scroll text-xl'>
          <ul className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3'>
            {filteredSearch.map((item) => (
              <li className='text-white md:hover:text-indigo-400 active:text-indigo-400 cursor-pointer transition-all hover:scale-105 active:shadow-lg active:shadow-black/70 md:hover:shadow-lg md:hover:shadow-black/70 w-fit' key = {item.id} onClick={() => {setSelectedItem(item.name)}}>{item.displayName}</li>
            ))}
          </ul>
        </div>
      </motion.div>
      <Sidebar
        history={history} onSelectEntry={(entry) => {
          setRenderTree(entry.tree)
          setRawMaterials(entry.rawMaterials)
        }}
        onClearHistory={() => setHistory([])}
        onClearEntry={(i) => {
          setHistory((prev) => prev.filter((_, index) => index !== i))
        }}
      />
    </div>
  );
}