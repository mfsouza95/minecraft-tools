export default function TreeNode (props){

    return(
        <div className="flex flex-col items-center">
            <div className="border border-green-800 border-4 bg-green-800/20 rounded p-2">
                <p>{props.name}: {props.quantity}</p>
            </div>
            {props.ingredients.length > 0 && (
            <>
                <div className="w-px h-8 bg-black"></div>
                <div className="flex flex-row gap-8 m-2">
                {props.ingredients.map((ingredient) => (
                    <TreeNode key={ingredient.name} {...ingredient}/>
                ))}
                </div>
            </>
            )}
        </div>
    );
}