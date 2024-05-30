import React from "react";
import Item from "../Item/Item";

const AllItems = ({ items, setEditItem, setItems }) => {
    return (
        <>
            {items.map((item) => (
                <Item
                    key={item._id}
                    item={item.item}
                    id={item._id}
                    setEditItem={setEditItem}
                    setItems={setItems}
                />
            ))}
        </>
    );
};

export default AllItems;
