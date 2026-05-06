interface RawMaterial {
    quantity: number;
    stacks: number;
    remainder: number;
}

interface RawMaterialsProp{
    [key: string]: RawMaterial;
}

export default function RawMaterialsSummary (props: RawMaterialsProp){
    return(
        <div className="pl-5">
            {Object.entries(props).map(([name, data]) =>(
                <span key={name} >{name}: {data.quantity} ({data.stacks} stacks e {data.remainder}) | </span>
            ))}
        </div>
    );
}