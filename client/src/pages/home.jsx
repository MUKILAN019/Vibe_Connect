import { useState } from "react";
import DropDown from "../components/DropDown";
import Kanban from "../components/Kanban";
import Lists from "../components/Lists";
import Create from "../components/Create";

export default function Home() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showKanban, setShowKanban] = useState(false);
  const [showList, setShowList] = useState(false);


  setTimeout(() => setLoading(false), 2000); 

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-950 text-white p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-green-300 mb-8">Task Manager</h1>
          
         
          <div className="flex justify-between items-center w-full max-w-6xl mb-6 px-6">
            <div className="flex space-x-4">
            
              <button 
                className={showKanban ? `btn bg-blue-300 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg`:`btn bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg`} 
                onClick={() => {
                  setShowKanban(true);
                  setShowList(false);
                }}
              >
                Kanban
              </button>
              
              
              <button 
                className={showList? `bg-yellow-300 hover:bg-yellow-400 text-white px-4  rounded-lg shadow-lg`:`btn btn-warning`} 
                onClick={() => {
                  setShowList(true);
                  setShowKanban(false);
                }}
              >
                List
              </button>
              
              <DropDown />
            </div>
            <div className="flex items-center gap-6">
              <Create />
    <label className="input bg-green-800">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input type="search" 
             placeholder="Search tasks..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="grow"  />
            </label>
                        </div>
          </div>

          {showKanban && (
            <div className="w-full max-w-7xl overflow-x-auto flex justify-center">
              <Kanban />
            </div>
          )}

          {showList && (
            <div className="w-full max-w-7xl overflow-x-auto flex justify-center">
              <Lists />
            </div>
          )}
        </>
      )}
    </div>
  );
}