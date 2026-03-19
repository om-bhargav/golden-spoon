"use client"

import { createTable, deleteTable, getTables } from "@/firebase/Tables"
import { useEffect, useState } from "react"

export default function RestaurantTablesPage() {

  const [tables, setTables] = useState<any>([])
  const [tableName, setTableName] = useState("")
  const [seats, setSeats] = useState<number>(1)
  const [message, setMessage] = useState("")

  const handleAddTable = async () => {

    if (!tableName) {
      setMessage("Table name required")
      return
    }

    const newTable: any = {
      name: tableName,
      seats: seats
    }
    try{
        const table = await createTable(newTable);
        setTables([...tables,table]);
        setTableName("")
        setSeats(1)
        setMessage("Table added successfully")
    }catch(error: any){
        setMessage(error.message);
    }finally{

    }
  }

  const handleDeleteTable = async (id: string) => {
    try{
        await  deleteTable(id);
        setTables(tables.filter((t: any) => t.id !== id))
        setMessage("Table removed")
    }catch(error: any){
        setMessage(error.message);
    }finally{
        
    }
  }
  useEffect(()=>{
    const fetchData = async () => {
        const data = await getTables();
        setTables(data as any);
    };
    fetchData();
  },[]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-16">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Restaurant Tables
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your restaurant seating tables
          </p>
        </div>


        {/* ADD TABLE */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-10">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Add New Table
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-black">

            <div>
              <label className="block text-sm font-semibold mb-1">
                Table Name
              </label>
              <input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Table 1"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Seats
              </label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

          </div>

          <button
            onClick={handleAddTable}
            className="mt-6 px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Add Table
          </button>

        </div>


        {/* TABLE LIST */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Existing Tables
          </h2>

          {tables.length === 0 && (
            <p className="text-gray-500">No tables added yet</p>
          )}

          <div className="space-y-4">

            {tables.map((table: any) => (

              <div
                key={table.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">{table.name}</p>
                  <p className="text-sm text-gray-500">
                    Seats: {table.seats}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteTable(table.id!)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          {message && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
              {message}
            </div>
          )}

        </div>

      </div>

    </main>
  )
}