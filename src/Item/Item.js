import React from "react";
import edit from "./edit.png";
import remove from "./delete.png";
import "./item.css";

const Item = ({ item, id, setEditItem, setItems }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("auth-token");
        await fetch(`http://localhost:5000/items/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setItems((prevItems) =>
            prevItems.filter((eachItem) => eachItem._id !== id)
        );
    };

    const handleEdit = async () => {
        const token = localStorage.getItem("auth-token");
        const response = await fetch(`http://localhost:5000/items/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setEditItem(data);
    };

    return (
        <div className="item">
            <span>{item}</span>
            <img src={edit} alt="Edit" onClick={handleEdit} />
            <img src={remove} alt="Delete" onClick={handleDelete} />
        </div>
    );
};

export default Item;
