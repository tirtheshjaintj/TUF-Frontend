import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FlashCards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dir,setDir]=useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/flashcards`).then((response) => {
        console.log(import.meta.env.VITE_BACKEND_URL);
      const shuffledCards = response.data.sort(() => Math.random() - 0.5);
      setFlashcards(shuffledCards);
    });
  }, []);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setDir(true);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setDir(false);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    flashcards.length > 0 && (
      <div className="flex flex-col items-center justify-center min-h-screen pt-5 md:pt-0">
        <div className="flip-card" onClick={handleFlip}>
          <motion.div
            key={`card-${currentCard}`}
            className="flip-card-inner"
            animate={{ rotateY: isFlipped ? 180 : 0,x:(dir)?[50,0]:[-50,0], scale: [0.5, 0.9, 1],opacity: [0.2, 1]}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ perspective: 1000 }}
          >
            <div className="flip-card-front">
              <p>Question</p>
              <p className="title">{flashcards[currentCard].question}</p>
            </div>
            <div className="flip-card-back">
              <p>Answer</p>
              <p className="title2">{flashcards[currentCard].answer}</p>
            </div>
          </motion.div>
        </div>
        <div className="mt-8 flex space-x-4">
          <motion.button
            className="px-6 py-3 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 text-white"
            onClick={handlePrevious}
            whileTap={{ scale: 0.9 }}
            animate={{ x: [-100, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <span>&#8592;</span> Previous
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 text-white"
            onClick={handleNext}
            whileTap={{ scale: 0.9 }}
            animate={{ x: [100, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            Next <span>&#8594;</span>
          </motion.button>
        </div>
        <div className="mt-8 flex space-x-4">
        <Link to="/dashboard">
        <motion.button
            className="px-6 py-3 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 text-white"
            onClick={handleNext}
            whileTap={{ scale: 0.9 }}
            animate={{ x: [100, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            DashBoard <span></span>
          </motion.button>
          </Link>
       </div>
      </div>
    )
  );
};

export default FlashCards;
