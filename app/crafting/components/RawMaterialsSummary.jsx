export default function RawMaterialsSummary (props){

    return(
        <div className="pl-5">
            {Object.entries(props).map(([name, data]) =>(
                <span key={name} >{name}: {data.quantity} ({data.stacks} stacks e {data.remainder}) | </span>
            ))}

        </div>
    );
}