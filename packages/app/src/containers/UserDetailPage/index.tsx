import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import Spinner from '../../components/Spinner';
import UserDetail from '../../components/UserDetail';
import useUser from '../../hooks/useUser';

function UserDetailPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [showModal, setShowModal] = useState(false);
    const { data: response, isLoading } = useUser(id);

    if (isLoading) return <Spinner />;

    return (
        <>
            <div className="w-full md:w-3/4 mx-auto mt-12 px-4">
                <h1 className="text-5xl text-gray-700">Profile Page</h1>
                <UserDetail user={response?.data.user} />
                <button
                    className="text-slate-600"
                    title="Open file upload"
                    onClick={() => setShowModal(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <FileUpload />
            </Modal>
        </>
    );
}

export default UserDetailPage;

interface ModalProps {
    children?: React.ReactNode;
    show: boolean;
    onClose: () => void;
}

function Modal({ children, show, onClose }: ModalProps): JSX.Element {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) {
            modalRef.current?.focus();
        }
    }, [show]);

    const handleKeyPress: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.code === 'Escape') {
            onClose();
        }
    };

    return (
        <div
            className={`${
                show ? 'block' : 'hidden'
            } fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-90`}
            tabIndex={0}
            ref={modalRef}
            onKeyUp={handleKeyPress}
        >
            <div className="relative mb-4 mx-auto w-5/6 md:w-1/2 lg:w-1/3 bg-white">
                {children}
                <button
                    className="absolute -top-6 right-0 text-white"
                    title="close modal"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
