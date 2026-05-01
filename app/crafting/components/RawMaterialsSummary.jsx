export default function RawMaterialsSummary (props){

    return(
        <div className="pl-5">
            {Object.entries(props).map(([name, quantity]) =>(
                <span key = {name}>{name}: {quantity} | </span>
            ))}
        </div>
    );
}