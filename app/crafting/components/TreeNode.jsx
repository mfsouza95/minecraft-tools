export default function TreeNode (props){

    return(
        <div className="pl-5">
            <p>{props.name}: {props.quantity}</p>
            {props.ingredients.map((ingredient) => (
                <TreeNode key={ingredient.name} {...ingredient}/>
            ))}
        </div>
    );
}