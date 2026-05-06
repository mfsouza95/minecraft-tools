import { ResultRaw } from "../../types";

export default function RawMaterialsSummary (props: ResultRaw){
    return(
        <div className="pl-5">
            {Object.entries(props).map(([name, data]) =>(
                <span key={name} >{name}: {data.quantity} ({data.stacks} stacks e {data.remainder}) | </span>
            ))}
        </div>
    );
}