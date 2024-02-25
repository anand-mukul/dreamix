"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '../ui/use-toast';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
    imageId: string;
    imageURL: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ imageId, imageURL }) => {
    const [formData, setFormData] = useState({
        imageId,
        imageURL,
        message: '',
        reaction: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleReaction = (reaction: string) => {
        setFormData(prevState => ({
            ...prevState,
            reaction,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            if (!formData.message || !formData.reaction) {
                throw new Error('Please fill out all fields.');
            }
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setFormData({
                imageId: '',
                imageURL: '',
                message: '',
                reaction: ''
            });

            toast({
                title: "Feedback Submitted",
                description: "Thank you for your feedback! You will receive a confirmation email shortly.",
                duration: 5000,
                className: "success-toast",
            });
        } catch (error: any) {
            toast({
                title: "Submission Error",
                description: error.message || "We encountered an issue while processing your feedback. Please try again later.",
                duration: 5000,
                className: "error-toast",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="download-btn">
                    <Image
                        src="/assets/icons/feedback.svg"
                        alt="Download"
                        width={24}
                        height={24}
                        className="pb-[6px] translate-y-1"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex space-x-4">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "px-3 py-2 rounded",
                                    formData.reaction === '👍' ? "bg-blue-500 text-white" : "bg-transparent border border-blue-500 text-blue-500",
                                )}
                                onClick={() => handleReaction(formData.reaction === '👍' ? '' : '👍')}
                            >
                                👍
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "px-3 py-2 rounded",
                                    formData.reaction === '👎' ? "bg-red-500 text-white" : "bg-transparent border border-red-500 text-red-500",
                                )}
                                onClick={() => handleReaction('👎')}
                            >
                                👎
                            </motion.button>

                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid w-full gap-2">
                    <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Type your message here..."
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <div className="flex items-center justify-center">
                                <div className="w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin"></div>
                                <span className="ml-2">Submitting...</span>
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackForm;
