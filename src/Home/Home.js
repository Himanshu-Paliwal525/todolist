import React, { useState, useEffect } from "react";
import ListForm from "../ListForm/ListForm";
import AllItems from "../AllItems/AllItems";
import './Home.css';

const Home = () => {
    const [items, setItems] = useState([]);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("auth-token");
            const response = await fetch("http://localhost:5000/items", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setItems(data);
        };

        fetchItems().catch((error) => console.log("Error in fetching items:", error));
    }, []);

    return (
        <div className="home">
            <ListForm
                setItems={setItems}
                editItem={editItem}
                setEditItem={setEditItem}
            />
            <AllItems
                items={items}
                setEditItem={setEditItem}
                setItems={setItems}
            />
        </div>
    );
};

export default Home;
