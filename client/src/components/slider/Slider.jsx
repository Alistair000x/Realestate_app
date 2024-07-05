import { useState } from "react";
import "./slider.scss";

// Slider component for displaying a carousel of images
function Slider({ images }) {
  // State to manage the current image index
  const [imageIndex, setImageIndex] = useState(null);

  // Function to change the slide based on the direction
  const changeSlide = (direction) => {
    if (direction === "left") {
      // If the direction is left, move to the previous image or loop to the last image
      setImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    } else {
      // If the direction is right, move to the next image or loop to the first image
      setImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img src="/arrow.png" alt="Left Arrow" />
          </div>
          <div className="imgContainer">
            <img src={images[imageIndex]} alt={`Slide ${imageIndex}`} />
          </div>
          <div className="arrow" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" className="right" alt="Right Arrow" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        <img src={images[0]} alt="Main Slide" onClick={() => setImageIndex(0)} />
      </div>
      <div className="smallImages">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt={`Thumbnail ${index + 1}`}
            key={index}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
