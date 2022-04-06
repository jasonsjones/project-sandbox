import React, { useRef, useState } from 'react';
import useFileUpload from '../../hooks/useFileUpload';
import { Button } from '../common';

const AvatarUploadOp = `
mutation AvatarUpload ($image: Upload!) {
    avatarUpload(image: $image)
}
`;

function FileUpload(): JSX.Element {
    const imgRef = useRef<HTMLImageElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [highlight, setHighlight] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');

    const { fileUpload } = useFileUpload({
        onSuccess: () => {
            clearFile();
        }
    });

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = () => {
        setHighlight(true);
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
        setHighlight(false);
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setHighlight(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleKeyPressOnChoosFile: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
        if (e.code === 'Enter') {
            fileRef.current?.click();
        }
    };

    const handleChooseFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target && e.target.files) {
            processFile(e.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        const variables = { image: null, operationName: 'UploadAvatar' };

        fileUpload({ query: AvatarUploadOp, variables, file: image as File });
    };

    const processFile = (file: File): void => {
        if (file.type === 'image/png') {
            setImage(file);
            setError('');
            const reader = new FileReader();
            reader.onloadend = function () {
                if (imgRef.current) {
                    imgRef.current.src = reader.result as string;
                }
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                if (imgRef.current) {
                    imgRef.current.src = '';
                }
            }
        } else {
            setError('Invalid file extension');
        }
    };

    const clearFile = (): void => {
        setImage(null);
    };

    return (
        <div className="text-gray-700 p-12">
            <h3 className="text-center text-2xl mb-2">Upload Image</h3>
            <p className="italic text-center mb-2">
                Note: Uploaded images are stored in-memory only. They will not persist between
                server starts.
            </p>
            {!image && (
                <>
                    <div
                        className={`p-6 border-2 border-dashed rounded-lg text-center ${
                            highlight ? 'border-green-600 bg-green-100' : 'border-gray-400'
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        Drop Zone <em>(.png only)</em>
                    </div>
                    {error && <p className="mt-2 text-red-700">Error: {error}</p>}
                    <form className="mt-8 flex justify-end">
                        <label htmlFor="fileupload">
                            <span
                                role="button"
                                aria-controls="fileupload"
                                tabIndex={0}
                                className="text-white bg-purple-800 rounded-lg px-4 py-3 cursor-pointer"
                                onKeyUp={handleKeyPressOnChoosFile}
                            >
                                Choose File
                            </span>
                        </label>
                        <input
                            type="file"
                            id="fileupload"
                            className="hidden"
                            accept="image/png"
                            ref={fileRef}
                            onChange={handleChooseFile}
                        />
                    </form>
                </>
            )}
            {image && (
                <div>
                    <div className="mt-4 p-4 flex border-2 rounded-lg">
                        <img
                            src=""
                            className="h-24 w-24 rounded-full"
                            alt="Avatar preview"
                            ref={imgRef}
                        />
                        <div className="ml-8 pt-4 text-gray-700 flex justify-between w-full">
                            <span className="">{image.name}</span>
                            <span>{image.size / 1000} Kb</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button className="my-4 mr-6" variant="secondary" clickAction={clearFile}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="my-4"
                            variant="primary"
                            clickAction={handleFileUpload}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default FileUpload;
