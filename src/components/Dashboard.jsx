import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import Swal from 'sweetalert2'; // Import SweetAlert2

Modal.setAppElement('#root'); // For accessibility

const validateFlashcard = (card) => {
    const { question, answer } = card;
    if (question.trim().length < 5) return 'Question must be at least 5 characters long.';
    if (answer.trim().length < 10) return 'Answer must be at least 10 characters long.';
    return null;
};

const Dashboard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [newCard, setNewCard] = useState({ question: '', answer: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/flashcards`);
                setFlashcards(response.data);
            } catch (error) {
                toast.error('Failed to load flashcards.');
            }
        };

        fetchFlashcards();
    }, []);

    const handleAdd = async () => {
        const error = validateFlashcard(newCard);
        if (error) {
            toast.error(error);
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/flashcards`, newCard);
            setFlashcards([...flashcards, newCard]);
            setNewCard({ question: '', answer: '' });
            toast.success('Flashcard added successfully!');
        } catch (error) {
            toast.error('Failed to add flashcard.');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/flashcards/${id}`);
                setFlashcards(flashcards.filter((card) => card.id !== id));
                toast.success('Flashcard deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete flashcard.');
            }
        }
    };

    const handleUpdate = async () => {
        const error = validateFlashcard(editingCard);
        if (error) {
            toast.error(error);
            return;
        }

        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/flashcards/${editingCard.id}`, editingCard);
            setFlashcards(
                flashcards.map((card) => (card.id === editingCard.id ? editingCard : card))
            );
            setIsModalOpen(false);
            setEditingCard(null);
            toast.success('Flashcard updated successfully!');
        } catch (error) {
            toast.error('Failed to update flashcard.');
        }
    };

    return (
        <div className="p-6 min-h-screen text-white mt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">FlashCards Dashboard</h2>
            <div className="max-w-xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Question"
                    value={newCard.question}
                    onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                    className="w-full p-4 mb-4 bg-gray-800 rounded-lg text-white focus:outline-none"
                />
                <textarea
                    placeholder="Answer"
                    value={newCard.answer}
                    onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                    className="w-full p-4 mb-4 bg-gray-800 rounded-lg text-white focus:outline-none"
                    rows="4"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="w-full flex justify-center items-center p-4 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <AiOutlinePlus className="mr-2" />
                    Add Flashcard
                </motion.button>
            </div>
            <ul className="space-y-4">
                {flashcards.map((card, i) => (
                    <motion.li
                        key={i}
                        className="bg-gray-800 p-4 rounded-lg shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between flex-col md:flex-row items-start">
                            <div>
                                <p className="font-semibold text-xl">{card.question}</p>
                                <p className="text-gray-400">{card.answer}</p>
                            </div>
                            <div className="flex justify-end items-end w-full space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(card.id)}
                                    className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                                >
                                    <AiOutlineDelete className="text-xl" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setEditingCard(card);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 bg-yellow-600 rounded-full hover:bg-yellow-700 transition"
                                >
                                    <AiOutlineEdit className="text-xl" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.li>
                ))}
            </ul>

            {/* Modal for editing flashcard */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                contentLabel="Edit Flashcard Modal"
            >
                <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto text-white">
                    <h3 className="text-2xl font-bold mb-4">Edit Flashcard</h3>
                    {editingCard && (
                        <>
                            <input
                                type="text"
                                value={editingCard.question}
                                onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })}
                                className="w-full p-4 mb-4 bg-gray-700 rounded-lg text-white focus:outline-none"
                            />
                            <textarea
                                value={editingCard.answer}
                                onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })}
                                className="w-full p-4 mb-4 bg-gray-700 rounded-lg text-white focus:outline-none"
                                rows="4"
                            />
                            <div className="flex justify-end space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Save
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            <Toaster />
        </div>
    );
};

export default Dashboard;
