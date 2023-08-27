"use client";

import Modal from "./Modal";

const UploadModal = () => {
    return (
        <Modal title="Upload modal title" description="Upload modal description" isOpen onChange={() => { }}>
            Upload content
        </Modal>
    );
}

export default UploadModal;