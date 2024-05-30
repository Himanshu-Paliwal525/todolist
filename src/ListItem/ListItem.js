import "./ListItem.css";
const ListItem = ({ item }) => {
    return (
        <div className="list-item">
            {item}
            <button>Edit</button>
            <button>Remove</button>
        </div>
    );
};

export default ListItem;
