import React ,{use} from 'react'

const fetchUser = fetch("https://jsonplaceholder.typicode.com/albums/").then(res => res.json());
const App = () => {


  const data = use(fetchUser);
  
  return (
    <div className='bg-[#111827] min-h-screen font-sans text-white'> 
        { data.map((item) => (
            <div key={item.id}>
                <h1>{item.title}</h1>
             </div>
        ))}
    </div>
  )
}

export default App