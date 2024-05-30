import React, { useState, useEffect } from "react";
import "./ListForm.css";

const ListForm = ({ setItems, editItem, setEditItem }) => {
    const [formData, setFormData] = useState({ item: "" });

    useEffect(() => {
        if (editItem) {
            setFormData({ item: editItem.item });
        }
    }, [editItem]);

    const handleChange = (event) => {
        setFormData({ [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("auth-token");
        const response = await fetch("http://localhost:5000/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const newItem = await response.json();
            alert("Item Added");
            setFormData({ item: "" });
            setItems((prev) => [...prev, newItem]);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("auth-token");
        const response = await fetch(`http://localhost:5000/items/${editItem._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedItem = await response.json();
            alert("Item Updated");
            setFormData({ item: "" });
            setItems((prev) =>
                prev.map((item) =>
                    item._id === updatedItem._id ? updatedItem : item
                )
            );
            setEditItem(null);
        }
    };

    return (
        <form onSubmit={editItem ? handleUpdate : handleSubmit} className="list-form">
            <input
                type="text"
                placeholder="Enter the Item"
                name="item"
                onChange={handleChange}
                value={formData.item}
            />
            <button type="submit">
                {editItem ? "Update Item" : "Add Item"}
            </button>
        </form>
    );
};

export default ListForm;
