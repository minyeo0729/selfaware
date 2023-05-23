/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import "./App.css";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = () => {
  const letters = ["M", "I", "N", "Y", "E", "O"];
  const divRef = useRef(null);

  useEffect(() => {
    const positionDivs = () => {
      const divSelection = Array.from(
        divRef.current.getElementsByClassName("clone")
      );

      const isOverlapping = (elem1, elem2) => {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();

        return (
          rect1.left < rect2.left + rect2.width &&
          rect1.left + rect1.width > rect2.left &&
          rect1.top < rect2.top + rect2.height &&
          rect1.top + rect1.height > rect2.top
        );
      };

      const wrapperRect = divRef.current.getBoundingClientRect();
      const wrapperWidth = wrapperRect.width;
      const wrapperHeight = wrapperRect.height;
      const cloneRect = divSelection[0].getBoundingClientRect();
      const cloneWidth = cloneRect.width;
      const cloneHeight = cloneRect.height;
      const minHorizontalDistance = cloneWidth;
      const maxRandomLeft = wrapperWidth - cloneWidth;
      const maxRandomTop = wrapperHeight - cloneHeight;

      const positions = new Set();

      divSelection.forEach((div, index) => {
        let randomLeft = getRandomNumber(0, maxRandomLeft);
        let randomTop = getRandomNumber(0, maxRandomTop);

        // Check for overlaps with previously positioned elements and minimum horizontal distance
        while (
          Array.from(positions).some(([left, top]) =>
            isOverlapping(div, {
              getBoundingClientRect: () => ({ left, top }),
            })
          ) ||
          Array.from(positions).some(
            ([left, _]) => Math.abs(randomLeft - left) < minHorizontalDistance
          )
        ) {
          randomLeft = getRandomNumber(0, maxRandomLeft);
          randomTop = getRandomNumber(0, maxRandomTop);
        }

        div.style.left = `${randomLeft}px`;
        div.style.top = `${randomTop}px`;

        positions.add([randomLeft, randomTop]);
      });
    };
    positionDivs()
  }, []);

  return (
    <div className="wrapper" ref={divRef}>
      {letters.map((letter, index) => (
        <div className="clone" key={index}>
          {letter}
        </div>
      ))}
    </div>
  );
};

export default App;
