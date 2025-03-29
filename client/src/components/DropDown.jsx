export default function DropDown() {
    return (
        <div>
            <button className="btn btn-error" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }}>
                Filter
            </button>
  

            <ul className="dropdown menu w-52 rounded-box  shadow-lg border border-green-600 bg-green-700 text-white"
                popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" }}>
                <li><a className="text-yellow-500 font-bold">Created by Me</a></li>
                <li><a className="text-orange-600 font-bold">Assigned to Me</a></li>
            </ul>
        </div>
    );
}
