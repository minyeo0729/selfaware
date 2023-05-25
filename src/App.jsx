/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {gsap} from 'gsap'

const App = () => {
  const colorArray = useMemo(() =>  [
  { background: "#019563", color: "#F7D9D3" },
  { background: "#f3be22", color: "#5267AB" },
  { background: "#5267AB", color: "#F7D9D3" },
  { background: "#ee4e2b", color: "#f3be22" },
  // { background: "#F7D9D3", color: "#ee4e2b" },
  ], []);

  const letters = ["M", "I", "N", "Y", "E", "O"];
  const divRef = useRef(null);
  const circleRef = useRef(null);
  const [textColor, setTextColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [animComplete, setAnimComplete] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

  const getRandomNumber = useCallback((min, max) => {
    const cloneElement = divRef.current.getElementsByClassName("clone")[0]
    const minValue = Math.max(min, cloneElement.clientWidth / 2); 
    return Math.floor(Math.random() * (max - minValue + 1)) + minValue;
  }, []);

  const positionDivs = useCallback(() => {
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
    const wrapperWidth =
      wrapperRect.width -
      2 * parseFloat(getComputedStyle(divRef.current).paddingLeft);
    const wrapperHeight =
      wrapperRect.height -
      2 * parseFloat(getComputedStyle(divRef.current).paddingTop);

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
      const randomAngle = Math.random() * 360;
      
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
      div.style.transform = `rotate(${randomAngle}deg)`;


      positions.add([randomLeft, randomTop]);
    });




  }, [getRandomNumber]);

  const changeColor = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % letters.length;
      const colorIndex = newIndex >= colorArray.length ? newIndex - colorArray.length : newIndex;
      setTextColor(colorArray[colorIndex].color);
      setBgColor(colorArray[colorIndex].background);
      return newIndex;
    });
  }, [colorArray, letters]);

  const makeCircle = (event) => {
    const { clientX, clientY } = event;
    setCirclePosition({ x: clientX, y: clientY });
    setShowCircle(true);
  };
 
  //when clone div is clicked, create circle, change color, position circle
  const handleClick = (event) => {
    makeCircle(event);
    changeColor();
    positionDivs();
    spread();


    shaky();
  };

  const spread = useCallback(() => {
    const circle = circleRef.current;
    let tl = gsap.timeline()
    if(showCircle){

      tl.fromTo(circle, {
        width: '50rem', 
        height: '50rem',
      },{ 
          width: "100%",
          height: "100%",
          scale:1.5,
          left: 0,
          top: 0,
          duration: 1,
          onComplete:  () => {
            tl.invalidate()

          }
        })
    }
  },[showCircle])

  const shaky = () => {
    
  const divSelection = Array.from(divRef.current.getElementsByClassName("clone"));
  const nextIndex = (currentIndex + 1) % divSelection.length;
  const nextDiv = divSelection[nextIndex];
  const siblings = Array.from(nextDiv.parentElement.children);
  const prevDiv = divSelection[currentIndex];

  siblings.forEach((sibling) => {
    sibling.classList.remove("shake");
  });

  nextDiv.classList.add("shake");
  setCurrentIndex(nextIndex);
  }

  //place them randomly when its loaded 
  useEffect(() => {
    positionDivs();
    spread();
    shaky();

  }, [positionDivs, spread]);


  return (
    <div className="wrapper" ref={divRef} style={animComplete ? { "--pink": bgColor } : null}>

      {letters.map((letter, index) => ( <div className={'clone'} key={index} style={{ "--red": textColor }} onClick={handleClick}>{letter}</div> ))}

      {showCircle && ( <div className="circle" style={{ top: circlePosition.y, left: circlePosition.x, "--bg": bgColor }} ref={circleRef} /> )}

    </div>
  );
};

export default App;


