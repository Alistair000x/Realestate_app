import { Link } from "react-router-dom";

import "./card.scss";

// Define the Card function component
function Card({ item }) {
  // Return the JSX for the Card component
  return (
    // Container element for the card
    <div className="card">
      // Link to the item's details page, with an image container
      <Link to={`/${item.id}`} className="imageContainer">
        // Display the first image of the item
        <img src={item.images[0]} alt="" />
      </Link>
      // Container element for the text content
      <div className="textContainer">
        // Display the item's title as a link to its details page
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        // Display the item's address
        <p className="address">
          // Icon for the address
          <img src="/pin.png" alt="" />
          // Text for the address
          <span>{item.address}</span>
        </p>
        // Display the item's price
        <p className="price">$ {item.price}</p>
        // Container element for the bottom section
        <div className="bottom">
          // Container element for the features
          <div className="features">
            // Display the bedroom feature
            <div className="feature">
              // Icon for the bedroom feature
              <img src="/bed.png" alt="" />
              // Text for the bedroom feature
              <span>{item.bedroom} bedroom</span>
            </div>
            // Display the bathroom feature
            <div className="feature">
              // Icon for the bathroom feature
              <img src="/bath.png" alt="" />
              // Text for the bathroom feature
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          // Container element for the icons
          <div className="icons">
            // Display the save icon
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            // Display the chat icon
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Card component as the default export
export default Card;